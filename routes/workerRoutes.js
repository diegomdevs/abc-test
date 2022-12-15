import Worker from "../models/workerModel.js";

const api = {
  url: "/api/v1/",
  workersRoute: `/api/v1/workers/`,
  get: "GET",
  post: "POST",
  put: "PUT",
  delete: "DELETE",
};

const expRegDeLaUrlConId = /\/api\/v1\/workers\/([0-9]+)\//;

async function verificarUrlWithId(urlToVerify) {
  return urlToVerify.match(/\/api\/v1\/workers\/([0-9]+)/);
}

function extraerIdDeLaUrl(url, idPosition) {
  return url.split("/")[idPosition];
}

const router = async function (req, res) {
  // GET Method
  if (req.url === "/api/v1/workers" && req.method === api.get) {
    const workers = await Worker.find();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(workers));
  }

  // GET Method with an id
  if (req.url.match(/\/api\/v1\/workers\/([0-9]+)/) && req.method === api.get) {
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
      res.end(JSON.stringify({ message: error.message }));
    }
  }

  // POST method
  if (req.url === "/api/v1/workers" && req.method === "POST") {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        let worker = new Worker(JSON.parse(body));
        await worker.save();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(worker));
      });
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  }
  // Metodo PUT con un id
  if (req.url.match(/\/api\/v1\/workers\/([0-9]+)/) && req.method === api.put) {
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

  // Metodo DELETE usando un id
  if (
    req.url.match(/\/api\/v1\/workers\/([0-9]+)/) &&
    req.method === api.delete
  ) {
    try {
      const id = extraerIdDeLaUrl(req.url, 4);
      const deletedWorker = await Worker.findByIdAndDelete(id);

      if (!deletedWorker) {
        throw new Error("El empleado no esta registrado");
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ message: "El empleado fue eliminado correctamente" })
      );
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error.message }));
    }
  }
};
export default router;
