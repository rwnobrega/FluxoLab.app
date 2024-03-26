import React from "react";
import { createRoot } from "react-dom/client";

import App from "components/App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "reactflow/dist/style.css";

const container = document.createElement("div");
const root = createRoot(container);

root.render(<App />);

document.body.appendChild(container);
