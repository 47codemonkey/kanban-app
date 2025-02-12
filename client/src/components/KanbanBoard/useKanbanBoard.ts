import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCards, updateCard } from '../../store/kanban/kanbanAsyncActions';
import { openForm } from '../../store/kanban/kanbanSlice';
import { selectCards, selectForm } from '../../store/kanban/kanbanSelectors';
import type { AppDispatch } from '../../store';
import { Card } from '../../types';

export const useKanbanBoard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cards = useSelector(selectCards);
  const { selectedColumn } = useSelector(selectForm);

  useEffect(() => {
    let boardId = localStorage.getItem('boardId');

    if (!boardId) {
      boardId = 'board-' + Math.random().toString(36).slice(2, 9);
      localStorage.setItem('boardId', boardId);
    }

    dispatch(fetchCards(boardId));
  }, [dispatch]);

  const handleOpenForm = (column: string, card?: Card) => {
    dispatch(openForm({ column, card }));
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

  return { cards, selectedColumn, handleOpenForm, handleDragStart, handleDragOver, handleDrop, handleReorder };
};
