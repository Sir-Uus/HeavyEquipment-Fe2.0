import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const queryClient = new QueryClient({});

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="661161141279-9sf309dovfscdfbgqld9u5gnloef6nl7.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <App />
      </StrictMode>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </GoogleOAuthProvider>
);
