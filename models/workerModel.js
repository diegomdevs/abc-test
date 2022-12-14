// Importamos el modulo "mongoose" para utilizar su metodo Schema
// y asi creamos el modelo de la entidad Worker (trabajador) para
// para registrar y guardar la informacion en la base de datos.
import mongoose from "mongoose";

// Definimos el schema de nuestra entidad para guardar sus datos
// correctamente en la base de datos.
const workerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "El trabajador debe tener un nombre"],
  },
  lastName: {
    type: String,
    required: [true, "El trabajador debe tener un apellido"],
  },
  workArea: {
    type: String,
    required: [true, "El trabajador debe tener una Area de trabajo"],
  },
});
export default mongoose.model("Worker", workerSchema);
