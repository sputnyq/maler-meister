import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store';
import './style/index.css';

// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

registerSW({
  immediate: true,
  onRegisterError: (error: any) => {
    console.log(error);
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
