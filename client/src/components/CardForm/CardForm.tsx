import { useCardForm } from './useCardForm';

import './CardForm.css';

export const CardForm = () => {
  const {
    handleTitleChange,
    handleDescriptionChange,
    handleCloseForm,
    handleAddOrUpdateCard,
    handleDeleteCard,
    editingCard,
    formData,
  } = useCardForm();

  return (
    <div className="card-form">
      <h3>{editingCard ? 'Edit Card' : 'New Card'}</h3>
      <input type="text" placeholder="Title" value={formData.title} onChange={handleTitleChange} />
      <textarea placeholder="Description" value={formData.description} onChange={handleDescriptionChange} />
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
