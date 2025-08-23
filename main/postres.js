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

    // Lógica del carrito de compras
    const botonesAgregar = document.querySelectorAll('.mostrar');
    const carritoFijo = document.getElementById('carrito');
    const listaProductos = document.getElementById('lista-productos');
    const spanTotal = document.getElementById('total');
    const btnWhatsapp = document.getElementById('btn-whatsapp');
    const mensajePromo = document.getElementById('mensaje-promo');
    const btnMinimizar = document.getElementById('btn-minimizar');

    // Elementos del nuevo modal
    const modalOpciones = document.getElementById('modal-opciones');
    const btnRetirar = document.getElementById('btn-retirar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const cerrarModal = document.getElementById('cerrar-modal');

    const pedido = {};
    let productosEnCarrito = 0;
    
    // Función para recalcular el total (mejorada para la promo)
    const recalcularTotal = () => {
        let total = 0;
        let productosPromoCount = 0;
        
        // Primero, calculamos el costo total de los productos NO de la promo
        for (const nombre in pedido) {
            // Excluimos los productos de la promoción para el cálculo inicial
            if (!nombre.startsWith('promo')) {
                const tarjeta = document.querySelector(`[data-nombre="${nombre.split(' (')[0]}"]`);
                if (tarjeta) {
                    const precio = parseInt(tarjeta.getAttribute('data-precio'));
                    total += pedido[nombre] * precio;
                }
            }
        }

        // Segundo, contamos la cantidad de productos de la promoción
        for (const nombre in pedido) {
            if (nombre.startsWith('promo')) {
                // Aseguramos que el "mini budín de Zanahoria" no cuente para la promo
                if (nombre !== 'promo mini budín de Zanahoria') {
                    productosPromoCount += pedido[nombre];
                } else {
                    // Si es el de Zanahoria, lo sumamos al total sin promo
                    const tarjeta = document.querySelector(`[data-nombre="${nombre}"]`);
                    if (tarjeta) {
                        const precio = parseInt(tarjeta.getAttribute('data-precio'));
                        total += pedido[nombre] * precio;
                    }
                }
            }
        }
        
        // Tercero, aplicamos la lógica de la promoción SOLO a los mini budines que califican
        if (productosPromoCount >= 2) {
            // Si hay 2 o más, el total para estos dos es $5.000 (hay que calcular el excedente)
            total += 5000 * Math.floor(productosPromoCount / 2); // 5000 por cada par
            total += 3500 * (productosPromoCount % 2); // Precio normal para los impares
            
            if (mensajePromo) {
                mensajePromo.style.display = 'block';
            }
        } else {
            // Si no son 2 o más, sumamos el costo normal de cada uno de ellos
            for (const nombre in pedido) {
                if (nombre.startsWith('promo') && nombre !== 'promo mini budín de Zanahoria') {
                    const tarjeta = document.querySelector(`[data-nombre="${nombre}"]`);
                    if (tarjeta) {
                        const precio = parseInt(tarjeta.getAttribute('data-precio'));
                        total += pedido[nombre] * precio;
                    }
                }
            }
            if (mensajePromo) {
                mensajePromo.style.display = 'none';
            }
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
            if (itemElement) {
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
            const tarjeta = boton.closest('[data-nombre]');
            if (!tarjeta) {
                console.error("No se pudo encontrar la tarjeta del producto.");
                return;
            }
            
            let nombre = tarjeta.getAttribute('data-nombre');
            const precio = parseInt(tarjeta.getAttribute('data-precio'));
            
            // --- LÓGICA PARA AGREGAR EL SABOR SI EXISTE ---
            const selectSabor = tarjeta.querySelector('#saborMinitorta');
            if (selectSabor) {
                const sabor = selectSabor.value;
                nombre = `${nombre} (${sabor})`;
            }
            // --- FIN DE LA LÓGICA ---

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

    // --- Lógica del nuevo modal de pedido ---

    btnWhatsapp.addEventListener('click', () => {
        if (productosEnCarrito === 0) {
            alert('El carrito está vacío. Por favor, agrega productos para continuar.');
            return;
        }
        modalOpciones.classList.add('visible');
    });

    cerrarModal.addEventListener('click', () => {
        modalOpciones.classList.remove('visible');
    });
    
    // LÓGICA DEL BOTÓN "SÍ" (QUIERE RETIRAR)
    btnRetirar.addEventListener('click', () => {
        const telefono = '5492617028044';
        let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido para **RETIRO EN DOMICILIO**:\n\n';
        mensaje += generarMensajePedido();
        mensaje += `\n\n_Para la ubicación del local, por favor revisa el perfil de WhatsApp._`;
        
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsapp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
        window.open(urlWhatsapp, '_blank');
        modalOpciones.classList.remove('visible');
    });

    // LÓGICA DEL BOTÓN "NO" (NO QUIERE RETIRAR, QUIERE COORDINAR)
    btnCancelar.addEventListener('click', () => {
        const telefono = '5492617028044';
        let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido.\n\n';
        mensaje += generarMensajePedido();
        mensaje += `\n\n_No retiraré en el domicilio, me gustaría coordinar la entrega.`;
        
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsapp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
        window.open(urlWhatsapp, '_blank');
        modalOpciones.classList.remove('visible');
    });


    // Función auxiliar para generar el mensaje del pedido
    const generarMensajePedido = () => {
        let mensaje = '';
        for (const nombre in pedido) {
            if (pedido[nombre] > 0) {
                // Buscamos la tarjeta original, sin el sabor, para obtener el precio base
                const nombreSinSabor = nombre.split(' (')[0];
                const tarjeta = document.querySelector(`[data-nombre="${nombreSinSabor}"]`);
                let precio = 0;
                if (tarjeta) {
                    precio = parseInt(tarjeta.getAttribute('data-precio'));
                }
                const subtotal = pedido[nombre] * precio;
                mensaje += `${pedido[nombre]} x ${nombre} = $${subtotal.toLocaleString('es-CL')}\n`;
            }
        }
        const totalFinal = recalcularTotal();
        mensaje += `\nTotal: $${totalFinal.toLocaleString('es-CL')}`;
        return mensaje;
    };

    btnMinimizar.addEventListener('click', () => {
        carritoFijo.classList.toggle('minimizado');
    });
});