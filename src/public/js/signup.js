const form = document.getElementById('form-signup');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    form.reset();
    const dat = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple;
    fetch('/api/users/',{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json', // Indica que estás enviando datos en formato JSON
        },
        body:JSON.stringify({...dat}), // body data type must match "Content-Type" header
      })
      .then(data=> data.json())
      .then(dataParsed =>{
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'su registro fue exitoso',
            showConfirmButton: true,
            timer: 1500
        })
      }).catch(err=>console.err(err));
    
});
