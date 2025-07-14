// Buzios-Brasil.js

document.addEventListener('DOMContentLoaded', () => {
  cargarImagenesHospedajes();
  cargarGaleriaPlayas();
  cargarGaleriaActividades();
  cargarFooter();
});

function cargarFooter() {
  fetch("footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer").innerHTML = data;
    })
    .catch(error => console.error("Error al cargar el footer:", error));
}

function cargarImagenesHospedajes() {
  const urlHospedajes = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv";

  fetch(urlHospedajes)
    .then(res => res.text())
    .then(csv => {
      const datos = Papa.parse(csv, { header: true }).data;
      const contenedor = document.getElementById("imagenes-Hospedajes");

      datos.forEach(item => {
        const imagen = item["Imagen1_URL"];
        const titulo = item["ID"];
        if (imagen && imagen.trim() !== "") {
          const div = document.createElement("div");
          div.classList.add("galeria-item");
          div.innerHTML = `<img src="${imagen}" alt="${titulo}"><p>${titulo}</p>`;
          contenedor.appendChild(div);
        }
      });
    })
    .catch(error => console.error("Error al cargar las imágenes de Hospedajes:", error));
}

function cargarGaleriaPlayas() {
  const spreadsheetId = "1zB-BbVoKArPHZa5QslG9XgPXNEM97c40jRIteOu25Po";
  const sheetName = "Playas";
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47).slice(0, -2));
      const rows = json.table.rows;
      const contenedor = document.getElementById("imagenes-Playas");

      rows.forEach(row => {
        const columnas = row.c;
        const nombre = columnas[1]?.v || "";
        const imagen = columnas[6]?.v || "";

        if (imagen && nombre) {
          const div = document.createElement("div");
          div.classList.add("galeria-item");
          div.innerHTML = `<img src="${imagen}" alt="${nombre}"><p>${nombre}</p>`;
          contenedor.appendChild(div);
        }
      });
    })
    .catch(error => console.error("Error al cargar las imágenes de Playas:", error));
}

function cargarGaleriaActividades() {
  const urlActividades = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=1341822128&single=true&output=csv";

  fetch(urlActividades)
    .then(res => res.text())
    .then(csv => {
      const datos = Papa.parse(csv, { header: true }).data;
      const contenedor = document.getElementById("imagenes-Actividades");

      datos.forEach(item => {
        const imagen = item["Img1"];
        const titulo = item["Nombre"];

        if (imagen && imagen.trim() !== "") {
          const div = document.createElement("div");
          div.classList.add("galeria-item");
          div.innerHTML = `<img src="${imagen}" alt="${titulo}"><p>${titulo}</p>`;
          contenedor.appendChild(div);
        }
      });
    })
    .catch(error => console.error("Error al cargar las imágenes de Actividades:", error));
}
