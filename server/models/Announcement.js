import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  announcementId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
