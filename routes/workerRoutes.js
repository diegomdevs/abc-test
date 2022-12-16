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
  // Con esta condicion nos encargamos de verificar que las URLs que
  // apuntan las peticiones esten correctamente escritas. Si la condicion
  // se cumple la aplicacion directamente rechaza la peticion y le indica
  // que la URL esta mal escrita, en el caso contrario la peticion entra
  // a ser revisa y generar una respuesta dependiendo de los datos traidos
  // de la peticion.
  if (!expRegRutaEstatica.test(req.url) && !expRegRutaDinamica.test(req.url)) {
    // Se rechaza la peticion y se indica que la URL que apunta la peticion
    // no existe.
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Pagina no encontrada" }));
  } else {
    // Ya verificado que la url si cumple con las reglas, pasamos a ver que tipo
    // de peticion estamos recibiendo.

    // URLs estaticas
    // La condicion se encarga de verificar si la URL es estatica.
    if (expRegRutaEstatica.test(req.url)) {
      // Metodo GET
      if (req.method === api.get) {
        // Con el metodo find del Modelo Worker de nuestra
        // base de datos buscamos todos los documentos registrados de
        // dicha entidad en la base de datos.
        const workers = await Worker.find();
        // Metemos los datos en la respuesta y se envian al usuario.
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(workers));
      }
      // Metodo POST
      if (req.method === api.post) {
        try {
          // Recibimos los datos que nos envia el usuario para regisrarlo,
          // en la base de datos.
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          // Se guarda y se le envia los datos ya registrados en la base de datos.
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
          // Se obtiene el ID de la URL dinamica
          const id = extraerIdDeLaUrl(req.url, 4);

          // Se busca un documento a base de una ID
          const worker = await Worker.findById(id);

          // Si la busqueda del documento resulta null se indica al
          // usuario que no existe la documento que busca.
          if (!worker) {
            throw new Error("El empleado no esta registrado");
          }
          // Se retorna al usuario la informacion que resulta de la
          // busqueda
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(worker));
        } catch (error) {
          // En el caso que el usuario mande una ID invalida se le
          // indica que dicho error.
          res.writeHead(404, { "Content-Type": "application/json" });
          if (error.name === "CastError")
            error.message =
              "El formato del ID es invalido. Por favor ingrese el ID correctamente";
          res.end(JSON.stringify({ message: error.message }));
        }
      }
      //
      // Metodo PUT con un ID para actualizar informacion especifica.
      if (req.method === api.put) {
        try {
          // Se obtiene el ID de la URL dinamica.
          const id = extraerIdDeLaUrl(req.url, 4);
          // Se recibe los datos que nos envia el usuario para regisrarlo
          // en la base de datos.
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          // Se manda el cuerpo de la informacion que nos envia el usuario
          // para actualizar algun documento en la base de datos.
          req.on("end", async () => {
            let updatedWorker = await Worker.findByIdAndUpdate(
              id,
              JSON.parse(body),
              {
                new: true,
              }
            );
            // Se devuelve al usuario los datos ya actualizados en la base de datos.
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
          // Se obtiene el ID de la URL dinamica.
          const id = extraerIdDeLaUrl(req.url, 4);
          // Se busca el documento en la base de datos y se elimina.
          const deletedWorker = await Worker.findByIdAndDelete(id);
          // Si la busqueda no retorna nada se notifica que el documento
          // no existe.
          if (!deletedWorker) {
            throw new Error("El empleado no esta registrado");
          }
          // Se le notifica al usuario que el documento ha sido eliminado.
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
