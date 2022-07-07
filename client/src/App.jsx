import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { toast } from 'react-toastify';
import '@/styles/main.scss';
import AppRoutes from './routes';
import store from './redux/store';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

function App() {
  return (
    <Provider store={store}>
      <Router>
        <main className='h-100'>
          <AppRoutes />
        </main>
      </Router>
    </Provider>
  );
}

export default App;
