document.addEventListener('DOMContentLoaded', () => {
    const menos = document.querySelector('.menos');
    const navegador2 = document.querySelector('.navegador2');

    if (menos && navegador2) {
        menos.addEventListener('click', () => {
            navegador2.classList.toggle('active');
            menos.classList.toggle('active'); // Para animar el botón hamburguesa
        });
    } else {
        console.error('No se encontraron los elementos .menos y .navegado2. Verifica tus selectores.');
    }
});

const mostrar = document.getElementById('mostrar');
const ingrediente = document.getElementById('ingrediente');

mostrar.addEventListener('click', function()
    {
        if (ingrediente.classList.contains('ingredientes'))
            {
            ingrediente.classList.remove('ingredientes');
            mostrar.textContent = 'Ocultar';
            window.location.hash = 'ingrediente';
        } else {
            ingrediente.classList.add('ingredientes');
            mostrar.textContent = 'Mostrar';
            window.history.back();
        }
    });

const mostrar3 = document.getElementById('mostrar3');
const ingrediente3 = document.getElementById('ingrediente3');

mostrar3.addEventListener('click', function()
    {
        if (ingrediente3.classList.contains('ingredientes'))
            {
            ingrediente3.classList.remove('ingredientes');
            mostrar3.textContent = 'Ocultar';
            window.location.hash = 'ingrediente3';
        } else {
            ingrediente3.classList.add('ingredientes');
            mostrar3.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar8 = document.getElementById('mostrar8');
const ingrediente8 = document.getElementById('ingrediente8');

mostrar8.addEventListener('click', function()
    {
        if (ingrediente8.classList.contains('ingredientes'))
            {
            ingrediente8.classList.remove('ingredientes');
            mostrar8.textContent = 'Ocultar';
            window.location.hash = 'ingrediente8';
        } else {
            ingrediente8.classList.add('ingredientes');
            mostrar8.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar1 = document.getElementById('mostrar1');
const ingrediente1 = document.getElementById('ingrediente1');

mostrar1.addEventListener('click', function() {
    // Verificar si el ingrediente está oculto ANTES de cambiar su estado
    const estaOcultoInicialmente = ingrediente1.classList.contains('ingredientes');

    if (estaOcultoInicialmente) {
        // Si estaba oculto y ahora se va a mostrar
        ingrediente1.classList.remove('ingredientes');
        mostrar1.textContent = 'Ocultar';
        // Desplazar a la sección cuando se MUESTRA
        window.location.hash = 'ingrediente1'; // O ingrediente1.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Si estaba visible y ahora se va a ocultar
        ingrediente1.classList.add('ingredientes');
        mostrar1.textContent = 'Mostrar';
        // Al ocultar, volver a la posición anterior en el historial del navegador
        // Esto asume que la acción de "mostrar" añadió una entrada al historial
        window.history.back();
    }
});

// Opcional: Asegúrate de que el texto del botón sea correcto al cargar la página
document.addEventListener('DOMContentLoaded', (event) => {
    // Si ingrediente1 tiene la clase 'ingredientes', significa que está oculto por defecto
    if (ingrediente1.classList.contains('ingredientes')) {
        mostrar1.textContent = 'Mostrar';
    } else {
        // Si no tiene la clase 'ingredientes', significa que está visible por defecto
        mostrar1.textContent = 'Ocultar';
    }
});

const mostrar2 = document.getElementById('mostrar2');
const ingrediente2 = document.getElementById('ingrediente2');

mostrar2.addEventListener('click', function()
    {
        if (ingrediente2.classList.contains('ingredientes'))
            {
            ingrediente2.classList.remove('ingredientes');
            mostrar2.textContent = 'Ocultar';
            window.location.hash = 'ingrediente2';
        } else {
            ingrediente2.classList.add('ingredientes');
            mostrar2.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar5 = document.getElementById('mostrar5');
const ingrediente5 = document.getElementById('ingrediente5');

mostrar5.addEventListener('click', function()
    {
        if (ingrediente5.classList.contains('ingredientes'))
            {
            ingrediente5.classList.remove('ingredientes');
            mostrar5.textContent = 'Ocultar';
            window.location.hash = 'ingrediente5';
        } else {
            ingrediente5.classList.add('ingredientes');
            mostrar5.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar6 = document.getElementById('mostrar6');
const ingrediente6 = document.getElementById('ingrediente6');

mostrar6.addEventListener('click', function ()
    {
        if (ingrediente6.classList.contains('ingredientes'))
            {
            ingrediente6.classList.remove('ingredientes');
            mostrar6.textContent = 'Ocultar';
            window.location.hash = 'ingrediente6';
        } else {
            ingrediente6.classList.add('ingredientes');
            mostrar6.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar7 = document.getElementById('mostrar7');
const ingrediente7 = document.getElementById('ingrediente7');

mostrar7.addEventListener('click', function()
    {
        if (ingrediente7.classList.contains('ingredientes'))
            {
            ingrediente7.classList.remove('ingredientes');
            mostrar7.textContent = 'Ocultar';
            window.location.hash = 'ingrediente7';
        } else {
            ingrediente7.classList.add('ingredientes');
            mostrar7.textContent = 'Mostrar';
            window.history.back();
        }
    });
    const mostrar9 = document.getElementById('mostrar9');
const ingrediente9 = document.getElementById('ingrediente9');

mostrar9.addEventListener('click', function()
{
    if (ingrediente9.classList.contains('ingredientes'))
    {
        ingrediente9.classList.remove('ingredientes');
        mostrar9.textContent = 'Ocultar';
        window.location.hash = 'ingrediente9';
    } else {
        ingrediente9.classList.add('ingredientes');
        mostrar9.textContent = 'Mostrar';
        window.history.back();
    }
});
const mostrar10 = document.getElementById('mostrar10');
const ingrediente10 = document.getElementById('ingrediente10');

mostrar10.addEventListener('click', function()
{
    if (ingrediente10.classList.contains('ingredientes'))
    {
        ingrediente10.classList.remove('ingredientes');
        mostrar10.textContent = 'Ocultar';
        window.location.hash = 'ingrediente10';
    } else {
        ingrediente10.classList.add('ingredientes');
        mostrar10.textContent = 'Mostrar';
        window.history.back();
    }
});
const mostrar11 = document.getElementById('mostrar11');
const ingrediente11 = document.getElementById('ingrediente11');

mostrar11.addEventListener('click', function()
{
    if (ingrediente11.classList.contains('ingredientes'))
    {
        ingrediente11.classList.remove('ingredientes');
        mostrar11.textContent = 'Ocultar';
        window.location.hash = 'ingrediente11';
    } else {
        ingrediente11.classList.add('ingredientes');
        mostrar11.textContent = 'Mostrar';
        window.history.back();
    }
});