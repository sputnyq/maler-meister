import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store';
import './style/index.css';

// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

const version = import.meta.env.PACKAGE_VERSION || '';

registerSW({
  onNeedRefresh() {
    alert(`Die Applikation wird aktualisiert! ${version}`);
  },
  onOfflineReady() {
    console.log('offline-ready');
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
);
