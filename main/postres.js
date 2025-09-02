document.addEventListener('DOMContentLoaded', () => {
    // Lógica del menú de hamburguesa
    const hamburguesa = document.querySelector('.hamburguesa');
    const navegador2 = document.querySelector('.navegador2');
    if (hamburguesa && navegador2) {
        hamburguesa.addEventListener('click', () => {
            navegador2.classList.toggle('active');
            hamburguesa.classList.toggle('active');
        });
    }

    // --- Carrito dinámico ---
    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }
    function setCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }
    function actualizarContador() {
        document.getElementById('contador-carrito').textContent = getCarrito().length;
    }
    function agregarProducto(nombre, precio) {
        const carrito = getCarrito();
        carrito.push({ nombre, precio });
        setCarrito(carrito);
        actualizarContador();
    }

    // Botones "Agregar"
    document.querySelectorAll('.mostrar, .mostrar-mini, .mostrar-sg').forEach(btn => {
        btn.onclick = function(e) {
            // Detecta el producto y precio según el contexto
            let nombre = '', precio = 0;
            const tarjeta = e.target.closest('[data-nombre],[class^="tarjeta"],.postres-pote,.alfajores-maicena');
            // Budines
            if (tarjeta.classList.contains('tarjeta-budin')) {
                const select = tarjeta.querySelector('select');
                nombre = select.selectedOptions[0].dataset.nombre;
                precio = Number(select.selectedOptions[0].dataset.precio);
            }
            // Mini budines
            else if (tarjeta.classList.contains('tarjeta-mini-budin')) {
                const select = tarjeta.querySelector('select');
                nombre = select.selectedOptions[0].dataset.nombre;
                precio = Number(select.selectedOptions[0].dataset.precio);
            }
            // Sin gluten
            else if (tarjeta.classList.contains('tarjeta-sin-gluten')) {
                const select = tarjeta.querySelector('select');
                nombre = select.selectedOptions[0].dataset.nombre;
                precio = Number(select.selectedOptions[0].dataset.precio);
            }
            // Postres pote
            else if (tarjeta.classList.contains('postres-pote')) {
                const select = tarjeta.querySelector('select');
                nombre = select.selectedOptions[0].dataset.nombre;
                precio = Number(select.selectedOptions[0].dataset.precio);
            }
            // Alfajores
            else if (tarjeta.classList.contains('alfajores-maicena')) {
                const select = tarjeta.querySelector('select');
                nombre = select.selectedOptions[0].dataset.nombre;
                precio = Number(select.selectedOptions[0].dataset.precio);
            }
            // Otros con data-nombre/data-precio
            else if (tarjeta.dataset && tarjeta.dataset.nombre && tarjeta.dataset.precio) {
                nombre = tarjeta.dataset.nombre;
                precio = Number(tarjeta.dataset.precio);
            }
            // Botones con data-nombre/data-precio
            if (e.target.dataset.nombre && e.target.dataset.precio) {
                nombre = e.target.dataset.nombre;
                precio = Number(e.target.dataset.precio);
            }
            if (nombre && precio) {
                agregarProducto(nombre, precio);
            }
        };
    });

    // Carrito botón
    document.querySelector('.carrito').onclick = function() {
        window.location.href = 'carrito.html';
    };

    // Inicializa contador al cargar
    actualizarContador();
});