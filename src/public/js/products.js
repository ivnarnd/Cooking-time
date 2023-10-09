const container = document.getElementById('container-products');
console.log('hola mundo')
fetch('../api/products/')
.then(resp => resp.json())
    .then(data =>{
        data.message.docs.forEach(product => {
            // Crea un elemento HTML para cada producto
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto'); // Agrega clases u otros atributos según tus necesidades
          
            // Puedes mostrar la información del producto en el elemento creado
            productoElement.innerHTML = `
              <h2>${product.title}</h2>
              <p>Precio: ${product.price}</p>
              <p>Descripción: ${product.description}</p>
            `;
          
            // Agrega el elemento al documento (por ejemplo, a un contenedor)
            document.getElementById('container-products').appendChild(productoElement);
          });
          
    })
.catch(error => console.log(error));