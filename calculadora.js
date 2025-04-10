async function obtenerPrecios() {
    const url = "https://script.google.com/macros/s/AKfycbw4lVp9pIJtQllCfHNS3jwY-D2qjcWkvd2dkNU-Xk1GFw8dJED5gtXK-HBwCBPtBgGupA/exec";

    try {
        const response = await fetch(url); // sin "no-cors"
        
        if (!response.ok) throw new Error("Error en la respuesta de la red");
        
        const precios = await response.json();
        console.log(precios);
    } catch (error) {
        console.error("Error al obtener los precios:", error);
    }
}

obtenerPrecios();
document.addEventListener("DOMContentLoaded", () => {
    const checkboxSnorkel = document.getElementById("snorkel");
    const tarjeta = document.getElementById("tarjeta-snorkel");

    checkboxSnorkel.addEventListener("change", () => {
        if (checkboxSnorkel.checked) {
            tarjeta.style.display = "block";
        } else {
            tarjeta.style.display = "none";
        }
    });
});
