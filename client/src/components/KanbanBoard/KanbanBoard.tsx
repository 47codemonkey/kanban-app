import { CardForm } from '../CardForm/CardForm';
import { LoadBoard } from '../LoadBoard/LoadBoard';
import { useKanbanBoard } from './useKanbanBoard';

import './KanbanBoard.css';

export const KanbanBoard: React.FC = () => {
  const { cards, selectedColumn, handleOpenForm, handleDragStart, handleDragOver, handleDrop, handleReorder } =
    useKanbanBoard();

  return (
    <div className="kanban-wrapper">
      <LoadBoard />
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
        {selectedColumn && <CardForm />}
      </div>
    </div>
  );
};
