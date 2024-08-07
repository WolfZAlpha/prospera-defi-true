import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  arbitrumWallet?: string;
  isVerified: boolean;
  verifyToken?: string;
  verifyTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  toJSON(): Partial<IUser>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  arbitrumWallet: { 
    type: String, 
    required: false,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    required: false
  },
  verifyTokenExpiry: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Add a method to the schema
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  const { password, ...userWithoutPassword } = userObject;
  return userWithoutPassword;
};

// Add a static method to the schema
userSchema.static('findByEmail', function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
});

const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);

export default User;