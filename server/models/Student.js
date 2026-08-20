import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: {
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
    enum: ['Male', 'Female'],
    default: 'Male'
  },
  dob: {
    type: String,
    default: ''
  },
  ninOrLasrra: {
    type: String,
    default: ''
  },
  stateOfOrigin: {
    type: String,
    default: 'Lagos'
  },
  lga: {
    type: String,
    default: 'Mushin'
  },
  nationality: {
    type: String,
    default: 'Nigerian'
  },
  bloodGroup: {
    type: String,
    default: 'O+'
  },
  genotype: {
    type: String,
    default: 'AA'
  },
  religion: {
    type: String,
    default: 'Christianity'
  },
  class: {
    type: String,
    required: true
  },
  classArm: {
    type: String,
    default: 'Arm A (Diamond)'
  },
  academicTrack: {
    type: String,
    default: 'Science & Technology'
  },
  admissionType: {
    type: String,
    default: 'Fresh Candidate'
  },
  house: {
    type: String,
    required: true
  },
  boardingStatus: {
    type: String,
    enum: ['Day Student', 'Boarding'],
    default: 'Day Student'
  },
  previousSchool: {
    type: String,
    default: ''
  },
  medicalConditions: {
    type: String,
    default: 'None'
  },
  guardian: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  guardianEmail: {
    type: String,
    default: ''
  },
  guardianAddress: {
    type: String,
    default: ''
  },
  fatherOccupation: {
    type: String,
    default: ''
  },
  motherName: {
    type: String,
    default: ''
  },
  motherOccupation: {
    type: String,
    default: ''
  },
  motherPhone: {
    type: String,
    default: ''
  },
  emergencyContact: {
    type: String,
    default: ''
  },
  whatsappAlertsEnabled: {
    type: Boolean,
    default: true
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
