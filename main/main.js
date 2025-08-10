document.addEventListener('DOMContentLoaded', () => {
    const hamburguesa = document.querySelector('.hamburguesa');
    const nav_links = document.querySelector('.nav_links');

    if (hamburguesa && nav_links) {
        hamburguesa.addEventListener('click', () => {
            nav_links.classList.toggle('active');
            hamburguesa.classList.toggle('active');
        });
    } else {
        // Corrección del selector: debería ser .hamburguesa
        console.error('No se encontraron los elementos .hamburguesa o .nav_links. Verifica tus selectores.');
    }
});