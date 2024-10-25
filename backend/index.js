import dotenv from 'dotenv';
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose';
import registerRoute from './MongoDB/auth/signup.js'

dotenv.config();


const app = express()
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // No longer necessary in Mongoose 6+
  }
).then(() => console.log('Connected to MongoDB.'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
);


app.post('/api/register', registerRoute);

// Define the port, defaulting to 5000 if not set
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});