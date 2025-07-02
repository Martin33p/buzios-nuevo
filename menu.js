// Función para inicializar el menú hamburguesa
function initMenu() {
  const hamburguesa = document.querySelector('.hamburguesa');
  const menu = document.querySelector('.menu');  // Aquí seleccionamos el contenedor del menú

  // Verificar si los elementos existen antes de agregar el evento
  if (hamburguesa && menu) {
    hamburguesa.addEventListener('click', () => {
      menu.classList.toggle('show');  // Alternar la clase 'show' para mostrar/ocultar el menú
      console.log("Hamburguesa clickeada");  // Verificar si el evento se dispara
    });
  } else {
    console.error("No se encontró el botón de hamburguesa o el menú.");
  }
}

// Asegurarse de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM cargado, inicializando el menú.");
  initMenu();  // Inicializa el menú hamburguesa cuando el DOM está listo
});
