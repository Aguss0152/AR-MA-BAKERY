// =================================================================
// 1. CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// =================================================================

// Número de WhatsApp al que se enviará el pedido
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
const contadorCarrito = document.getElementById('contador-carrito'); // Contador de productos

// =================================================================
// 2. FUNCIONES DEL CARRITO DE COMPRAS
// =================================================================

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 * IMPORTANTE: No abre el panel del carrito, solo actualiza el contenido y el contador.
 * @param {string} nombre Nombre del producto.
 * @param {number} precio Precio unitario del producto.
 */
function agregarAlCarrito(nombre, precio) {
    // Usamos el nombre y el precio como identificadores únicos para la decoración
    const id = `${nombre}-${precio}`; 
    const indiceExistente = carrito.findIndex(item => `${item.nombre}-${item.precio}` === id);

    if (indiceExistente !== -1) {
        carrito[indiceExistente].cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarCarritoHTML();
}

/**
 * Actualiza la vista del carrito (productos listados, total y contador).
 * SE HAN REEMPLAZADO LOS EMOTICONOS +/- POR ICONOS DE FONT AWESOME.
 */
function actualizarCarritoHTML() {
    const listaProductos = document.getElementById('lista-productos');
    const carritoTotalSpan = document.getElementById('carrito-total');
    const btnComprar = document.getElementById('btn-comprar');
    
    listaProductos.innerHTML = '';
    let total = 0;
    let totalItems = 0; // Variable para contar el total de productos

    if (carrito.length === 0) {
        listaProductos.innerHTML = '<p class="carrito-vacio-msj">Tu carrito está vacío.</p>';
        btnComprar.disabled = true;
        contadorCarrito.textContent = '0'; 
    } else {
        carrito.forEach((item, index) => {
            const subtotal = item.precio * item.cantidad;
            total += subtotal;
            totalItems += item.cantidad; // Suma la cantidad de este producto al total de items

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
        // Actualiza el contador del nav con la cantidad total de productos
        contadorCarrito.textContent = totalItems; 
    }

    carritoTotalSpan.textContent = `$${total.toLocaleString('es-AR')}`;
}

/**
 * Maneja la lógica de incrementar o decrementar la cantidad de un producto.
 * @param {number} index Índice del producto en el array carrito.
 * @param {string} action 'sumar' o 'restar'.
 */
function cambiarCantidad(index, action) {
    if (action === 'sumar') {
        carrito[index].cantidad++;
    } else if (action === 'restar') {
        carrito[index].cantidad--;
        if (carrito[index].cantidad <= 0) {
            // Eliminar el producto si la cantidad llega a 0
            carrito.splice(index, 1);
        }
    }
    actualizarCarritoHTML();
}

/**
 * Genera y abre el enlace de WhatsApp con el detalle del pedido.
 */
function generarMensajeWhatsApp() {
    const fecha = fechaEntregaInput.value;
    const errorFecha = document.getElementById('error-fecha');
    // Obtenemos el valor de la opción seleccionada
    const opcionEntrega = document.querySelector('input[name="opcion-entrega"]:checked').value; 

    // Validación de fecha
    if (!fecha) {
        errorFecha.textContent = 'Por favor, selecciona la fecha de entrega.';
        return;
    }

    errorFecha.textContent = ''; // Limpiar error si la fecha es válida

    // 1. Detalles de los productos
    let detallesProductos = '¡Hola! Quiero hacer un pedido:\n\n*Productos:*\n';
    let total = 0;
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        detallesProductos += `- ${item.cantidad} x ${item.nombre} ($${subtotal.toLocaleString('es-AR')})\n`; 
        total += subtotal;
    });

    // 2. Información de entrega/retiro
    const detallesEntrega = `\n*Total a pagar:* $${total.toLocaleString('es-AR')}\n*Fecha de Entrega:* ${new Date(fecha).toLocaleDateString('es-AR')}\n*Opción de Entrega:* ${opcionEntrega}\n\n`;

    const mensajeFinal = detallesProductos + detallesEntrega + 'Mi nombre es:';
    
    // 3. Codificar y enviar por WhatsApp
    const urlWhatsApp = `https://wa.me/${WSP_NUMBER}?text=${encodeURIComponent(mensajeFinal)}`;
    
    window.open(urlWhatsApp, '_blank');
    
    // Opcional: Reiniciar el carrito después de enviar
    carrito = [];
    actualizarCarritoHTML();
    checkoutModal.classList.remove('visible');
}


// =================================================================
// 3. LISTENERS Y MANEJO DE EVENTOS
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    actualizarCarritoHTML(); // Inicializa el carrito al cargar la página

    // Listener general para agregar productos (MODIFICADO para Deco)
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const tarjeta = e.target.closest('.tarjeta-postre');
            const selector = tarjeta ? tarjeta.querySelector('.precio-selector') : null;

            let nombre, precio;
            let precioBase = 0;

            if (selector) {
                // Producto con selector (Budines, Alfajores, etc.)
                const opcionSeleccionada = selector.options[selector.selectedIndex];
                nombre = opcionSeleccionada.getAttribute('data-nombre');
                precio = parseInt(opcionSeleccionada.getAttribute('data-precio'));
            
            } else if (tarjeta) {
                // Lógica para Chocotorta y otros productos simples (MODIFICADA)
                
                // 1. Obtiene el precio base de la tarjeta (Chocotorta)
                precioBase = parseInt(tarjeta.getAttribute('data-precio')) || 0;
                nombre = tarjeta.getAttribute('data-nombre');

                // 2. Verifica si se presionó el botón de DECORACIÓN
                if (e.target.getAttribute('data-action') === 'agregar-deco') {
                    const precioDeco = parseInt(tarjeta.getAttribute('data-precio-deco')) || 0;
                    
                    // Calcula el precio total y cambia el nombre para identificarlo en el carrito
                    precio = precioBase + precioDeco;
                    nombre = nombre + ' (c/ Decoración)'; 
                    
                } else if (e.target.getAttribute('data-action') === 'agregar-base') {
                    // Si es el botón base, usa solo el precio base de la tarjeta
                    precio = precioBase; 

                } else if (e.target.hasAttribute('data-nombre')) {
                    // Lógica para productos Box (el botón tiene los datos directos)
                    nombre = e.target.getAttribute('data-nombre');
                    precio = parseInt(e.target.getAttribute('data-precio'));
                } else {
                    // Si no tiene action y solo es una tarjeta simple (ej: Brownie)
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

    // Listener CORREGIDO para los botones de cantidad y eliminar dentro del carrito
    document.getElementById('lista-productos').addEventListener('click', (e) => {
        const target = e.target;
        
        // --- Lógica para botones de SUMAR/RESTAR ---
        const botonControl = target.closest('[data-action]');
        if (botonControl) {
            const index = parseInt(botonControl.getAttribute('data-index'));
            const action = botonControl.getAttribute('data-action');
            cambiarCantidad(index, action);
            return; 
        }
        
        // --- Lógica para botón de ELIMINAR (btn-eliminar) ---
        const botonEliminar = target.closest('.btn-eliminar');

        if (botonEliminar) {
            const index = parseInt(botonEliminar.getAttribute('data-index'));
            carrito.splice(index, 1);
            actualizarCarritoHTML();
        }
    });

    // Abrir/Cerrar Carrito Panel (Solo con el botón del nav)
    carritoBoton.addEventListener('click', () => {
        carritoPanel.classList.toggle('visible');
    });

    cerrarCarritoBoton.addEventListener('click', () => {
        carritoPanel.classList.remove('visible');
    });

    // Abrir/Cerrar Modal de Checkout
    btnComprar.addEventListener('click', () => {
        carritoPanel.classList.remove('visible'); 
        checkoutModal.classList.add('visible'); 
        configurarFechaMinima();
    });

    cerrarCheckoutBoton.addEventListener('click', () => {
        checkoutModal.classList.remove('visible');
    });
    
    // Botón Finalizar Compra a WhatsApp
    enviarWhatsappBoton.addEventListener('click', generarMensajeWhatsApp);

    // =================================================================
    // 4. LÓGICA DE SELECTORES (PRECIO DINÁMICO)
    // =================================================================

    document.querySelectorAll('.precio-selector').forEach(selector => {
        selector.addEventListener('change', actualizarPrecioEnTarjeta);
        // Llamar una vez para establecer el precio inicial
        actualizarPrecioEnTarjeta.call(selector); 
    });

    // =================================================================
    // 5. LÓGICA DE NAVEGACIÓN Y HAMBURGUESA
    // =================================================================
    
    const hamburguesa = document.querySelector('.hamburguesa');
    const navLinks = document.querySelector('.nav_links');

    hamburguesa.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburguesa.classList.toggle('active');
    });
    
});


// =================================================================
// 6. FUNCIONES COMPLEMENTARIAS
// =================================================================

/**
 * Función que actualiza el precio visible en la tarjeta cuando cambia el selector.
 */
function actualizarPrecioEnTarjeta() {
    const selectedOption = this.options[this.selectedIndex];
    const nuevoPrecio = selectedOption.getAttribute('data-precio');
    const targetId = this.getAttribute('data-target-price');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        // Formatear el precio con separadores de miles
        targetElement.textContent = `$${parseInt(nuevoPrecio).toLocaleString('es-AR')}`;
    }
}

/**
 * Función original para alternar la visibilidad de la descripción (para los Box).
 */
function alternarDescripcion(button, idCorta, idCompleta) {
    const corta = document.getElementById(idCorta);
    const completa = document.getElementById(idCompleta);

    if (corta.classList.contains('visible')) {
        corta.classList.remove('visible');
        corta.classList.add('oculto');
        completa.classList.remove('oculto');
        completa.classList.add('visible');
        button.textContent = 'Ver menos...';
    } else {
        corta.classList.remove('oculto');
        corta.classList.add('visible');
        completa.classList.remove('visible');
        completa.classList.add('oculto');
        button.textContent = 'Ver más...';
    }
}

/**
 * Configura el campo de fecha para que el mínimo sea mañana.
 */
function configurarFechaMinima() {
    const hoy = new Date();
    // Suma un día (mañana)
    hoy.setDate(hoy.getDate() + 1); 
    const dd = String(hoy.getDate()).padStart(2, '0');
    const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0!
    const yyyy = hoy.getFullYear();

    const minDate = yyyy + '-' + mm + '-' + dd;
    fechaEntregaInput.min = minDate;
};

function iniciarMap(){
    var coord = {lat:-32.9906024 ,lng:-68.7914612};
    var map = new google.maps.Map(document.getElementById('map'),{
      zoom: 17,
      center: coord
    });
    var marker = new google.maps.Marker({
      position: coord,
      map: map
    });
};