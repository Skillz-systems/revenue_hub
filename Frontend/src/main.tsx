import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { rootStore } from "./Stores/rootstore.js";
import { Provider } from "mobx-react";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./Context/DataContext.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider rootStore={rootStore}>
        <DataProvider>
          <App />
        </DataProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
