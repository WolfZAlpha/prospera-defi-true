import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  arbitrumWallet?: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  arbitrumWallet: { type: String, required: false },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
