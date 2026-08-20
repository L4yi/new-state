import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true
  },
  ca1: {
    type: Number,
    required: true,
    default: 0
  },
  ca2: {
    type: Number,
    required: true,
    default: 0
  },
  exam: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  grade: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    required: true
  }
}, { timestamps: true, strict: false });

export default mongoose.model('Result', resultSchema);
