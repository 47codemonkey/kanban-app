import { createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../api/config';
import { Card } from '../../types';

export const fetchCards = createAsyncThunk('kanban/fetchCards', async (boardId: string) => {
  const response = await fetch(`${API_URL}/api/cards?boardId=${boardId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Fetch error: ${response.status} - ${errorText}`);
  }
  const data = (await response.json()) as Card[];
  return data;
});

export const addCard = createAsyncThunk('kanban/addCard', async (card: Card) => {
  const response = await fetch(`${API_URL}/api/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Add card error: ${response.status} - ${errorText}`);
  }
  return (await response.json()) as Card;
});

export const updateCard = createAsyncThunk('kanban/updateCard', async (card: Card) => {
  const response = await fetch(`${API_URL}/api/cards/${card._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Update card error: ${response.status} - ${errorText}`);
  }
  return (await response.json()) as Card;
});

export const deleteCard = createAsyncThunk('kanban/deleteCard', async (cardId: string) => {
  const response = await fetch(`${API_URL}/api/cards/${cardId}`, { method: 'DELETE' });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Delete card error: ${response.status} - ${errorText}`);
  }
  return cardId;
});
