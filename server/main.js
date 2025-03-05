
const socket = io("http://localhost:3000");

function displayMessage(message) {
    var newMessage = document.createElement("div");

    newMessage.innerHTML = message;
    document.getElementById("chat").appendChild(newMessage);
}
const username = prompt("What is your name?")

displayMessage("You joined")
socket.emit('new-user', username)

socket.on('connect', () => {
    console.log(`You connected with id: ${socket.id}`);
    displayMessage(`You connected with id: ${socket.id}`)
})
socket.on('message', data => displayMessage(`${data.user}: ${data.message}`))
socket.on('user-connected', name => displayMessage(`${name} connected.`))

socket.on("user-disconnected", name => displayMessage(`${name} disconnected.`))

function joinRoom() {
    let roomName = document.getElementById("roomName").value;
     // Join the specified room
    socket.emit('joinRoom', roomName);
    console.log(roomName);
    socket.on(roomName, (data) => {
        displayMessage(data)
    })
}
function onSendMessage() {
    let sendMessage = document.getElementById("sendMessage").value;
    // sendMessage = `${socket.id}: ${sendMessage}`
    socket.emit("message", sendMessage)
    document.getElementById("sendMessage").value = '';
}





