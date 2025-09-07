import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evento: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  dataInscricao: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
