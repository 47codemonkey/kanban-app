import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Card, CardsState, FormState, FormData } from '../../types';

interface KanbanState {
  cards: CardsState;
  form: FormState;
}

const initialState: KanbanState = {
  cards: {
    'To Do': [],
    'In Progress': [],
    Done: [],
  },
  form: {
    selectedColumn: null,
    editingCard: null,
    formData: { title: '', description: '' },
  },
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    openForm: (state, action: PayloadAction<{ column: string; card?: Card }>) => {
      const { column, card } = action.payload;
      state.form.selectedColumn = column;
      if (card) {
        state.form.editingCard = card;
        state.form.formData = { title: card.title, description: card.description };
      } else {
        state.form.editingCard = null;
        state.form.formData = { title: '', description: '' };
      }
    },
    closeForm: (state) => {
      state.form.selectedColumn = null;
      state.form.editingCard = null;
    },
    setFormData: (state, action: PayloadAction<FormData>) => {
      state.form.formData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCards.fulfilled, (state, action) => {
      state.cards['To Do'] = [];
      state.cards['In Progress'] = [];
      state.cards.Done = [];
      action.payload.forEach((card) => {
        if (card.status in state.cards) {
          state.cards[card.status].push(card);
        }
      });
    });

    builder.addCase(addCard.fulfilled, (state, action) => {
      const newCard = action.payload;
      if (newCard.status in state.cards) {
        state.cards[newCard.status].push(newCard);
      }
    });

    builder.addCase(updateCard.fulfilled, (state, action) => {
      const updatedCard = action.payload;

      Object.keys(state.cards).forEach((column) => {
        state.cards[column] = state.cards[column].filter((card) => card._id !== updatedCard._id);
      });

      if (updatedCard.status in state.cards) {
        state.cards[updatedCard.status].push(updatedCard);
      }
    });

    builder.addCase(deleteCard.fulfilled, (state, action) => {
      const cardId = action.payload;
      Object.keys(state.cards).forEach((column) => {
        state.cards[column] = state.cards[column].filter((card) => card._id !== cardId);
      });
    });
  },
});

export const { openForm, closeForm, setFormData } = kanbanSlice.actions;
export default kanbanSlice.reducer;
