document.addEventListener("DOMContentLoaded", function () {
    inicializarMapa();
    inicializarcalculadora();
    obtenerPrecios();
});

var playas = [
    { 
      nombre: "Playa João Fernandes", 
      x: "79.5%", 
      y: "26%", 
      datos: "Altura de olas: 1m | Temp: 24°C | Largo de playa: 200 mts.", 
      img: "img/joao-fernandes.jpg",
      img2: "img/joao-fernandes2.jpg",
      video: "videos/joao-fernandes.mp4",
      link: "playas/joao-fernandes.html"
    },
    { 
      nombre: "Playa Geribá", 
      x: "22.5%", 
      y: "55.4%", 
      datos: "Altura de olas: 2m | Temp: 23°C | Largo de playa: 2 km.", 
      img: "img/playa-geriba.jpg",
      video: "videos/playa-geriba.mp4",
      link: "playas/geriba.html"
    },
    { 
      nombre: "Playa Azeda", 
      x: "74%", 
      y: "25%", 
      datos: "Agua cristalina | Temp: 25°C | Perfecta para snorkel", 
      img: "img/playa-azeda.jpg",
      video: "videos/playa-azeda.mp4",
      link: "playas/azeda.html"
    }
  ];

var mapContainer = document.getElementById("map-container");
var infoBox = document.getElementById("info-box");
var fixed = false; // Controla si la info está fijada

if (mapContainer) {
    playas.forEach(playa => {
        var marker = document.createElement("div");
        marker.className = "marker";
        marker.style.position = "absolute";
        marker.style.left = playa.x;
        marker.style.top = playa.y;

        // Asegurar que el ícono se muestra correctamente
        var icono = document.createElement("img");
        icono.src = "img/circulo-rojo.png";  // Reemplaza con la ruta correcta
        icono.width = 15;
        icono.height = 15;
        marker.appendChild(icono);

        // Mostrar info al pasar el mouse (si no está fijado)
        marker.addEventListener("mouseenter", function(event) {
            if (!fixed) {
                mostrarInfoPlaya(playa, event);
            }
        });

        // Ocultar info cuando el mouse sale (si no está fijado)
        marker.addEventListener("mouseleave", function() {
            if (!fixed) {
                ocultarInfoPlaya();
            }
        });

        // Fijar o liberar el menú al hacer clic
        marker.addEventListener("click", function() {
            fixed = !fixed;
            if (fixed) {
                mostrarInfoPlaya(playa);
            } else {
                ocultarInfoPlaya();
            }
        });

        mapContainer.appendChild(marker);
    });
} else {
    console.error("Error: No se encontró el contenedor del mapa.");
}

function mostrarInfoPlaya(playa, event = null) {
    console.log("Mostrando info de:", playa.nombre); // Verifica si entra en la función

    let infoBox = document.getElementById("info-box");

    infoBox.innerHTML = `
    <h3>${playa.nombre}</h3>
    <p>${playa.datos}</p>
    <img src="${playa.img}" alt="${playa.nombre}">
    <img src="${playa.img2}" alt="${playa.nombre} - 2">
    <video src="${playa.video}" autoplay muted loop controls></video>
    <a href="${playa.link}" target="_blank">Ver más información</a>
  `;

    infoBox.style.display = "block"; // Asegura que se muestre

    if (event) {
        infoBox.style.top = (event.clientY + 10) + "px";
        infoBox.style.left = (event.clientX + 40) + "px";
    }
}

function ocultarInfoPlaya() {
    console.log("Ocultando info"); // Verifica si entra en la función
    if (!fixed) {
        document.getElementById("info-box").style.display = "none";
    }
}

async function obtenerPrecios() {
    const url = "https://script.google.com/macros/s/..."; // Reemplaza con tu URL real
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Error al conectar con Google Apps Script");
        let precios = await response.json();
        console.log("Precios obtenidos:", precios);
    } catch (error) {
        console.error("Error al obtener precios:", error);
    }
}

function inicializarcalculadora() {
    const searchButton = document.getElementById("search-button");
    const ofertasContainer = document.getElementById("lista-ofertas");
    const summaryBox = document.getElementById("summary");
    let selectedOptions = [];

    searchButton.addEventListener("click", function () {
        const fechaLlegada = document.getElementById("fecha-llegada").value;
        const fechaSalida = document.getElementById("fecha-salida").value;
        if (!fechaLlegada || !fechaSalida) {
            alert("Seleccione fechas de estadía.");
            return;
        }
        mostrarOfertas();
    });

    function mostrarOfertas() {
        ofertasContainer.innerHTML = "";
        const ofertas = [
            { nombre: "Hotel 5 estrellas", precio: 150, img: "img/hotel.jpg", link: "hoteles.html" },
            { nombre: "Travesía marítima", precio: 200, img: "img/travesia.jpg", link: "travesia.html" },
            { nombre: "Buggies", precio: 100, img: "img/buggies.jpg", link: "buggies.html" },
            { nombre: "Equipo de snorkel", precio: 50, img: "img/snorkel.jpg", link: "snorkel.html" }
        ];
        ofertas.forEach(oferta => {
            const ofertaDiv = document.createElement("div");
            ofertaDiv.classList.add("oferta");
            ofertaDiv.innerHTML = `
                <img src="${oferta.img}" alt="${oferta.nombre}">
                <h3>${oferta.nombre}</h3>
                <p>Precio: $${oferta.precio}</p>
                <button onclick="agregarAlCarrito('${oferta.nombre}', ${oferta.precio})">Agregar</button>
                <a href="${oferta.link}" target="_blank">Ver más</a>
            `;
            ofertasContainer.appendChild(ofertaDiv);
        });
    }

    window.agregarAlCarrito = function (nombre, precio) {
        selectedOptions.push({ nombre, precio });
        actualizarResumen();
    };

    function actualizarResumen() {
        summaryBox.innerHTML = "<h3>Resumen de compra</h3>";
        let total = selectedOptions.reduce((sum, item) => sum + item.precio, 0);
        selectedOptions.forEach(item => summaryBox.innerHTML += `<p>${item.nombre}: $${item.precio}</p>`);
        summaryBox.innerHTML += `<h4>Total: $${total}</h4>`;
    }
}
