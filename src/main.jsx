import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import AuthInitializer from "./components/Auth/AuthInitializer.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <App />
        <Toaster position="bottom-center" />
      </AuthInitializer>
    </Provider>
  </StrictMode>
);
