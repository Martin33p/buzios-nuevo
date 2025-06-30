// Función para inicializar el menú hamburguesa
function initMenu() {
  const hamburguesa = document.querySelector('.hamburguesa');
  const menu = document.querySelector('.menu ul');  // Cambié el selector para que apunte al <ul> dentro de .menu

  // Si el botón hamburguesa y el menú existen en la página
  if (hamburguesa && menu) {
    hamburguesa.addEventListener('click', () => {
      // Alternar la clase "show" en el menú
      menu.classList.toggle('show');
    });
  }
}

// Ejecutar la función de inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  initMenu();  // Inicializa el menú hamburguesa

  // Aquí agregas el listener para la restauración de la página desde la caché del navegador
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) { 
        // Si la página fue restaurada desde la cache de historial
        initMenu(); // Re-inicializa el menú para asegurarse de que los eventos estén activos
    }
  });
});
