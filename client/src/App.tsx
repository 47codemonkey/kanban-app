import { store } from './store';
import { Provider } from 'react-redux';

import { KanbanBoard } from './pages/KanbanBoard/KanbanBoard';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <KanbanBoard />
      </div>
    </Provider>
  );
}

export default App;
