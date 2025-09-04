// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import HomePage from "./pages/HomePage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/post/new"
          element={
            <RequireAuth>
              <NewPostPage />
            </RequireAuth>
          }
        />
        <Route path="/plans" element={<PlansPage />} />
        {/* fallback */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}
