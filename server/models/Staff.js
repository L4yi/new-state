import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  staffId: {
    type: String,
    unique: true,
    sparse: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Teacher'
  },
  department: {
    type: String,
    default: 'Sciences & Technology'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  phone: {
    type: String,
    default: '08134000644'
  },
  password: {
    type: String,
    default: '1234'
  },
  isClassTeacher: {
    type: Boolean,
    default: false
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
}, { timestamps: true, strict: false });

export default mongoose.model('Staff', staffSchema);
