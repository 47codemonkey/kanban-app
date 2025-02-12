import { useSelector, useDispatch } from 'react-redux';
import { closeForm, setFormData } from '../../store/kanban/kanbanSlice';
import { addCard, updateCard, deleteCard } from '../../store/kanban/kanbanAsyncActions';
import { selectForm } from '../../store/kanban/kanbanSelectors';
import type { AppDispatch } from '../../store';
import { Card } from '../../types';
import { useCallback } from 'react';

export const useCardForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedColumn, editingCard, formData } = useSelector(selectForm);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ ...formData, title: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setFormData({ ...formData, description: e.target.value }));
  };

  const handleCloseForm = useCallback(() => {
    dispatch(closeForm());
  }, [dispatch]);

  const handleDeleteCard = useCallback(() => {
    if (!editingCard || !editingCard._id) return;
    dispatch(deleteCard(editingCard._id));
    dispatch(closeForm());
  }, [dispatch, editingCard]);

  const handleAddCard = useCallback(() => {
    if (!formData.title.trim() || !selectedColumn) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      title: formData.title,
      description: formData.description,
      status: selectedColumn ?? '',
      boardId,
    };

    dispatch(addCard(cardData));
    dispatch(closeForm());
  }, [dispatch, formData.title, formData.description, selectedColumn]);

  const handleUpdateCard = useCallback(() => {
    if (!formData.title.trim() || !selectedColumn || !editingCard) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      _id: editingCard._id,
      title: formData.title,
      description: formData.description,
      status: selectedColumn ?? '',
      boardId,
    };

    dispatch(updateCard(cardData));
    dispatch(closeForm());
  }, [dispatch, formData.title, formData.description, selectedColumn, editingCard]);

  const handleAddOrUpdateCard = () => {
    if (editingCard) {
      handleUpdateCard();
    } else {
      handleAddCard();
    }
  };

  return {
    handleCloseForm,
    handleAddOrUpdateCard,
    handleDeleteCard,
    editingCard,
    formData,
    handleTitleChange,
    handleDescriptionChange,
  };
};
