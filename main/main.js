// =================================================================
// 1. CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// =================================================================

const WSP_NUMBER = '5492617028044';
let carrito = [];

// Elementos del DOM (para el carrito y modal)
const carritoBoton = document.getElementById('carrito');
const carritoPanel = document.getElementById('carrito-panel');
const cerrarCarritoBoton = document.getElementById('cerrar-carrito');
const btnComprar = document.getElementById('btn-comprar');
const checkoutModal = document.getElementById('checkout-modal');
const cerrarCheckoutBoton = document.getElementById('cerrar-checkout');
const enviarWhatsappBoton = document.getElementById('enviar-whatsapp');
const fechaEntregaInput = document.getElementById('fecha-entrega');
const contadorCarrito = document.getElementById('contador-carrito');

// Elementos de la lógica del mapa y el logo
const mapElement = document.getElementById('map');
const vortexLogo = document.getElementById("logo-vortex");


// =================================================================
// 2. FUNCIONES DEL CARRITO DE COMPRAS
// =================================================================

function agregarAlCarrito(nombre, precio) {
    const id = `${nombre}-${precio}`;
    const indiceExistente = carrito.findIndex(item => `${item.nombre}-${item.precio}` === id);

    if (indiceExistente !== -1) {
        carrito[indiceExistente].cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarCarritoHTML();
}

function actualizarCarritoHTML() {
    const listaProductos = document.getElementById('lista-productos');
    const carritoTotalSpan = document.getElementById('carrito-total');
    const btnComprar = document.getElementById('btn-comprar');
    
    listaProductos.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (carrito.length === 0) {
        listaProductos.innerHTML = '<p class="carrito-vacio-msj">Tu carrito está vacío.</p>';
        btnComprar.disabled = true;
        contadorCarrito.textContent = '0'; 
    } else {
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            totalItems += item.cantidad;

            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto-carrito');
            productoDiv.innerHTML = `
                <p class="nombre">${item.nombre}</p>
                <p class="precio">$${subtotal.toLocaleString('es-AR')}</p>
                <div class="controles-cantidad">
                    <button class="mas-menos" data-index="${index}" data-action="restar"><i class="fa-solid fa-minus-circle"></i></button>
                    <span>${item.cantidad}</span>
                    <button class="mas-menos" data-index="${index}" data-action="sumar"><i class="fa-solid fa-plus-circle"></i></button>
                </div>
                <button class="btn-eliminar" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
            `;
            listaProductos.appendChild(productoDiv);
        });

        btnComprar.disabled = false;
        contadorCarrito.textContent = totalItems;
    }

    carritoTotalSpan.textContent = `$${total.toLocaleString('es-AR')}`;
}

function cambiarCantidad(index, action) {
    if (action === 'sumar') {
        carrito[index].cantidad++;
    } else if (action === 'restar') {
        carrito[index].cantidad--;
        if (carrito[index].cantidad <= 0) {
            carrito.splice(index, 1);
        }
    }
    actualizarCarritoHTML();
}

/**
 * Genera y abre el enlace de WhatsApp con el detalle del pedido,
 * incluyendo la opción de entrega y la opción de pago.
 */
function generarMensajeWhatsApp() {
    const fecha = fechaEntregaInput.value;
    const errorFecha = document.getElementById('error-fecha');
    
    // Captura de las nuevas opciones
    const opcionEntrega = document.querySelector('input[name="opcion-entrega"]:checked').value; 
    const opcionPago = document.querySelector('input[name="opcion-pago"]:checked').value; 

    if (!fecha) {
        errorFecha.textContent = 'Por favor, selecciona la fecha de entrega.';
        return;
    }

    errorFecha.textContent = '';
    const fechaFormateada = new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' }); 

    // 1. Detalles de los productos
    let detallesProductos = '¡Hola! Quiero hacer un pedido:\n\n*Productos:*\n';
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const precioUnitario = (item.precio).toLocaleString('es-AR');
        detallesProductos += `- ${item.cantidad} x ${item.nombre} ($${precioUnitario} c/u)\n`; 
        total += subtotal;
    });

    // 2. Información de entrega/retiro y PAGO
    const totalFormateado = total.toLocaleString('es-AR');
    const detallesEntrega = `
*Total a pagar:* $${totalFormateado}
*Fecha de Entrega:* ${fechaFormateada}
*Opción de Entrega:* ${opcionEntrega}
*Opción de Pago:* ${opcionPago}

Mi nombre es:`;

    const mensajeFinal = detallesProductos + detallesEntrega;
    
    // 3. Codificar y enviar por WhatsApp
    const urlWhatsApp = `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(mensajeFinal)}`;
    
    window.open(urlWhatsApp, '_blank');
    
    // Limpieza
    carrito = [];
    actualizarCarritoHTML();
    checkoutModal.classList.remove('visible');
}


// =================================================================
// 3. FUNCIONES COMPLEMENTARIAS
// =================================================================

function actualizarPrecioEnTarjeta() {
    const selectedOption = this.options[this.selectedIndex];
    const nuevoPrecio = selectedOption.getAttribute('data-precio');
    const targetId = this.getAttribute('data-target-price');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        targetElement.textContent = `$${parseInt(nuevoPrecio).toLocaleString('es-AR')}`;
    }
}

function configurarFechaMinima() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1); 
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const yyyy = hoy.getFullYear();

    const minDate = yyyy + '-' + mm + '-' + dd;
    fechaEntregaInput.min = minDate;
}

/**
 * Función que Google Maps llama al cargarse (Global).
 */
function iniciarMap(){
    var coord = {lat:-32.9906024 ,lng:-68.7914612};
    var map = new google.maps.Map(mapElement,{
        zoom: 17,
        center: coord
    });
    var marker = new google.maps.Marker({
        position: coord,
        map: map
    });
};


// =================================================================
// 4. LÓGICA DE TIPIADO (EFECTO ANIMADO)
// =================================================================

function iniciarEfectoTipeo() {
    const textElement = document.getElementById('typing-text');
    const words = ["Pasteles", "Catering", "Mesas Dulces", "Decoración"];
    
    let wordIndex = 0;
    let charIndex = 0;
    const typingSpeed = 80;
    const deletingSpeed = 80;
    const delayBeforeDelete = 1400;
    const delayBeforeType = 500;

    function type() {
        const currentWord = words[wordIndex]; 
        if (charIndex < currentWord.length) {
            textElement.textContent += currentWord.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, delayBeforeDelete);
        }
    }

    function erase() {
        const currentWord = words[wordIndex]; 
        if (charIndex > 0) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, deletingSpeed);
        } else {
            wordIndex = (wordIndex + 1) % words.length; 
            setTimeout(type, delayBeforeType);
        }
    }

    type();
}


// =================================================================
// 5. LISTENERS Y MANEJO DE EVENTOS (ÚNICO DOMContentLoaded)
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoHTML(); 
    iniciarEfectoTipeo();

    // --- LOGICA DEL MAPA ---
    if (mapElement) {
        mapElement.addEventListener('click', function(){
            window.open('https://maps.google.com/?q=-32.9906024,-68.7914612', '_blank');
        });
    }

    // --- LOGICA DEL LOGO VORTEX ---
    if (vortexLogo) {
        vortexLogo.addEventListener("click", function(){
            window.open("https://vortexcloud.vercel.app/", "_blank");
        });
    }

    // --- LOGICA DE PRODUCTOS ---
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.tarjeta-postre');
            const selector = tarjeta ? tarjeta.querySelector('.precio-selector') : null;

            let nombre, precio;
            let precioBase = 0;

            if (selector) {
                const opcionSeleccionada = selector.options[selector.selectedIndex];
                nombre = opcionSeleccionada.getAttribute('data-nombre');
                precio = parseInt(opcionSeleccionada.getAttribute('data-precio'));
            
            } else if (tarjeta) {
                precioBase = parseInt(tarjeta.getAttribute('data-precio')) || 0;
                nombre = tarjeta.getAttribute('data-nombre');

                if (e.target.getAttribute('data-action') === 'agregar-deco') {
                    const precioDeco = parseInt(tarjeta.getAttribute('data-precio-deco')) || 0;
                    precio = precioBase + precioDeco;
                    nombre = nombre + ' (c/ Decoración)'; 
                    
                } else if (e.target.getAttribute('data-action') === 'agregar-base') {
                    precio = precioBase; 

                } else if (e.target.hasAttribute('data-nombre')) {
                    nombre = e.target.getAttribute('data-nombre');
                    precio = parseInt(e.target.getAttribute('data-precio'));
                } else {
                    precio = precioBase;
                }
            }


            if (nombre && !isNaN(precio)) {
                agregarAlCarrito(nombre, precio);
            } else {
                console.error("No se pudo obtener el nombre o precio del producto.");
            }
        });
    });

    // --- LOGICA DEL CARRITO (MODIFICAR CANTIDAD / ELIMINAR) ---
    document.getElementById('lista-productos').addEventListener('click', (e) => {
        const target = e.target;
        
        const botonControl = target.closest('[data-action]');
        if (botonControl) {
            const index = parseInt(botonControl.getAttribute('data-index'));
            const action = botonControl.getAttribute('data-action');
            cambiarCantidad(index, action);
            return; 
        }
        
        const botonEliminar = target.closest('.btn-eliminar');
        if (botonEliminar) {
            const index = parseInt(botonEliminar.getAttribute('data-index'));
            carrito.splice(index, 1);
            actualizarCarritoHTML();
        }
    });

    // --- LÓGICA DE APERTURA/CIERRE DE PANELES ---
    carritoBoton.addEventListener('click', () => {
        carritoPanel.classList.toggle('visible');
    });

    cerrarCarritoBoton.addEventListener('click', () => {
        carritoPanel.classList.remove('visible');
    });

    btnComprar.addEventListener('click', () => {
        carritoPanel.classList.remove('visible'); 
        checkoutModal.classList.add('visible'); 
        configurarFechaMinima();
    });

    cerrarCheckoutBoton.addEventListener('click', () => {
        checkoutModal.classList.remove('visible');
    });
    
    enviarWhatsappBoton.addEventListener('click', generarMensajeWhatsApp);

    // --- LÓGICA DE SELECTORES (PRECIO DINÁMICO) ---
    document.querySelectorAll('.precio-selector').forEach(selector => {
        selector.addEventListener('change', actualizarPrecioEnTarjeta);
        actualizarPrecioEnTarjeta.call(selector); 
    });
    
    // --- LÓGICA DE NAVEGACIÓN Y HAMBURGUESA ---
    const hamburguesa = document.querySelector('.hamburguesa');
    const navLinks = document.querySelector('.nav_links');

    hamburguesa.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburguesa.classList.toggle('active');
    });

});