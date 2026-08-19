import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    default: '1234'
  },
  classAssigned: {
    type: String,
    default: null
  },
  subjectsTaught: [
    {
      subjectName: { type: String, required: true },
      className: { type: String, required: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Staff', staffSchema);
