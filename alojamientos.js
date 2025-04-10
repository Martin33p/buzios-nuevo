function extraerIDYoutube(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    return match ? match[1] : null;
  }
  
  async function cargarAlojamientos() {
    const urlCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL9Z79Drl1elK-ZvDBK50V61OL8BXbKu9zEGF61WlzrR5aShOXtetnLV-zIENQbmEO9t0kMAxANr9i/pub?gid=0&single=true&output=csv";
  
    const response = await fetch(urlCSV);
    const csvText = await response.text();
  
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    });
  
    const alojamientos = parsed.data;
  
    const contenedor = document.getElementById("contenedor-alojamientos");
  
    alojamientos.forEach(aloj => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("tarjeta-alojamiento");
  
      const tipo = aloj["Tipo de hospedaje"] || "No especificado";
      const estrellas = aloj["Estrellas"] || "Sin clasificar";
      const descripcion = aloj["Descripción"] || "Descripción no disponible";
      const imagen = aloj["Imagen1_URL"] || "https://via.placeholder.com/200x120?text=Sin+imagen";
      const videoID = extraerIDYoutube(aloj["Video_URL"]);
  
      tarjeta.innerHTML = `
        <h3>${aloj["Nombre"] || "Nombre no disponible"}</h3>
        <p><strong>Tipo:</strong> ${tipo}</p>
        <p><strong>Estrellas:</strong> ${estrellas}</p>
        <p><strong>Descripción:</strong> ${descripcion}</p>
        <img src="${imagen}" alt="Imagen de ${aloj["Nombre"]}" width="200"><br>
        ${
          videoID
            ? `<iframe width="250" height="140" src="https://www.youtube.com/embed/${videoID}" 
                 frameborder="0" allowfullscreen></iframe>`
            : ""
        }
        <br>
        <a href="${aloj["Más_Info_URL"] || "#"}" target="_blank">Ver más información</a>
      `;
  
      contenedor.appendChild(tarjeta);
    });
  }
  
  cargarAlojamientos();
  