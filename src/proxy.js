const net = require("net");

const address = { ip: "127.0.0.1", port: 8849 };

const clientConnections = [];
const port = process.env.PORT || 4988;

const findClientFromSocket = ({ _id }, clientConnections) =>
  clientConnections.find(client => client._id === _id);

const createId = () => Math.floor(Math.random() * 1000);

const handleData = (data, socket) => {
  let client = findClientFromSocket(socket, clientConnections);

  // connect to the server and listen for an anwser
  if (!client) {
    client = new net.Socket();
    client._id = socket._id;
    client.connect(address.port, address.ip, function() {
    //   console.log(`Connected to ${address.ip} : ${address.port}`);
    });

    client.on("data", dataReceived => {
      //receives from destiny
      log(`< ${dataReceived.toString()}`);
      socket.write(dataReceived); //writes to origin the answer
    });
    clientConnections.push(client);
  }
  log(`> ${data.toString()}`);
  client.write(data); //writes to destiny
};

const server = net.createServer(socket => {
  socket.setEncoding("utf8");
  socket._id = createId();
  socket.on("data", data => {
    // receiving data
    handleData(data, socket);
  });
});

server.on("connection", connection => {
  connection.id = createId();
  console.log("New client connected.");
});

server.on("close", () => {
  console.log("connection closed");
});

server.listen(port, () => {
  const { address, port } = server.address();
  console.log(`Listening at ${address} : ${port}`);
});

const log = logMessage => {
  console.log(`${new Date()} - ${logMessage}`);
};
