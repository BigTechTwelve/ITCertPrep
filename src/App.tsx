import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './lib/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import GuildsPage from './pages/GuildsPage';
import GuildDetails from './pages/GuildDetails';
import ProtectedRoute from './components/ProtectedRoute';

import ClassDetails from './components/dashboard/ClassDetails';
import FlashcardPage from './pages/FlashcardPage';
import LeaderboardPage from './pages/LeaderboardPage';
import CertificationsPage from './pages/CertificationsPage';
import CertificationDetails from './pages/CertificationDetails';

import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/guilds" element={<GuildsPage />} />
                <Route path="/guilds/:guildId" element={<GuildDetails />} />
                <Route path="/class/:classId" element={<ClassDetails />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />

                <Route path="/certifications" element={<CertificationsPage />} />
                <Route path="/certification/:certId" element={<CertificationDetails />} />

                <Route path="/quiz/q/:quizId" element={<QuizPage />} />
                <Route path="/quiz/:certificationId" element={<QuizPage />} />
                <Route path="/flashcards" element={<FlashcardPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
