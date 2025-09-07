import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  data: { type: Date, required: true },
  local: { type: String },
  fotos: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
