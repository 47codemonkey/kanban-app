import express, { Request, Response } from 'express';
import Card, { ICard } from '../models/Card.js';
import { CreateCardBody, UpdateCardBody, ErrorResponse, SuccessResponse } from '../types/index.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response<ICard[] | ErrorResponse>) => {
  try {
    const { boardId } = req.query;

    const query: Record<string, unknown> = {};
    if (typeof boardId === 'string') {
      query.boardId = boardId;
    }

    const cards = await Card.find(query);
    res.json(cards);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: errorMessage });
  }
});

router.post('/', async (req: Request<{}, {}, CreateCardBody>, res: Response<ICard | ErrorResponse>) => {
  try {
    const { title, description, status, boardId } = req.body;
    const newCard = new Card({ title, description, status, boardId });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Error:', error instanceof Error ? error.message : JSON.stringify(error));
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: errorMessage });
  }
});

router.put(
  '/:id',
  async (req: Request<{ id: string }, {}, UpdateCardBody>, res: Response<ICard | null | ErrorResponse>) => {
    try {
      const { title, description, status } = req.body;
      const updatedCard = await Card.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
      res.json(updatedCard);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Server error';
      res.status(500).json({ error: errorMessage });
    }
  },
);

router.delete('/:id', async (req: Request<{ id: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted' });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
