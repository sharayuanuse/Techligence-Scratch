import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const companySchema = mongoose.Schema(
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

companySchema.index({ email: 1, role: 1 }, { unique: true });

companySchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

companySchema.methods.matchPasswords = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const companyUser = mongoose.model('CompanyUser', companySchema);

export default companyUser;
