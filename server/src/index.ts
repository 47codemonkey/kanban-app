import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import dbConnect from './dbConnect.js';
import cardRoutes from './api/cards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());

dbConnect();

app.use('/api/cards', cardRoutes);

app.use(express.static(path.join(__dirname, '../../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  process.stdout.write(`Server running on port ${PORT}\n`);
});
