import express from 'express';
import connectDB from './db/databaseConnection.js';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config();


const PORT = process.env.PORT || 5000;
const clientDomain = process.env.ClientDomainURL || 'http://192.168.';


console.log(PORT);
console.log(clientDomain);
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);




connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    console.log("Connected to the database");
  });
});



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});