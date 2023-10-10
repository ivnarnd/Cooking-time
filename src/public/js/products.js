const container = document.getElementById('container-products');
const btn_logout = document.getElementById('btn-logout');

fetch('../api/products/')
.then(resp => resp.json())
    .then(data =>{
        data.message.docs.forEach(product => {
            // Crea un elemento HTML para cada producto
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto');
          
            productoElement.innerHTML = `
              <h2>${product.title}</h2>
              <p>Precio: ${product.price}</p>
              <p>Descripción: ${product.description}</p>
            `;
            document.getElementById('container-products').appendChild(productoElement);
          });
          
    })
.catch(error => console.log(error));

btn_logout.addEventListener('click',()=>{
    fetch('../api/sessions/logout').then( resp => window.location.href = resp.url).catch(err => console.err(err));
})