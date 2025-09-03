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

    // --- Lógica del carrito ---
    const btnCarrito = document.getElementById('btn-carrito');
    const iconoCarrito = btnCarrito.querySelector('.fa-shopping-cart');

    // Función para mostrar el spinner
    function showSpinner() {
        btnCarrito.classList.add('loading');
    }

    // Función para ocultar el spinner
    function hideSpinner() {
        btnCarrito.classList.remove('loading');
    }

    // Mostrar spinner al cargar la página
    showSpinner();

    // Ocultar spinner cuando la página esté completamente cargada
    window.addEventListener('load', () => {
        hideSpinner();
        actualizarContador();
    });

    function getCarrito() {
        return JSON.parse(localStorage.getItem('carrito')) || [];
    }

    function setCarrito(carrito) {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function actualizarContador() {
        const contador = document.getElementById('contador-carrito');
        contador.textContent = getCarrito().length;
    }

    function agregarProducto(nombre, precio) {
        const carrito = getCarrito();
        carrito.push({
            nombre,
            precio
        });
        setCarrito(carrito);
        actualizarContador();
    }

    // Botones "Agregar"
    document.querySelectorAll('.mostrar, .mostrar-mini, .mostrar-sg').forEach(btn => {
        btn.onclick = function(e) {
            let nombre = '',
                precio = 0;
            const tarjeta = e.target.closest('[data-nombre],[class^="tarjeta"],.postres-pote,.alfajores-maicena');

            // Lógica para determinar nombre y precio del producto
            if (tarjeta) {
                const select = tarjeta.querySelector('select');
                if (select) {
                    const selectedOption = select.selectedOptions[0];
                    if (selectedOption && selectedOption.dataset.nombre && selectedOption.dataset.precio) {
                        nombre = selectedOption.dataset.nombre;
                        precio = Number(selectedOption.dataset.precio);
                    }
                } else if (tarjeta.dataset && tarjeta.dataset.nombre && tarjeta.dataset.precio) {
                    nombre = tarjeta.dataset.nombre;
                    precio = Number(tarjeta.dataset.precio);
                }
            }

            if (nombre && precio) {
                agregarProducto(nombre, precio);
            }
        };
    });

    // Evento de clic en el carrito para ir a la página de compra
    btnCarrito.addEventListener('click', () => {
        showSpinner();
        window.location.href = 'carrito.html';
    });
});