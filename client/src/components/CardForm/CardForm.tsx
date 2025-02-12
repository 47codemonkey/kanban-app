import { useDispatch } from 'react-redux';
import { useCardForm } from './useCardForm';
import type { AppDispatch } from '../../store';
import './CardForm.css';

export const CardForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { handleCloseForm, handleAddOrUpdateCard, handleDeleteCard, editingCard, formData, setFormData } =
    useCardForm();

  return (
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
        <button className="button button-primary" onClick={handleAddOrUpdateCard}>
          {editingCard ? 'Update' : 'Add'}
        </button>
        {editingCard && (
          <button className="button button-danger" onClick={handleDeleteCard}>
            Delete
          </button>
        )}
        <button className="button button-secondary" onClick={handleCloseForm}>
          Close
        </button>
      </div>
    </div>
  );
};
