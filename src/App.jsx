// src/App.jsx
// App router: lists + detail routes for Articles, Tutorials, Questions,
// plus Home, New Post, Plans, and Global Search.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

import HomePage from "./pages/HomePage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";

// Section list pages
import QuestionsPage from "./pages/QuestionsPage.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import TutorialsPage from "./pages/TutorialsPage.jsx";

// Detail pages (ensure these filenames match your project)
import QuestionDetailPage from "./pages/QuestionDetailPage.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";
import TutorialDetailPage from "./pages/TutorialDetailPage.jsx";

// Global search page
import SearchPage from "./pages/SearchPage.jsx";

import RequireAuth from "./routes/RequireAuth.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderBar />
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* New Post (protected) */}
        <Route
          path="/post/new"
          element={
            <RequireAuth>
              <NewPostPage />
            </RequireAuth>
          }
        />

        {/* Sections (lists) */}
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />

        {/* Detail routes (fixes Learn more / View / Edit navigation) */}
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/tutorials/:id" element={<TutorialDetailPage />} />

        {/* Global search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Plans */}
        <Route path="/plans" element={<PlansPage />} />

        {/* Fallback → Home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}
