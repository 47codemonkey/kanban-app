import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeForm, setFormData } from '../../store/kanban/kanbanSlice';
import { addCard, updateCard, deleteCard } from '../../store/kanban/kanbanAsyncActions';
import { selectForm } from '../../store/kanban/kanbanSelectors';
import type { AppDispatch } from '../../store';
import { Card } from '../../types';

export const useCardForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedColumn, editingCard, formData } = useSelector(selectForm);

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = useCallback(() => {
    const newErrors: { title?: string; description?: string } = {};
    if (!formData.title.trim()) newErrors.title = 'Enter a title';
    if (!formData.description.trim()) newErrors.description = 'Enter a description';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.title, formData.description, setErrors]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ ...formData, title: e.target.value }));
    if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setFormData({ ...formData, description: e.target.value }));
    if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
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
    if (!validateForm()) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      title: formData.title,
      description: formData.description,
      status: selectedColumn ?? '',
      boardId,
    };

    dispatch(addCard(cardData));
    dispatch(closeForm());
  }, [dispatch, formData, selectedColumn, validateForm]);

  const handleUpdateCard = useCallback(() => {
    if (!validateForm()) return;

    const boardId = localStorage.getItem('boardId') || '';
    const cardData: Card = {
      _id: editingCard?._id || '',
      title: formData.title,
      description: formData.description,
      status: selectedColumn ?? '',
      boardId,
    };

    dispatch(updateCard(cardData));
    dispatch(closeForm());
  }, [dispatch, formData, selectedColumn, editingCard, validateForm]);

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
    errors,
  };
};
