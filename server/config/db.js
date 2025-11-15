import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing in env');

    await mongoose.connect(uri, { dbName: 'rarerupees' });
    console.log('MongoDB connected (ESM)');
  } catch (err) {
    console.error('Database Error:', err);
    process.exit(1);
  }
};

export default connectDB;
