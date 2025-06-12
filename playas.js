// playas.js

// Función para cargar las playas en el submenú
async function cargarSubMenuPlayas() {
  const spreadsheetId = "1zB-BbVoKArPHZa5QslG9XgPXNEM97c40jRIteOu25Po";
  const sheetName = "Playas";
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`;

  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    const playas = rows.map(r => {
      const c = r.c;
      return {
        id: c[0]?.v || "",
        nombre: c[1]?.v || "",
      };
    });

    // Llenar el submenú con las playas
    const subMenu = document.getElementById("sub-menu-playas");
    playas.forEach(playa => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `playas.html?id=${playa.id}`;
      a.innerText = playa.nombre;
      li.appendChild(a);
      subMenu.appendChild(li);
    });

    // Evento para mostrar/ocultar el submenú al hacer clic en "Playas"
    const menuPlayas = document.getElementById("menu-playas");
    menuPlayas.addEventListener("click", (e) => {
      e.preventDefault();  // Evitar que se recargue la página
      subMenu.classList.toggle("visible");  // Alterna la visibilidad del submenú
    });

  } catch (err) {
    console.error("Error cargando datos de playas:", err);
  }
}

// Cargar el submenú cuando la página cargue
window.onload = cargarSubMenuPlayas;
