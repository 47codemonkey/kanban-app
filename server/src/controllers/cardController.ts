import { Request, Response } from 'express';
import Card, { ICard } from '../models/Card.js';
import { CreateCardBody, UpdateCardBody, ErrorResponse, SuccessResponse } from '../types/index.js';

export const getCards = async (req: Request, res: Response<ICard[] | ErrorResponse>) => {
  try {
    const { boardId } = req.query;
    const query: Record<string, unknown> = boardId ? { boardId } : {};
    const cards = await Card.find(query);
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const createCard = async (req: Request<{}, {}, CreateCardBody>, res: Response<ICard | ErrorResponse>) => {
  try {
    const { title, description, status, boardId } = req.body;
    const newCard = new Card({ title, description, status, boardId });
    await newCard.save();
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const updateCard = async (
  req: Request<{ id: string }, {}, UpdateCardBody>,
  res: Response<ICard | null | ErrorResponse>,
) => {
  try {
    const { title, description, status } = req.body;
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
    res.json(updatedCard);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const deleteCard = async (req: Request<{ id: string }>, res: Response<SuccessResponse | ErrorResponse>) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted' });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};
