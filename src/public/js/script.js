const socket = io();
const btnChat = document.getElementById('btn-chat');
const inputChat = document.getElementById('chat-box');
const collectionMsg = document.getElementById('parragraph-msg');
let user;

Swal.fire({
    title: "Identificacion de usuario",
    text: "Por favor ingrese su nombre de usuario",
    input: "text",
    inputValidator: (valor) => {
        return !valor && "Ingrese su nombre de usuario valido"
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value;
});
btnChat.addEventListener('click', () => {
    let date = new Date().toLocaleString()

    if (inputChat.value.trim().length > 0) {
        socket.emit('msg', { user: user, mesage: inputChat.value,date: date });
        inputChat.value = "";
        socket.on();
    }
})

socket.on('mesages', (arrayMsg) => {
    let msgs = [];
    collectionMsg.innerHTML = "";
    arrayMsg.forEach(msg => {
        console.log(msg)
        collectionMsg.innerHTML += `<p>${msg.postTime}: el usuario ${msg.email} escribio ${msg.message} </p>`;
    });
});