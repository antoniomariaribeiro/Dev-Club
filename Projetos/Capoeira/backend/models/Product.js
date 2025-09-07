import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String },
  preco: { type: Number, required: true },
  imagem: { type: String },
  categoria: { type: String },
  estoque: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
