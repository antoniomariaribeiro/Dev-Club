import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: { type: String },
  imagens: [{ type: String, required: true }],
  evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
