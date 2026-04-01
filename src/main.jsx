import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./Auth/Auth-Context";
import { CustomerAuthProvider } from "./Auth/Customer-Auth-Context";

ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <CustomerAuthProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CustomerAuthProvider>
    </AuthProvider>
);
