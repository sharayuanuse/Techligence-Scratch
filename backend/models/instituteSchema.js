import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const instituteSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    otp: String,
    otpExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Define unique compound index on email and role
instituteSchema.index({ email: 1, role: 1 }, { unique: true });

instituteSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

instituteSchema.methods.matchPasswords = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const instituteUser = mongoose.model('InstituteUser', instituteSchema);

export default instituteUser;
