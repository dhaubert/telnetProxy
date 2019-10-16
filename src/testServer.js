const net = require("net");
const defaultAnswer = "ACK\n";

const handleData = (data, socket) => {
  console.log(`Receiving: ${data.toString()}`);
  console.log(`Sending: ${defaultAnswer}`);
  socket.write(defaultAnswer);
};

const server = net.createServer(socket => {
  socket.setEncoding("utf8");
  socket.on("data", data => {
    handleData(data, socket);
  });
});

server.on("connection", () => {
  console.log(`New client connected.`);
});

server.on("close", () => {
  console.log("Connection closed.");
});

const port = process.env.PORT || 8849;

server.listen(port, () => {
  const { address, port } = server.address();
  console.log(`Listening at ${address} : ${port}`);
});