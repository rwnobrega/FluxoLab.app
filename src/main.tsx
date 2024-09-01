import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "reactflow/dist/style.css";

import App from "~/components/App";

const container = document.createElement("div");
const root = createRoot(container);

root.render(<App />);

document.body.appendChild(container);
