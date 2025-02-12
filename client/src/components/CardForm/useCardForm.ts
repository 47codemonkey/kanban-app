import { useSelector, useDispatch } from 'react-redux';
import { closeForm, setFormData } from '../../store/kanban/kanbanSlice';
import { addCard, updateCard, deleteCard } from '../../store/kanban/kanbanAsyncActions';
import { selectForm } from '../../store/kanban/kanbanSelectors';
import type { AppDispatch } from '../../store';
import { Card } from '../../types';

export const useCardForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedColumn, editingCard, formData } = useSelector(selectForm);

  const handleCloseForm = () => {
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

  return { handleCloseForm, handleAddOrUpdateCard, handleDeleteCard, editingCard, formData, setFormData };
};
