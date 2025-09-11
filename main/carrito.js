// Lee productos del localStorage
function getCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function setCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

const listaCarrito = document.getElementById('lista-carrito');
const totalElem = document.getElementById('total');
const comprarBtn = document.getElementById('comprar');
const seguirComprandoBtn = document.getElementById('seguir-comprando');
const confirmacionDiv = document.getElementById('confirmacion');
const fechaInput = document.getElementById('fecha-entrega');
const confirmarPedidoBtn = document.getElementById('confirmar-pedido');

/**
 * Agrupa los productos del carrito por nombre y actualiza la interfaz,
 * aplicando las promociones de 2x1 para budines y mini budines.
 */
function actualizarCarrito() {
    const carrito = getCarrito();
    listaCarrito.innerHTML = '';
    let total = 0;

    // Agrupa productos por nombre para el contador
    const productosAgrupados = carrito.reduce((acumulador, item) => {
        const nombre = item.nombre;
        if (!acumulador[nombre]) {
            acumulador[nombre] = {...item, cantidad: 0 };
        }
        acumulador[nombre].cantidad++;
        return acumulador;
    }, {});

    // Calcula el total con promociones
    for (const nombre in productosAgrupados) {
        const item = productosAgrupados[nombre];
        let subtotal = 0;
        let cantidad = item.cantidad;

        // Lógica para el Budín regular
        if (nombre.includes("Promo Budín") && !nombre.includes("(Gluten free)")) {
            const pares = Math.floor(cantidad / 2);
            const restantes = cantidad % 2;
            subtotal = (pares * 14500) + (restantes * item.precio);
        }
        // Lógica para el Mini budín
        else if (nombre.includes("Promo Mini")) {
            const pares = Math.floor(cantidad / 2);
            const restantes = cantidad % 2;
            subtotal = (pares * 5500) + (restantes * item.precio);
        }
        // Lógica para otros productos
        else {
            subtotal = item.precio * cantidad;
        }

        total += subtotal;

        const li = document.createElement('li');

        li.innerHTML = `
            <span>${item.nombre}</span>
            <div class="cantidad-control">
                <button class="restar-btn" data-nombre="${nombre}">-</button>
                <span>${cantidad}</span>
                <button class="sumar-btn" data-nombre="${nombre}">+</button>
            </div>
            <span>$${subtotal}</span>
        `;
        listaCarrito.appendChild(li);
    }

    totalElem.textContent = `Total: $${total}`;

    // Asigna eventos a los botones de sumar/restar
    document.querySelectorAll('.sumar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombre = this.dataset.nombre;
            const productoOriginal = carrito.find(item => item.nombre === nombre);
            if (productoOriginal) {
                const nuevoCarrito = getCarrito();
                nuevoCarrito.push(productoOriginal);
                setCarrito(nuevoCarrito);
                actualizarCarrito();
            }
        });
    });

    document.querySelectorAll('.restar-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const nombre = this.dataset.nombre;
            const nuevoCarrito = getCarrito();
            const index = nuevoCarrito.findIndex(item => item.nombre === nombre);
            if (index !== -1) {
                nuevoCarrito.splice(index, 1);
                setCarrito(nuevoCarrito);
                actualizarCarrito();
            }
        });
    });
}

/**
 * Inicializa todos los event listeners para los botones principales de la página.
 */
function inicializarListeners() {
    comprarBtn.addEventListener('click', () => {
        if (getCarrito().length === 0) {
            alert('El carrito está vacío.');
        } else {
            // Muestra la ventana de confirmación
            confirmacionDiv.style.display = 'block';

            // Establece la fecha mínima en el calendario (hoy)
            const hoy = new Date().toISOString().split('T')[0];
            fechaInput.setAttribute('min', hoy);

            // Autoscroll suave
            setTimeout(() => {
                confirmacionDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    });

    seguirComprandoBtn.addEventListener('click', () => {
        window.location.href = 'postres.html';
    });

    confirmarPedidoBtn.addEventListener('click', () => {
        const carrito = getCarrito();
        const fecha = fechaInput.value;
        const opcionRetiro = document.querySelector('input[name="retiro"]:checked');

        if (!fecha || !opcionRetiro) {
            alert('Por favor, selecciona una fecha y una opción de entrega.');
            return;
        }

        const esRetiro = opcionRetiro.value === 'si';

        const productosAgrupados = carrito.reduce((acumulador, item) => {
            if (!acumulador[item.nombre]) {
                acumulador[item.nombre] = {...item, cantidad: 0 };
            }
            acumulador[item.nombre].cantidad++;
            return acumulador;
        }, {});

        let total = 0;
        let mensaje = "¡Hola! He realizado un pedido a través de su página web.\n\n";
        mensaje += "Detalles del pedido:\n";

        for (const nombre in productosAgrupados) {
            const item = productosAgrupados[nombre];
            let subtotal = 0;
            let cantidad = item.cantidad;
            let nombreMostrado = item.nombre;

            // Lógica para el Budín regular
            if (nombre.includes("Budín de") && !nombre.includes("(Gluten free)")) {
                const pares = Math.floor(cantidad / 2);
                const restantes = cantidad % 2;
                subtotal = (pares * 14500) + (restantes * item.precio);
                if (cantidad >= 2) {
                    nombreMostrado += ` (PROMO)`;
                }
            }
            // Lógica para el Mini budín
            else if (nombre.includes("Mini budín de")) {
                const pares = Math.floor(cantidad / 2);
                const restantes = cantidad % 2;
                subtotal = (pares * 5500) + (restantes * item.precio);
                if (cantidad >= 2) {
                    nombreMostrado += ` (PROMO)`;
                }
            }
            // Lógica para otros productos
            else {
                subtotal = item.precio * cantidad;
            }

            total += subtotal;
            mensaje += `- ${nombreMostrado} (x${item.cantidad}) - Total: $${subtotal}\n`;
        }

        mensaje += `\nTotal a pagar: $${total}\n`;
        mensaje += `Fecha de entrega: ${fecha}\n`;

        if (esRetiro) {
            mensaje += "Opción de entrega: Retiro en domicilio.\n";
        } else {
            mensaje += "Opción de entrega: Coordinar entrega.\n";
        }

        const mensajeCodificado = encodeURIComponent(mensaje);
        const numeroWhatsapp = "5492617028044";

        const enlaceWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${mensajeCodificado}`;
        window.open(enlaceWhatsapp, '_blank');

        localStorage.removeItem('carrito');
        actualizarCarrito();
        confirmacionDiv.style.display = 'none';
    });
}

// Inicia el script una vez que el DOM ha cargado
document.addEventListener('DOMContentLoaded', () => {
    actualizarCarrito();
    inicializarListeners();
});