// Importamos el modulo moongose el cual nos ayuda a establecer una
// conexion con una base de datos MongoDB.
import mongoose from "mongoose";

// Con el metodo "connect" inicializamos la conexion a la base de datos
// de este servidor pasandole la direccion de la base de datos.
mongoose.connect(
  "mongodb+srv://root:casa@cluster0.owop3xo.mongodb.net/?retryWrites=true&w=majority"
);

// Importamos el modulo HTTP que nos permite usar caracteristicas
// del protocolo HTTP y nos permitira configurar nuestro servidor.
import http from "http";

// Con el metodo "createServer" se inicializa el servidor y le
// aplicamos algunas configuraciones.
const server = http.createServer((req, res) => {});

// Con el metodo "listen" de nuestro servidor ya inicializado le asignamos
// un puerto para que escuche y responda las peticiones.
server.listen(3000, console.log("Hello, World!"));
