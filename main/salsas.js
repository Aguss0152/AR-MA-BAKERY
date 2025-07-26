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
const mostrar1 = document.getElementById('mostrar1');
const ingrediente1 = document.getElementById('ingrediente1');

mostrar1.addEventListener('click', function()
    {
        if (ingrediente1.classList.contains('ingredientes'))
            {
            ingrediente1.classList.remove('ingredientes');
            mostrar1.textContent = 'Ocultar';
            window.location.hash = ('ingrediente1');
        } else {
            ingrediente1.classList.add('ingredientes');
            mostrar1.textContent = 'Mostrar';
            window.history.back();
        }
    });
const mostrar2= document.getElementById('mostrar2');
const ingrediente2 = document.getElementById('ingrediente2');

mostrar2.addEventListener('click', function()
{
    if (ingrediente2.classList.contains('ingredientes'))
    {
        ingrediente2.classList.remove('ingredientes');
        mostrar2.textContent = 'Ocultar';
        window.location.hash =('ingediente2');
    } else {
        ingrediente2.classList.add('ingredientes');
        mostrar2.textContent = 'Mostrar';
        window.history.back();
    }
});
const mostrar3= document.getElementById('mostrar3');
const ingrediente3 = document.getElementById('ingrediente3');

mostrar3.addEventListener('click', function()
{
    if (ingrediente3.classList.contains('ingredientes'))
    {
        ingrediente3.classList.remove('ingredientes');
        mostrar3.textContent = 'Ocultar';
        window.location.hash = ('ingrediente3');
    } else {
        ingrediente3.classList.add('ingredientes');
        mostrar3.textContent = 'Mostrar';
        window.history.back();
    }
});
const mostrar4 = document.getElementById('mostrar4');
const ingrediente4 = document.getElementById('ingrediente4');

mostrar4.addEventListener('click', function() {
    // Aquí es donde se maneja la visibilidad del ingrediente4
    if (ingrediente4.classList.contains('ingredientes')) {
        ingrediente4.classList.remove('ingredientes');
        // Si se estaba mostrando y ahora se oculta, el botón debe decir "Mostrar"
        mostrar4.textContent = 'Ocultar';
        window.location.hash = ('ingrediente4');
    } else {
        ingrediente4.classList.add('ingredientes');
        // Si se estaba ocultando y ahora se muestra, el botón debe decir "Ocultar"
        mostrar4.textContent = 'Mostrar';
        window.history.back();
    }
});
