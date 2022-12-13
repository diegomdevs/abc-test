// Importamos el modulo HTTP que nos permite usar caracteristicas
// del protocolo HTTP y nos permitira configurar nuestro servidor.
import http from "http";
// Con el metodo "createServer" se inicializa el servidor y le
// aplicamos algunas configuraciones
const server = http.createServer((req, res) => {});

// Con el metodo "listen" de nuestro servidor ya inicializado le asignamos
// un puerto para que escuche y responda las peticiones.
server.listen(3000, console.log("Hello, World!"));
