document.addEventListener('DOMContentLoaded', () => {
    const hamburguesa = document.querySelector('.hamburguesa');
    const nav_links = document.querySelector('.nav_links');

    if (hamburguesa && nav_links) {
        hamburguesa.addEventListener('click', () => {
            nav_links.classList.toggle('active');
            hamburguesa.classList.toggle('active'); // Para animar el botón hamburguesa
        });
    } else {
        console.error('No se encontraron los elementos .amburguesa o .nav_links. Verifica tus selectores.');
    }
});