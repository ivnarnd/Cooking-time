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
    user = resultado.value
    console.log(user)
});
btnChat.addEventListener('click', () => {
    let date = new Date().toLocaleString()

    if (inputChat.value.trim().length > 0) {
        socket.emit('msg', { date: date, user: user, mesage: inputChat.value });
        inputChat.value = "";
        socket.on();
    }
})

socket.on('mesages', (arrayMsg) => {
    collectionMsg.innerHTML = "";
    arrayMsg.forEach(msg => {
        collectionMsg.innerHTML += `<p>${msg.date}: el usuario ${msg.user} escribio ${msg.mesage} </p>`;
    });
});