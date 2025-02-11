import express from 'express';
import cors from 'cors';
import dbConnect from './dbConnect';
import cardRoutes from './api/cards';

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/cards', cardRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
