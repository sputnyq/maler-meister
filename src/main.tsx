import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { IntlProvider } from "react-intl";

import de from "./translations/de.json";
import ru from "./translations/ru.json";

const messages = {
  de,
  ru,
};
type SupportedLanguages = "de" | "ru";

const language = navigator.language.split(/[-_]/)[0] as SupportedLanguages;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider
      locale={navigator.language}
      defaultLocale="de"
      messages={messages[language]}
    >
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </IntlProvider>
  </React.StrictMode>
);
