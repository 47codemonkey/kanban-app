import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbConnect = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in your environment variables.');
    process.exit(1);
  }

  mongoose
    .connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error: ', err));
};

export default dbConnect;
