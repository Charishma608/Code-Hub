import React from "react";

import "./index.css";
import App from "./App";

import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { SnippetsPage } from "./Page";
import axios from "axios"; // Add this line

axios.defaults.baseURL = "http://localhost:5000"; // Add this line

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "about",
    element: <div>About</div>,
  },
  {
    path: "snippets",
    element: <SnippetsPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root")
);
