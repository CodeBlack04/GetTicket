import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log("Starting up");
  if (!process.env.JWT_KEY) {
    throw new Error('Secret key(jwt_key) must be valid.')
  };

  if (!process.env.MONGO_URI) {
    throw new Error('Secret key(mongo_uri) must be valid.')
  };
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!');
  });
};

start();
