const socket = io();
const formulario = document.getElementById('productForm');
const productsContainer = document.getElementById('productos');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formulario);

    const response = await fetch('/api/products', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
    } else {
        const responseData = await response.json();
        socket.emit('addProduct', responseData.product); 
        alert(responseData.message);
    }
});

// Eventos

socket.on('productAdded', async () => {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        console.log('Productos actualizados:');

        productsContainer.innerHTML = '';

       
        (products.payload || products).forEach(prod => {
            const productElement = document.createElement('div');
            productElement.className = 'producto';
            productElement.innerHTML = `
                <h2 class="titulo">${prod.title}</h2>
                <a href="/products/${prod.id}"><button>Ver más</button></a>
            `;
            productsContainer.appendChild(productElement);
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
});
