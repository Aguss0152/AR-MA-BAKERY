document.addEventListener('DOMContentLoaded', () => {
    const hamburguesa = document.querySelector('.hamburguesa');
    const nav_links = document.querySelector('.nav_links');

    if (hamburguesa && nav_links) {
        hamburguesa.addEventListener('click', () => {
            nav_links.classList.toggle('active');
            hamburguesa.classList.toggle('active');
        });
    } else {
        console.error('No se encontraron los elementos .hamburguesa o .nav_links. Verifica tus selectores.');
    }

    // Nuevo código para el botón de "Ver"
    const postresLink = document.getElementById('postres-link');

    if (postresLink) {
        postresLink.addEventListener('click', (event) => {
            // Previene la navegación inmediata del enlace
            event.preventDefault();

            // Añade la clase 'loading' al enlace para mostrar el spinner
            postresLink.classList.add('loading');

            // Obtiene la URL del enlace
            const href = postresLink.href;

            // Retrasa la navegación de la página para que el usuario pueda ver el spinner
            setTimeout(() => {
                window.location.href = href;
            }, 1000); // Retraso de 1 segundo (1000 ms)
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const instagram = document.querySelector('.instagram');
    if (instagram) {
        instagram.addEventListener('click', () => {
            window.open('https://www.instagram.com/aromaabakery?igsh=ZWczb3drZTdpdnpn', '_blank');
        });
    }
});