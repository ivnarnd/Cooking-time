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
      }).then(resp=>{
          if(resp.redirected){
              window.location.href = resp.url;
          }
      }).catch(err => console.log(err))
    
});
