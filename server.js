// Importamos el modulo moongose el cual nos ayuda a establecer una
// conexion con una base de datos MongoDB.
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import router from "./routes/workerRoutes.js";

// Importamos el modulo HTTP que nos permite usar caracteristicas
// del protocolo HTTP y nos permitira configurar nuestro servidor.
import http from "http";

const uri =
  "mongodb+srv://root:root@cluster0.owop3xo.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri);

// Con el metodo "createServer" se inicializa el servidor y le
// aplicamos algunas configuraciones.
const server = http.createServer((req, res) => {
  router(req, res);
});

const PORT = process.env.PORT || 5000;

// Con el metodo "listen" de nuestro servidor ya inicializado le asignamos
// un puerto para que escuche y responda las peticiones.
server.listen(PORT, () => {
  console.log(`El servidor esta corriendo en el puerto: ${PORT}`);
});
