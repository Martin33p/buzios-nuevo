async function cargarPosada() {
  // Obtener el parámetro ID de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const posadaID = urlParams.get('id');

  if (!posadaID) {
    console.error('No se ha proporcionado un ID de posada.');
    return;
  }

  const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv"; // URL del CSV
  const response = await fetch(urlCSV);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  const Hospedajes = parsed.data;

  // Buscar el alojamiento por ID
  const posada = Hospedajes.find(a => a.ID === posadaID);

  if (!posada) {
    console.error('Posada no encontrada.');
    return;
  }

  // Cargar los detalles de la posada
  const nombre = posada["Nombre"] || "Nombre no disponible";
  const tipo = posada["Tipo de hospedaje"] || "No especificado";
  const estrellas = posada["Estrellas"] || "0";
  const descripcion = posada["Descripción"] || "Sin descripción";
  const imagen1 = posada["Imagen1_URL"] || "https://via.placeholder.com/200x120?text=Sin+imagen";
  const videoID = extraerIDYoutube(posada["Video_URL"]);
  const urlInfo = posada["Más_Info_URL"];

  const estrellasHTML = "⭐".repeat(parseInt(estrellas)) || "Sin estrellas";

  // Mostrar la información en la página
  document.getElementById("nombre-posada").innerText = nombre;
  document.getElementById("tipo-posada").innerText = tipo;
  document.getElementById("estrellas-posada").innerHTML = estrellasHTML;
  document.getElementById("descripcion-posada").innerText = descripcion;
  document.getElementById("imagen-posada").src = imagen1;

  if (videoID) {
    document.getElementById("video-posada").innerHTML = `
  <iframe width="100%" height="315" 
    src="https://www.youtube.com/embed/${videoID}?rel=0&modestbranding=1&controls=1"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen>
  </iframe>
`;
  }

  if (urlInfo) {
    document.getElementById("mas-info").innerHTML = `<a href="${urlInfo}" target="_blank">Ver más información</a>`;
  } else {
    document.getElementById("mas-info").innerHTML = `<button disabled>Sin más información</button>`;
  }
}

// Cargar los detalles de la posada cuando la página esté lista
document.addEventListener("DOMContentLoaded", cargarPosada);
