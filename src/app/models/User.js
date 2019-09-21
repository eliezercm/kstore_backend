import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    requird: true,
  },
  phone: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Revendedora', 'Cliente', 'Admin', 'Pending'],
    default: 'Pending',
  },
  roleDesired: {
    enum: ['Revendedora', 'Cliente'],
    required: true,
  },
});

UserSchema.pre('save', async function(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  user.password = await bcrypt.hash(user.password, 8);

  return next();
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', UserSchema);
