const socket = io.connect();

socket.on("toClient", (msg) => {
  console.log(msg);
});
socket.emit("toServer", "client side respond to backend server");
