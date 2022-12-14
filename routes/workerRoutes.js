import Worker from "../models/workerModel.js";

const api = {
  url: "/api/v1/workers",
  get: "GET",
};

const router = async function (req, res) {
  if (req.url === api.url && req.method === api.get) {
    const workers = await Worker.find();
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(workers));
  }
  if (
    req.url.match(new RegExp(`${api.url}/([0-9]+)`)) &&
    req.method === "GET"
  ) {
    try {
      const id = req.url.split("/")[3];
      const worker = await Worker.findById(id);
      if (worker) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(worker));
      } else {
        throw new Error("El trabajador no esta registrado");
      }
    } catch (error) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: error }));
    }
  }
  if (req.url === api.url && req.method === "POST") {
    try {
      let body = "";

      req.on("data", () => {
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
};
export default router;
