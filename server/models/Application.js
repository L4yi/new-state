import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  studentName: {
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
  currentClass: {
    type: String,
    default: 'Primary 6'
  },
  classApplyingFor: {
    type: String,
    required: true
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianRelationship: {
    type: String,
    default: 'Parent / Guardian'
  },
  fatherName: {
    type: String,
    default: ''
  },
  motherName: {
    type: String,
    default: ''
  },
  primaryPhone: {
    type: String,
    required: true
  },
  altPhone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: 'Lagos, Nigeria'
  },
  previousSchool: {
    type: String,
    default: ''
  },
  medicalConditions: {
    type: String,
    default: 'None'
  },
  status: {
    type: String,
    enum: ['Pending Review', 'Accepted & Enrolled', 'Declined'],
    default: 'Pending Review'
  },
  dateSubmitted: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  }
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);
