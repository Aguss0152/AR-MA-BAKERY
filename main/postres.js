// main/postres.js

document.addEventListener('DOMContentLoaded', () => {
    // Lógica del menú de hamburguesa
    const menos = document.querySelector('.menos');
    const navegador2 = document.querySelector('.navegador2');
    if (menos && navegador2) {
        menos.addEventListener('click', () => {
            navegador2.classList.toggle('active');
            menos.classList.toggle('active');
        });
    }

    // Lógica del carrito de compras
    const botonesAgregar = document.querySelectorAll('.mostrar');
    const carritoFijo = document.getElementById('carrito');
    const listaProductos = document.getElementById('lista-productos');
    const spanTotal = document.getElementById('total');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const mensajePromo = document.getElementById('mensaje-promo');
    const btnMinimizar = document.getElementById('btn-minimizar');

    const pedido = {};
    let productosEnCarrito = 0;

    const recalcularTotal = () => {
        let esPromoAplicable = productosEnCarrito === 2;
        let contieneChocolate = pedido['Budín de Chocolate'] > 0;
        let contieneZanahoria = pedido['Budín de Zanahoria'] > 0;

        let total = 0;

        if (esPromoAplicable && !contieneChocolate && !contieneZanahoria) {
            total = 12500;
            mensajePromo.style.display = 'block';
        } else {
            for (const nombre in pedido) {
                // CORRECCIÓN 1: Aseguramos que el elemento exista antes de intentar obtener su precio
                const tarjeta = document.querySelector(`[data-nombre="${nombre}"]`);
                if (tarjeta) {
                    const precio = parseInt(tarjeta.getAttribute('data-precio'));
                    total += pedido[nombre] * precio;
                }
            }
            mensajePromo.style.display = 'none';
        }
        return total;
    };

    const actualizarCarrito = () => {
        const totalCalculado = recalcularTotal();
        spanTotal.textContent = totalCalculado.toLocaleString('es-CL');
        
        if (productosEnCarrito > 0) {
            carritoFijo.classList.add('visible');
        } else {
            carritoFijo.classList.remove('visible');
            carritoFijo.classList.remove('minimizado');
        }
    };

    const quitarProducto = (nombre) => {
        if (pedido[nombre] > 1) {
            pedido[nombre]--;
            const itemElement = listaProductos.querySelector(`[data-nombre-item="${nombre}"]`);
            if (itemElement) { // Verificación añadida para evitar errores
                itemElement.querySelector('.cantidad-producto').textContent = pedido[nombre];
            }
        } else {
            const itemElement = listaProductos.querySelector(`[data-nombre-item="${nombre}"]`);
            if (itemElement) itemElement.remove();
            delete pedido[nombre];
        }
        productosEnCarrito--;
        actualizarCarrito();
    };
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            // CORRECCIÓN 2: Aseguramos que la tarjeta exista antes de leer sus atributos
            const tarjeta = boton.closest('[data-nombre]');
            if (!tarjeta) {
                console.error("No se pudo encontrar la tarjeta del producto.");
                return; // Detiene la ejecución si no encuentra la tarjeta
            }
            
            const nombre = tarjeta.getAttribute('data-nombre');
            const precio = parseInt(tarjeta.getAttribute('data-precio'));
            
            if (pedido[nombre]) {
                pedido[nombre]++;
                const itemElement = listaProductos.querySelector(`[data-nombre-item="${nombre}"]`);
                if (itemElement) {
                    itemElement.querySelector('.cantidad-producto').textContent = pedido[nombre];
                }
            } else {
                pedido[nombre] = 1;

                const item = document.createElement('div');
                item.classList.add('item-carrito');
                item.setAttribute('data-nombre-item', nombre);
                item.innerHTML = `
                    <span>${nombre} - $<span class="precio-producto">${precio.toLocaleString('es-CL')}</span> x <span class="cantidad-producto">1</span></span>
                    <button class="btn-quitar">Quitar</button>
                `;
                listaProductos.appendChild(item);

                const btnQuitar = item.querySelector('.btn-quitar');
                btnQuitar.addEventListener('click', () => {
                    quitarProducto(nombre);
                });
            }

            productosEnCarrito++;
            actualizarCarrito();
        });
    });

    btnWhatsapp.addEventListener('click', () => {
        const telefono = '5492616522585';
        let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';

        for (const nombre in pedido) {
            if (pedido[nombre] > 0) {
                const tarjeta = document.querySelector(`[data-nombre="${nombre}"]`);
                if (tarjeta) {
                    const precio = parseInt(tarjeta.getAttribute('data-precio'));
                    const subtotal = pedido[nombre] * precio;
                    mensaje += `${pedido[nombre]} x ${nombre} = $${subtotal.toLocaleString('es-CL')}\n`;
                }
            }
        }

        const totalFinal = recalcularTotal();
        mensaje += `\nTotal: $${totalFinal.toLocaleString('es-CL')}`;

        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsapp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

        window.open(urlWhatsapp, '_blank');
    });

    btnMinimizar.addEventListener('click', () => {
        carritoFijo.classList.toggle('minimizado');
    });
});