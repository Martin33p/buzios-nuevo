function cargarHeaderYFooter() {
  fetch("header.html")
    .then(res => res.text())
    .then(data => document.getElementById("header").innerHTML = data);

  fetch("footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
}

let map;
let infoBox;
let playas = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -22.757, lng: -41.884 },
    zoom: 13,
    mapTypeId: 'satellite',
  });

  infoBox = document.getElementById("info-box");
  cargarHeaderYFooter();
  cargarDatosDesdeSheets();
}

async function cargarDatosDesdeSheets() {
  const spreadsheetId = "1zB-BbVoKArPHZa5QslG9XgPXNEM97c40jRIteOu25Po";
  const sheetName = "Playas";
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    playas = rows.map(r => {
      const c = r.c;
      return {
        id: c[0]?.v || "",
        nombre: c[1]?.v || "",
        lat: parseFloat(c[2]?.v) || 0,
        lng: parseFloat(c[3]?.v) || 0,
        descripcion: c[4]?.v || "",
        imagenes: [c[6]?.v, c[7]?.v].filter(v => v && v.trim() !== ""),
        videos: [c[16]?.v].filter(Boolean)
      };
    });

    const filtradas = playas.filter(p => {
      const nombre = p.nombre.toLowerCase();
      return !["hotel", "hostel", "posada", "hospedaje", "pousada"].some(w => nombre.includes(w));
    });

    filtradas.forEach(playa => agregarMarcador(playa));

    const id = new URLSearchParams(window.location.search).get("id");
    if (id) {
      const seleccionada = filtradas.find(p => p.id === id);
      if (seleccionada) mostrarInfo(seleccionada);
    }

  } catch (err) {
    console.error("Error cargando datos:", err);
  }
}

function agregarMarcador(playa) {
  const marker = new google.maps.Marker({
    position: { lat: playa.lat, lng: playa.lng },
    map,
    title: playa.nombre,
  });

  marker.addListener("click", () => mostrarInfo(playa));
}

function mostrarInfo(playa) {
  if (!infoBox) return;

  const imagenes = playa.imagenes
    .filter(img => img && img.trim() !== "")
    .map(img => `<img src="${img}" class="playa-imagen">`)
    .join("");

  const video = playa.videos[0];
  const id = extraerIDVideo(video);
  const videoHtml = id
    ? `<iframe
         src="https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&mute=1"
         frameborder="0"
         allow="autoplay; encrypted-media"
         allowfullscreen
         class="playa-video"
       ></iframe>`
    : "";

  infoBox.innerHTML = `
    <h3>${playa.nombre}</h3>
    <p>${playa.descripcion}</p>
    <div class="imagenes">${imagenes}</div>
    <div class="video">${videoHtml}</div>
    <a href="playas.html?id=${playa.id}" target="_blank" style="display:inline-block;margin-top:1rem;background:#007bff;color:#fff;padding:0.6rem 1rem;border-radius:6px;text-decoration:none;">Ver más información</a>
  `;
  infoBox.style.display = "block";
  infoBox.scrollIntoView({ behavior: "smooth" });
}

function extraerIDVideo(url) {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : null;
}
