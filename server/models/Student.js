import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    default: 'Male'
  },
  class: {
    type: String,
    required: true
  },
  house: {
    type: String,
    required: true
  },
  guardian: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  feeStatus: {
    type: String,
    enum: ['Approved', 'Pending', 'Unpaid'],
    default: 'Unpaid'
  },
  feeAmount: {
    type: String,
    required: true
  },
  paidAmount: {
    type: String,
    default: '₦0'
  },
  password: {
    type: String,
    default: '1234'
  }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
