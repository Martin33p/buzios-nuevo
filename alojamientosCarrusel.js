function extraerIDYoutube(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

async function cargarAlojamientosCarrusel() {
  const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv";
  const response = await fetch(urlCSV);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  const alojamientos = parsed.data;

  const tipoSelect = document.getElementById("tipoAlojamiento");
  const estrellasSelect = document.getElementById("categoriaEstrellas");
  const swiperWrapper = document.querySelector(".swiper-wrapper");

  function filtrarYRenderizar() {
    const tipoFiltro = tipoSelect.value.toLowerCase();
    const estrellasFiltro = estrellasSelect.value;

    swiperWrapper.innerHTML = "";

    const alojamientosFiltrados = alojamientos.filter(aloj => {
      const tipo = (aloj["Tipo de hospedaje"] || "").toLowerCase();
      const estrellas = aloj["Estrellas"] || "";

      const coincideTipo = !tipoFiltro || tipo === tipoFiltro;
      const coincideEstrellas = !estrellasFiltro || estrellas === estrellasFiltro;

      return coincideTipo && coincideEstrellas;
    });

    if (alojamientosFiltrados.length === 0) {
      swiperWrapper.innerHTML = "<p style='padding:1rem;'>No se encontraron alojamientos para esa combinación.</p>";
      if (window.swiperCarrusel) window.swiperCarrusel.update();
      return;
    }

    alojamientosFiltrados.forEach(aloj => {
      const imagen1 = aloj["Imagen1_URL"] || "https://via.placeholder.com/200x120?text=Sin+imagen";
      const imagen2 = aloj["Imagen2_URL"] || "https://via.placeholder.com/200x120?text=Sin+imagen";
      const videoID = extraerIDYoutube(aloj["Video_URL"]);

      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      slide.innerHTML = `
        <div class="tarjeta-alojamiento">
          <h3>${aloj["Nombre"] || "Nombre no disponible"}</h3>
          <p><strong>Tipo:</strong> ${aloj["Tipo de hospedaje"]}</p>
          <p><strong>Estrellas:</strong> ${aloj["Estrellas"]}</p>
          <p><strong>Descripción:</strong> ${aloj["Descripción"] || "Sin descripción"}</p>
          <img src="${imagen1}" class="imagen-alojamiento" alt="Imagen 1">
          
          ${videoID ? `
            <iframe width="100%" height="160" 
              src="https://www.youtube.com/embed/${videoID}?autoplay=1&mute=1&loop=1&playlist=${videoID}&controls=0&modestbranding=1&rel=0"
              frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>` : ""
          }
          <a href="${aloj["Más_Info_URL"] || "#"}" class="boton-info" target="_blank">Ver más información</a>
        </div>
      `;
      swiperWrapper.appendChild(slide);
    });

    if (window.swiperCarrusel) {
      window.swiperCarrusel.update();
    } else {
      window.swiperCarrusel = new Swiper(".swiper", {
        slidesPerView: 1.2,
        spaceBetween: 10,
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 5 },
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
  }

  tipoSelect.addEventListener("change", filtrarYRenderizar);
  estrellasSelect.addEventListener("change", filtrarYRenderizar);
  document.getElementById("verTodosBtn").addEventListener("click", () => {
    tipoSelect.value = "";
    estrellasSelect.value = "";
    filtrarYRenderizar();
  });
  
}

document.addEventListener("DOMContentLoaded", cargarAlojamientosCarrusel);
