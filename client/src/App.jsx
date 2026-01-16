import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourseView from './pages/CourseView';
import AssignmentSolver from './pages/AssignmentSolver';

function App() {
  // Simple check to see if user is logged in (we stored this in api.js logic)
  const isAuthenticated = !!localStorage.getItem('studyflowz_user_id');

  return (
    <Router>
      <div className="min-h-screen bg-background text-secondary font-sans">
        {/* Simple Navigation Bar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            📚 Studyflowz
          </h1>
          {isAuthenticated && (
            <button 
              onClick={() => {
                localStorage.removeItem('studyflowz_user_id');
                window.location.href = '/';
              }}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Logout
            </button>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/course/:courseId" element={isAuthenticated ? <CourseView /> : <Navigate to="/" />} />
            <Route path="/work/:courseId/:assignmentId" element={isAuthenticated ? <AssignmentSolver /> : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
