// Importamos el modulo moongose el cual nos ayuda a establecer una
// conexion con una base de datos MongoDB.
import mongoose from "mongoose";

// Importamos el modulo HTTP que nos permite usar caracteristicas
// del protocolo HTTP y nos permitira configurar nuestro servidor.
import http from "http";

// Importamos el router de la aplicacion para redireccionar y recibir
// correctamente las peticiones.
import router from "./routes/workerRoutes.js";

// Obtenemos la uri de nuestra base de datos y la definimos una
// variable para guardarla.
const uri =
  "mongodb+srv://root:root@cluster0.owop3xo.mongodb.net/?retryWrites=true&w=majority";

// Definimos el PORT de nuestra aplicacion en el cual va a escuchar las peticiones.
const PORT = process.env.PORT || 5000;

// Utilizamos el metodo "connect" del modulo mongoose para establecer
// conexion a nuestra base de datos.
mongoose.connect(uri);

// Con el metodo "createServer" se inicializa el servidor y le
// aplicamos algunas configuraciones.
const server = http.createServer((req, res) => {
  router(req, res);
});

// Con el metodo "listen" de nuestro servidor ya inicializado y le asignamos
// el puerto para que escuche y responda las peticiones.
server.listen(PORT);
