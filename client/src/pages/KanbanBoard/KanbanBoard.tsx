import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCards,
  addCard,
  updateCard,
  deleteCard,
  openForm,
  closeForm,
  setFormData,
} from '../../store/kanban/kanbanSlice';
import { selectCards, selectForm } from '../../store/kanban/kanbanSelectors';
import { Card } from '../../types';

import type { AppDispatch } from '../../store';
import './KanbanBoard.css';

export const KanbanBoard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cards = useSelector(selectCards);
  const { selectedColumn, editingCard, formData } = useSelector(selectForm);

  const [inputBoardId, setInputBoardId] = useState('');

  useEffect(() => {
    let boardId = localStorage.getItem('boardId');

    if (!boardId) {
      boardId = 'board-' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('boardId', boardId);
    }

    dispatch(fetchCards(boardId));
  }, [dispatch]);

  const handleLoadBoard = () => {
    if (!inputBoardId.trim()) return;
    localStorage.setItem('boardId', inputBoardId);
    dispatch(fetchCards(inputBoardId));
  };

  const handleOpenForm = (column: string, card?: Card) => {
    dispatch(openForm({ column, card }));
  };

  const handleCloseForm = () => {
    dispatch(closeForm());
  };

  const handleAddCard = () => {
    if (!formData.title.trim() || !selectedColumn) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      title: formData.title,
      description: formData.description,
      status: selectedColumn,
      boardId,
    };

    dispatch(addCard(cardData));
    dispatch(closeForm());
  };

  const handleUpdateCard = () => {
    if (!formData.title.trim() || !selectedColumn || !editingCard) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      _id: editingCard._id,
      title: formData.title,
      description: formData.description,
      status: selectedColumn,
      boardId,
    };

    dispatch(updateCard(cardData));
    dispatch(closeForm());
  };

  const handleDeleteCard = () => {
    if (!editingCard || !editingCard._id) return;
    dispatch(deleteCard(editingCard._id));
    dispatch(closeForm());
  };

  const handleAddOrUpdateCard = () => {
    if (editingCard) {
      handleUpdateCard();
    } else {
      handleAddCard();
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, card: Card, column: string) => {
    event.dataTransfer.setData('card', JSON.stringify({ ...card, column }));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, newColumn: string) => {
    event.preventDefault();
    const droppedCard = JSON.parse(event.dataTransfer.getData('card')) as Card;
    if (droppedCard.status === newColumn) return;

    const boardId = localStorage.getItem('boardId') || '';
    const updatedCard: Card = { ...droppedCard, status: newColumn, boardId };
    dispatch(updateCard(updatedCard));
  };

  const handleReorder = (event: React.DragEvent<HTMLDivElement>, targetCard: Card | null, column: string) => {
    event.preventDefault();
    const droppedCard = JSON.parse(event.dataTransfer.getData('card')) as Card;
    if (droppedCard.status !== column) return;

    const reorderedCards = [...cards[column]].filter((c) => c._id !== droppedCard._id);

    const boundingRect = event.currentTarget.getBoundingClientRect();
    const mouseY = event.clientY - boundingRect.top;
    const totalHeight = boundingRect.height;

    if (!targetCard) {
      const isTop = mouseY < totalHeight / 3;
      if (isTop) {
        reorderedCards.unshift(droppedCard);
      } else {
        reorderedCards.push(droppedCard);
      }
    } else {
      const targetIndex = reorderedCards.findIndex((c) => c._id === targetCard._id);
      if (targetIndex !== -1) {
        const position = mouseY < boundingRect.height / 2 ? targetIndex : targetIndex + 1;
        reorderedCards.splice(position, 0, droppedCard);
      }
    }

    const boardId = localStorage.getItem('boardId') || '';
    reorderedCards.forEach((card, index) => {
      dispatch(updateCard({ ...card, status: column, order: index, boardId }));
    });
  };

  return (
    <div className="kanban-wrapper">
      <div className="load-board-container">
        <input
          type="text"
          className="load-board-input"
          placeholder="Enter board ID..."
          value={inputBoardId}
          onChange={(e) => setInputBoardId(e.target.value)}
        />
        <button className="load-board-button" onClick={handleLoadBoard}>
          Load
        </button>
      </div>

      <div className="kanban-board">
        {Object.keys(cards).map((column) => (
          <div
            key={column}
            className="column"
            onClick={() => handleOpenForm(column)}
            onDragOver={handleDragOver}
            onDrop={(event) => handleDrop(event, column)}
          >
            <h3>{column}</h3>
            <div className="cards">
              {cards[column].map((card) => (
                <div
                  key={card._id}
                  className="card"
                  draggable
                  onDragStart={(event) => handleDragStart(event, card, column)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleReorder(event, card, column)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenForm(column, card);
                  }}
                >
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {selectedColumn && (
          <div className="card-form">
            <h3>{editingCard ? 'Edit Card' : 'New Card'}</h3>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => dispatch(setFormData({ ...formData, title: e.target.value }))}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => dispatch(setFormData({ ...formData, description: e.target.value }))}
            />
            <div className="buttons">
              <button onClick={handleAddOrUpdateCard}>{editingCard ? 'Update' : 'Add'}</button>
              {editingCard && <button onClick={handleDeleteCard}>Delete</button>}
              <button onClick={handleCloseForm}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
