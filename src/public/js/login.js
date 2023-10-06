const form = document.getElementById('form-login');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const datForm = new FormData(e.target) //Me genera un objeto iterador
    const prod = Object.fromEntries(datForm) //De un objeto iterable genero un objeto simple;
    fetch('/api/sessions/login',{
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json', // Indica que estás enviando datos en formato JSON
        },
        body:JSON.stringify({...prod}), // body data type must match "Content-Type" header
      })
      .then(data=> data.json())
      .then(dataParsed => console.log(dataParsed));
    
});