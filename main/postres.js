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
    const botonesAgregarMini = document.querySelectorAll('.mostrar-mini');
    const botonesAgregarSinGluten = document.querySelectorAll('.mostrar-sg');
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
    const fechaEntrega = document.getElementById('fecha-entrega');

    const pedido = {};
    let productosEnCarrito = 0;

    // --- COMIENZO DEL CÓDIGO CORREGIDO ---
    // Restringe el calendario para que no se puedan seleccionar fechas pasadas
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const anio = hoy.getFullYear();
    const fechaMinima = `${anio}-${mes}-${dia}`;
    fechaEntrega.min = fechaMinima;

    // --- FIN DEL CÓDIGO CORREGIDO ---

    const recalcularTotal = () => {
        let total = 0;
        let miniBudinesPromoCount = 0;
        
        for (const nombre in pedido) {
            const cantidad = pedido[nombre];
            const itemElement = listaProductos.querySelector(`[data-nombre-item="${nombre}"]`);
            if (itemElement) {
                const precio = parseInt(itemElement.getAttribute('data-precio'));
                if (nombre.startsWith('Promo') && !nombre.includes('Zanahoria')) {
                    miniBudinesPromoCount += cantidad;
                } else {
                    total += cantidad * precio;
                }
            }
        }
        
        const pares = Math.floor(miniBudinesPromoCount / 2);
        const impares = miniBudinesPromoCount % 2;
        total += pares * 5000;
        total += impares * 3500;
        
        if (miniBudinesPromoCount >= 2 && miniBudinesPromoCount !== 0) {
            mensajePromo.style.display = 'block';
        } else {
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

    const agregarAlCarrito = (nombre, precio) => {
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
            item.setAttribute('data-precio', precio);
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
        if (productosEnCarrito === 1) {
            carritoFijo.classList.add('minimizado');
            btnMinimizar.innerHTML = '<i class="fas fa-chevron-up"></i>';
            btnMinimizar.classList.add('palpitar'); // Solo antes del primer click
        }
        actualizarCarrito();
    };

    // Botones de Repostería y Galletas
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
            const tarjeta = boton.closest('[data-nombre]');
            let nombre = tarjeta.getAttribute('data-nombre');
            const precio = parseInt(tarjeta.getAttribute('data-precio'));
            
            const selectSabor = tarjeta.querySelector('#saborMinitorta');
            if (selectSabor) {
                const sabor = selectSabor.value;
                nombre = `${nombre} (${sabor})`;
            }
            agregarAlCarrito(nombre, precio);
        });
    });

    // Botón para Budines
    const btnAgregarBudin = document.querySelector('.tarjeta-budin .mostrar');
    if (btnAgregarBudin) {
        btnAgregarBudin.addEventListener('click', () => {
            const select = document.getElementById('saborBudin');
            const selectedOption = select.options[select.selectedIndex];
            const nombre = selectedOption.getAttribute('data-nombre');
            const precio = parseInt(selectedOption.getAttribute('data-precio'));
            agregarAlCarrito(nombre, precio);
        });
    }

    // Botón para Mini Budines
    const btnAgregarMiniBudin = document.querySelector('.tarjeta-mini-budin .mostrar-mini');
    if (btnAgregarMiniBudin) {
        btnAgregarMiniBudin.addEventListener('click', () => {
            const select = document.getElementById('saborMiniBudin');
            const selectedOption = select.options[select.selectedIndex];
            const nombre = selectedOption.getAttribute('data-nombre');
            const precio = parseInt(selectedOption.getAttribute('data-precio'));
            agregarAlCarrito(nombre, precio);
        });
    }

    // Botón para Budines sin Gluten
    const btnAgregarSinGluten = document.querySelector('.tarjeta-sin-gluten .mostrar-sg');
    if (btnAgregarSinGluten) {
        btnAgregarSinGluten.addEventListener('click', () => {
            const select = document.getElementById('saborSinGluten');
            const selectedOption = select.options[select.selectedIndex];
            const nombre = selectedOption.getAttribute('data-nombre');
            const precio = parseInt(selectedOption.getAttribute('data-precio'));
            agregarAlCarrito(nombre, precio);
        });
    }

    // Botón para Alfajores maicena
    const btnAgregarAlfajores = document.querySelector('.alfajores-maicena .mostrar-sg');
    if (btnAgregarAlfajores) {
        btnAgregarAlfajores.addEventListener('click', () => {
            const select = document.getElementById('cantidad');
            const selectedOption = select.options[select.selectedIndex];
            const nombre = selectedOption.getAttribute('data-nombre');
            const precio = parseInt(selectedOption.getAttribute('data-precio'));
            agregarAlCarrito(nombre, precio);
        });
    }

    // Botón para Postre en Pote
    const btnAgregarPostrePote = document.querySelector('.postres-pote .mostrar-sg');
    if (btnAgregarPostrePote) {
        btnAgregarPostrePote.addEventListener('click', () => {
            const select = document.getElementById('cantidad');
            const selectedOption = select.options[select.selectedIndex];
            const nombre = selectedOption.getAttribute('data-nombre');
            const precio = parseInt(selectedOption.getAttribute('data-precio'));
            agregarAlCarrito(nombre, precio);
        });
    }

    // Lógica del nuevo modal de pedido
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

    btnRetirar.addEventListener('click', () => {
        const telefono = '5492617028044';
        const fechaSeleccionada = fechaEntrega.value;

        if (!fechaSeleccionada) {
            alert('Por favor, selecciona una fecha de entrega.');
            return;
        }

        // --- COMIENZO DEL CÓDIGO CORREGIDO ---
        const fechaFormateada = new Date(fechaSeleccionada + 'T00:00:00');
        const fechaFinal = fechaFormateada.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        // --- FIN DEL CÓDIGO CORREGIDO ---

        let mensaje = `¡Hola! Me gustaría hacer el siguiente pedido para **RETIRO EN DOMICILIO** con fecha de entrega: ${fechaFinal}.\n\n`;
        mensaje += generarMensajePedido();
        mensaje += `\n\n_Para la ubicación del local, por favor revisa el perfil de WhatsApp._`;
        
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsapp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
        window.open(urlWhatsapp, '_blank');
        modalOpciones.classList.remove('visible');
    });

    btnCancelar.addEventListener('click', () => {
        const telefono = '5492617028044';
        const fechaSeleccionada = fechaEntrega.value;

        if (!fechaSeleccionada) {
            alert('Por favor, selecciona una fecha de entrega.');
            return;
        }

        // --- COMIENZO DEL CÓDIGO CORREGIDO ---
        const fechaFormateada = new Date(fechaSeleccionada + 'T00:00:00');
        const fechaFinal = fechaFormateada.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        // --- FIN DEL CÓDIGO CORREGIDO ---

        let mensaje = `¡Hola! Me gustaría hacer el siguiente pedido para *COORDINAR LA ENTREGA* con fecha de entrega: ${fechaFinal}.\n\n`;
        mensaje += generarMensajePedido();
        mensaje += `\n\nMi nombre es:`;
        
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsapp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
        window.open(urlWhatsapp, '_blank');
        modalOpciones.classList.remove('visible');
    });

    const generarMensajePedido = () => {
        let mensaje = '';
        for (const nombre in pedido) {
            if (pedido[nombre] > 0) {
                const itemElement = listaProductos.querySelector(`[data-nombre-item="${nombre}"]`);
                if (itemElement) {
                    const precio = parseInt(itemElement.getAttribute('data-precio'));
                    const subtotal = pedido[nombre] * precio;
                    mensaje += `${pedido[nombre]} x ${nombre} = $${subtotal.toLocaleString('es-CL')}\n`;
                }
            }
        }
        const totalFinal = recalcularTotal();
        mensaje += `\nTotal: $${totalFinal.toLocaleString('es-CL')}`;
        return mensaje;
    };

let primerClickMinimizar = true;
let intervaloPalpitar = null;

btnMinimizar.addEventListener('click', () => {
    carritoFijo.classList.toggle('minimizado');
    btnMinimizar.classList.remove('palpitar');

    if (primerClickMinimizar) {
        primerClickMinimizar = false;
        // Inicia el intervalo para palpitación cada 7 segundos, dura 3 segundos
        intervaloPalpitar = setInterval(() => {
            btnMinimizar.classList.add('palpitar');
            setTimeout(() => {
                btnMinimizar.classList.remove('palpitar');
            }, 3000); // 3 segundos de palpitación
        }, 5000); // Cada 5 segundos
    }

    if (carritoFijo.classList.contains('minimizado')) {
        btnMinimizar.innerHTML = '<i class="fas fa-chevron-up"></i>';
    } else {
        btnMinimizar.innerHTML = '<i class="fas fa-chevron-down"></i>';
    }
});
});