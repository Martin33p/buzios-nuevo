function extraerIDYoutube(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : null;
}

function obtenerParametroURL(nombre) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nombre);
}

async function cargarAlojamientoIndividual() {
  const idBuscado = obtenerParametroURL("id");
  if (!idBuscado) {
    document.getElementById("contenido-alojamiento").innerHTML = `<p>No se especificó ningún alojamiento.</p>`;
    return;
  }

  const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv";
  const response = await fetch(urlCSV);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  const alojamiento = parsed.data.find(item => item["ID"] === idBuscado);

  if (!alojamiento) {
    document.getElementById("contenido-alojamiento").innerHTML = `<p>No se encontró el alojamiento solicitado.</p>`;
    return;
  }

  // Mostrar nombre, estrellas y descripción
  document.getElementById("nombre-alojamiento").textContent = alojamiento["Nombre"];
  document.getElementById("estrellas-alojamiento").innerHTML = "⭐".repeat(parseInt(alojamiento["Estrellas"]) || 0);
  document.getElementById("descripcion-alojamiento").textContent = alojamiento["Descripción"];

  // Cargar imágenes
  const contenedorImagenes = document.getElementById("galeria-imagenes");
  contenedorImagenes.innerHTML = "";

  for (let i = 1; i <= 10; i++) {
    const url = alojamiento[`Imagen${i}_URL`];
    if (url) {
      const img = document.createElement("img");
      img.src = url;
      img.alt = `${alojamiento["Nombre"]} - Imagen ${i}`;
      img.classList.add("imagen-galeria");
      contenedorImagenes.appendChild(img);
    }
  }

  // Cargar videos
  const contenedorVideos = document.getElementById("videos-alojamiento");
  contenedorVideos.innerHTML = "";

  const video1ID = extraerIDYoutube(alojamiento["Video_URL"]);
  const video2ID = extraerIDYoutube(alojamiento["Video2_URL"]);

  [video1ID, video2ID].forEach(id => {
    if (id) {
      const iframe = document.createElement("iframe");
      iframe.width = "480";
      iframe.height = "270";
      iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1`;
      iframe.frameBorder = "0";
      iframe.allowFullscreen = true;
      iframe.classList.add("video-embed");
      contenedorVideos.appendChild(iframe);
    }
  });

  // Servicios e info detallada
  const infoExtra = document.getElementById("info-extra");
  infoExtra.innerHTML = `
    <li><strong>Tipo:</strong> ${alojamiento["Tipo de hospedaje"]}</li>
    <li><strong>Dirección:</strong> ${alojamiento["Dirección"]}</li>
    <li><strong>Dormitorios:</strong> ${alojamiento["Dormitorios"]}</li>
    <li><strong>Camas:</strong> ${alojamiento["Camas"]}</li>
    <li><strong>Baños compartidos:</strong> ${alojamiento["Hab_CBaños"]}</li>
    <li><strong>Baños suite:</strong> ${alojamiento["Hab_SBaños"]}</li>
    <li><strong>Check-in:</strong> ${alojamiento["CheckIn"]}</li>
    <li><strong>Check-out:</strong> ${alojamiento["CheckOut"]}</li>
    <li><strong>Servicios:</strong></li>
    <ul>
      <li>Internet: ${alojamiento["Internet"]}</li>
      <li>Agua corriente: ${alojamiento["Agua corriente"]}</li>
      <li>Agua caliente: ${alojamiento["Agua_Caliente"]}</li>
      <li>Aire acondicionado: ${alojamiento["Aire"]}</li>
      <li>Juegos: ${alojamiento["Juegos"]}</li>
      <li>Suite: ${alojamiento["Suite"]}</li>
      <li>Gimnasio: ${alojamiento["Gym"]}</li>
      <li>Jacuzzi: ${alojamiento["Jacuzzi"]}</li>
      <li>Lavarropa: ${alojamiento["Lavarropa"]}</li>
      <li>Parrilla: ${alojamiento["Parrilla"]}</li>
      <li>Pileta: ${alojamiento["Pileta"]}</li>
      <li>Limpieza: ${alojamiento["Limpieza"]}</li>
      <li>TV: ${alojamiento["TV"]}</li>
      <li>Seguridad: ${alojamiento["Seguridad"]}</li>
    </ul>
    <li><strong>Precio estimado:</strong> ${alojamiento["Precio"]}</li>
    <li><strong><a href="${alojamiento["Más_Info_URL"]}" target="_blank">Más información</a></strong></li>
  `;

  // Botón volver
  document.getElementById("volver-btn").innerHTML = `
    <a href="/calculadora.html" class="volver-btn">← Volver a alojamientos</a>
  `;
}

function incluirHeaderYFooter() {
  fetch("/componentes/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header").innerHTML = data;
    });

  fetch("/componentes/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    });
}

incluirHeaderYFooter();
cargarAlojamientoIndividual();
