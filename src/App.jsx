// src/App.jsx
// App router with Checkout (/checkout), Support (/contact), FAQs, Help, and Legal.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderBar from "./components/HeaderBar.jsx";
import SiteFooter from "./components/SiteFooter.jsx";

import HomePage from "./pages/HomePage.jsx";
import NewPostPage from "./pages/NewPostPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SupportPage from "./pages/SupportPage.jsx";

// Help / FAQs
import HelpPage from "./pages/HelpPage.jsx";
import FaqsPage from "./pages/FaqsPage.jsx";

// Legal
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";
import CodeOfConductPage from "./pages/CodeOfConductPage.jsx";

// Section list pages
import QuestionsPage from "./pages/QuestionsPage.jsx";
import ArticlesPage from "./pages/ArticlesPage.jsx";
import TutorialsPage from "./pages/TutorialsPage.jsx";

// Detail pages
import QuestionDetailPage from "./pages/QuestionDetailPage.jsx";
import ArticleDetailPage from "./pages/ArticleDetailPage.jsx";
import TutorialDetailPage from "./pages/TutorialDetailPage.jsx";

// Global search
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

        {/* Detail routes */}
        <Route path="/questions/:id" element={<QuestionDetailPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/tutorials/:id" element={<TutorialDetailPage />} />

        {/* Global search */}
        <Route path="/search" element={<SearchPage />} />

        {/* Plans */}
        <Route path="/plans" element={<PlansPage />} />

        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Support / Contact */}
        <Route path="/contact" element={<SupportPage />} />

        {/* FAQs & Help */}
        <Route path="/faqs" element={<FaqsPage />} />
        <Route path="/help" element={<HelpPage />} />

        {/* Legal */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/code-of-conduct" element={<CodeOfConductPage />} />

        {/* Fallback → Home */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <SiteFooter />
    </BrowserRouter>
  );
}
