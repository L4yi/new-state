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
  entryClass: {
    type: String,
    default: 'JSS 1'
  },
  classArm: {
    type: String,
    default: 'Arm A'
  },
  academicTrack: {
    type: String,
    default: 'Junior Secondary Foundation'
  },
  admissionCriteria: {
    type: String,
    default: 'Internal Entrance Examination'
  },
  entranceExamScore: {
    type: String,
    default: '84%'
  },
  entranceExamRegNo: {
    type: String,
    default: ''
  },
  priorClass: {
    type: String,
    default: 'Primary 6'
  },
  priorCertificate: {
    type: String,
    default: 'Primary School Leaving Certificate (PSLC)'
  },
  house: {
    type: String,
    default: 'Red House (Tiger)'
  },
  boardingStatus: {
    type: String,
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
  guardianName: {
    type: String,
    default: ''
  },
  guardianRelationship: {
    type: String,
    default: 'Father'
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
  emergencyPhone: {
    type: String,
    default: ''
  },
  whatsappAlertsEnabled: {
    type: Boolean,
    default: true
  },
  feeStatus: {
    type: String,
    default: 'Unpaid'
  },
  feeAmount: {
    type: String,
    default: '₦95,000'
  },
  paidAmount: {
    type: String,
    default: '₦0'
  },
  password: {
    type: String,
    default: '1234'
  },
  admissionDate: {
    type: String,
    default: () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }
}, { timestamps: true, strict: false });

export default mongoose.model('Student', studentSchema);
