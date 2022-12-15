// Importamos el modulo "mongoose" para utilizar su metodo Schema
// y asi creamos el modelo de la entidad Worker (trabajador) para
// para registrar y guardar la informacion en la base de datos.
import mongoose from "mongoose";

// Definimos el schema de nuestra entidad para modelar sus datos
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
    required: [true, "El trabajador debe tener un Area de trabajo"],
  },
});
// Creamos y exportamos el modelo de nuestra entidad Worker que nos
// permitira acceder a la base de datos y consultar la informacion
// relacionada a esa entidad.
export default mongoose.model("Worker", workerSchema);
