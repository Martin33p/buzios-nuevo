// Función para extraer el ID de YouTube
function extraerIDYoutube(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

// Función para cargar los Hospedajes en el carrusel
async function cargarHospedajesCarrusel() {
  const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv";
  const response = await fetch(urlCSV);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  const Hospedajes = parsed.data;

  const tipoSelect = document.getElementById("tipoAlojamiento");
  const estrellasSelect = document.getElementById("categoriaEstrellas");
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  const verTodosBtn = document.getElementById("verTodosBtn");

  function filtrarYRenderizar() {
    const tipoFiltro = (tipoSelect?.value || "").toLowerCase();
    const estrellasFiltro = estrellasSelect?.value || "";

    swiperWrapper.innerHTML = ""; // Limpiar el carrusel

    const HospedajesFiltrados = Hospedajes.filter(aloj => {
      const tipo = (aloj["Tipo de hospedaje"] || "").toLowerCase();
      const estrellas = aloj["Estrellas"] || "";

      const coincideTipo = !tipoFiltro || tipo === tipoFiltro;
      const coincideEstrellas = !estrellasFiltro || estrellas === estrellasFiltro;

      return coincideTipo && coincideEstrellas;
    });

    if (HospedajesFiltrados.length === 0) {
      swiperWrapper.innerHTML = "<p style='padding:1rem;'>No se encontraron Hospedajes para esa combinación.</p>";
      if (window.swiperCarrusel) window.swiperCarrusel.update();
      return;
    }

    // Renderizar las fichas de alojamiento
    HospedajesFiltrados.forEach(aloj => {
      const nombre = aloj["Nombre"] || "Nombre no disponible";
      const tipo = aloj["Tipo de hospedaje"] || "No especificado";
      const estrellas = aloj["Estrellas"] || "0";
      const descripcion = aloj["Descripción"] || "Sin descripción";
      const imagen1 = aloj["Imagen1_URL"] || "https://via.placeholder.com/200x120?text=Sin+imagen";
      const videoID = extraerIDYoutube(aloj["Video_URL"]);

      const estrellasHTML = "⭐".repeat(parseInt(estrellas)) || "Sin estrellas";

      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="tarjeta-alojamiento">
          <h3>${nombre}</h3>
          <p><strong>Tipo:</strong> ${tipo}</p>
          <p><strong>Estrellas:</strong> ${estrellasHTML}</p>
          <p><strong>Descripción:</strong> ${descripcion}</p>
          <img src="${imagen1}" class="imagen-alojamiento" alt="Imagen de ${nombre}">

          ${videoID ? ` 
            <iframe width="100%" height="160"
              src="https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&playlist=${videoID}&controls=1&modestbranding=1&rel=0"
              frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>` : ""
          }

          <button class="mas-info-boton" onclick="location.href='posada.html?id=${encodeURIComponent(aloj.ID)}'">
            Más información
          </button>
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });

    // Iniciar Swiper solo después de haber añadido las fichas
    if (window.swiperCarrusel) {
      window.swiperCarrusel.update(); // Actualiza el carrusel si ya existe
    } else {
      window.swiperCarrusel = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: false, // No centrado por defecto

        breakpoints: {
          640: { slidesPerView: 2, centeredSlides: false },
          1024: { slidesPerView: 3, centeredSlides: false },
          1280: { slidesPerView: 5, centeredSlides: false },
        },
        
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        on: {
          init: function () {
            const swiper = this;
            // Si solo hay una ficha, centramos la ficha
            if (swiper.slides.length <= 1) {
              swiper.params.centeredSlides = true;  // Centra el carrusel si solo hay 1 ficha
              swiper.update();
            }
          }
        }
      });
    }
  }

  tipoSelect?.addEventListener("change", filtrarYRenderizar);
  estrellasSelect?.addEventListener("change", filtrarYRenderizar);

  if (verTodosBtn) {
    verTodosBtn.addEventListener("click", () => {
      if (tipoSelect) tipoSelect.value = "";
      if (estrellasSelect) estrellasSelect.value = "";
      filtrarYRenderizar();
    });
  }

  filtrarYRenderizar(); // Mostrar inicialmente
}

document.addEventListener("DOMContentLoaded", cargarHospedajesCarrusel);
