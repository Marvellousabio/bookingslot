import mongoose from 'mongoose';

const SpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['coworking', 'meeting room', 'event venue', 'conference hall'],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  description: {
    type: String,
    required: true,
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  images: [{
    type: String, // URLs
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Space || mongoose.model('Space', SpaceSchema);