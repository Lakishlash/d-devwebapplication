// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NewPostPage from "./pages/NewPostPage";
import { ROUTES } from "./config/routes"; // HOME & NEW_POST

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path={ROUTES.HOME} element={<HomePage />} />

        {/* New Post (modal on top of the homepage) */}
        <Route
          path={ROUTES.NEW_POST}
          element={
            <>
              <HomePage />
              <NewPostPage />
            </>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
