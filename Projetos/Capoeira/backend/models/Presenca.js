import mongoose from 'mongoose';

const presencaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nome: { type: String, required: true },
  data: { type: String, required: true }, // formato: 'YYYY-MM-DD'
  hora: { type: String, required: true }, // formato: 'HH:mm:ss'
  mes: { type: String, required: true }, // formato: 'YYYY-MM'
}, { timestamps: true });

export default mongoose.model('Presenca', presencaSchema);
