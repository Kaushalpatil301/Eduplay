import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";

// Import Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import ParentDashboard from "./pages/ParentDashboard";
import KidDashboard from "./pages/KidDashboard";
import ActivitiesPage from "./pages/ActivitiesPage";
import PuzzlePage from "./pages/activities/PuzzlePage";
import QuizPage from "./pages/activities/QuizPage";
import StoryPage from "./pages/activities/StoryPage";
import DrawingPage from "./pages/activities/DrawingPage";
import MusicPage from "./pages/activities/MusicPage";
import RewardsPage from "./pages/RewardsPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match, redirect to home
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Wrapper for Kid routes with GameProvider
const KidRoute = ({ children }) => {
  return (
    <ProtectedRoute allowedRole="KID">
      <GameProvider>{children}</GameProvider>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Parent Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute allowedRole="PARENT">
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Kid Routes - All wrapped with GameProvider */}
          <Route
            path="/kid/dashboard"
            element={
              <KidRoute>
                <KidDashboard />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activities"
            element={
              <KidRoute>
                <ActivitiesPage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activity/puzzle"
            element={
              <KidRoute>
                <PuzzlePage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activity/quiz"
            element={
              <KidRoute>
                <QuizPage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activity/story"
            element={
              <KidRoute>
                <StoryPage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activity/drawing"
            element={
              <KidRoute>
                <DrawingPage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/activity/music"
            element={
              <KidRoute>
                <MusicPage />
              </KidRoute>
            }
          />

          <Route
            path="/kid/rewards"
            element={
              <KidRoute>
                <RewardsPage />
              </KidRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
