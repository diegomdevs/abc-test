// Importamos el modulo Worker para utilizar sus metodos.
import Worker from "../models/workerModel.js";

// Creamos un objeto para guardar algunas
// palabras claves que se repetiran mucho
// en estas funcionalidades.
const api = {
  url: "/api/v1/",
  workersRoute: "/api/v1/workers/",
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
};

// Con esta expresion regular verificamos si las peticiones estan
// apuntando a una url de la aplicacion correcta.
const expRegRutaEstatica = /^\/api\/v1\/workers\/?$/;

// Al igual que la primera expresion regular se encarga de verificar
// las urls de las peticiones pero esta vez se encarga de buscar
//  un ID con el cual buscaremos datos especificos en la
// base de datos.
const expRegRutaDinamica = /^\/api\/v1\/workers\/?[(0-9 | a-z)]+$/;

/**
 * Se encarga de extraer los IDs de las urls
 * @param {*} url url a la cual apunta la peticion
 * @param {*} idPosition posicion del ID resultado de un split del string
 * el cual retorna un array.
 * @returns El ID encontrado en la url.
 */
function extraerIdDeLaUrl(url, idPosition) {
  return url.split("/")[idPosition];
}
/**
 * Este metodo se encarga del control total de las rutas de la aplicacion,
 * respondiendo correctamente en cada uno de los casos que se presenten.
 * @param {*} req peticion que llega a la aplicacion.
 * @param {*} res respuesta que se genera para otorgar informacion a la
 * peticion segun sea el caso.
 */
const router = async function (req, res) {
  // Con esta condicion nos encargamos de verificar si la url a la que
  // apuntan las peticiones cumplan las reglas para recibirlas correcta-
  // mente. Si se cumple la condicion la peticion sera recibida y proce-
  // sada correctamente, en el caso contrario la aplicacion se encarga.

  if (!expRegRutaEstatica.test(req.url) && !expRegRutaDinamica.test(req.url)) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Pagina no encontrada" }));
  } else {
    // Ya verificado que la url si cumple con las reglas, pasamos a ver que tipo
    // de peticion estamos recibiendo.

    // URLs estaticas
    if (expRegRutaEstatica.test(req.url)) {
      // Metodo GET
      if (req.method === api.get) {
        const workers = await Worker.find();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(workers));
      }

      // Metodo POST
      if (req.method === api.post) {
        try {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", async () => {
            let worker = new Worker(JSON.parse(body));
            await worker.save();
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify(worker));
          });
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error }));
        }
      }
    } else {
      // URLs dinamicas
      // Metodo GET con un ID para consultar informacion especifica.
      if (req.method === api.get) {
        try {
          const id = extraerIdDeLaUrl(req.url, 4);
          const worker = await Worker.findById(id);
          if (!worker) {
            throw new Error("El empleado no esta registrado");
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(worker));
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          if (error.name === "CastError")
            error.message =
              "El formato del ID es invalido. Por favor ingrese el ID correctamente";
          res.end(JSON.stringify({ message: error.message }));
        }
      }
      // Metodo PUT con un ID para actualizar informacion especifica.
      if (req.method === api.put) {
        try {
          const id = extraerIdDeLaUrl(req.url, 4);
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", async () => {
            let updatedWorker = await Worker.findByIdAndUpdate(
              id,
              JSON.parse(body),
              {
                new: true,
              }
            );
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedWorker));
          });
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }

      // Metodo DELETE con un ID para eliminar informacion especifica.
      if (req.method === api.delete) {
        try {
          const id = extraerIdDeLaUrl(req.url, 4);
          const deletedWorker = await Worker.findByIdAndDelete(id);

          if (!deletedWorker) {
            throw new Error("El empleado no esta registrado");
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "El empleado fue eliminado correctamente",
            })
          );
        } catch (error) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: error.message }));
        }
      }
    }
  }
};
export default router;
