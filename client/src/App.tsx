import { store } from './store';
import { Provider } from 'react-redux';
import { HomePage } from './pages/Home/HomePage';

import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <HomePage />
      </div>
    </Provider>
  );
}

export default App;
