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
  term1: {
    type: Number,
    default: 60
  },
  term2: {
    type: Number,
    default: 62
  },
  aggregate300: {
    type: Number,
    default: 180
  },
  annualAverage: {
    type: Number,
    default: 60.0
  },
  grade: {
    type: String,
    required: true
  },
  remark: {
    type: String,
    required: true
  },
  pos: {
    type: String,
    default: '1st'
  },
  session: {
    type: String,
    default: '2025/2026'
  },
  term: {
    type: String,
    default: '3rd'
  }
}, { timestamps: true, strict: false });

export default mongoose.model('Result', resultSchema);
