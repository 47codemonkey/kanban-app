import mongoose from 'mongoose';

const dbConnect = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in your environment variables.');
  }

  mongoose
    .connect(uri)
    .then(() => {
      process.stdout.write('MongoDB connected\n');
    })
    .catch((error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown MongoDB connection error';
      process.stderr.write(`MongoDB connection error: ${errorMessage}\n`);
    });
};

export default dbConnect;
