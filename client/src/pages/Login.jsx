import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authService } from '../services/api';
import { GraduationCap, ArrowRight } from 'lucide-react';

const Login = () => {
  const [searchParams] = useSearchParams();

  // This handles the "Redirect" from Google
  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId) {
      localStorage.setItem('studyflowz_user_id', userId);
      window.location.href = '/dashboard';
    }
  }, [searchParams]);

  const handleLogin = () => {
    authService.login(); // Redirects to your Backend -> Google
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      
      {/* Hero Icon */}
      <div className="bg-blue-100 p-6 rounded-full mb-8 animate-bounce-slow">
        <GraduationCap size={64} className="text-primary" />
      </div>

      {/* Headlines */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6">
        Your AI <span className="text-primary">Study Partner</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Connect your Google Classroom and let our AI Agent help you solve assignments, 
        understand complex topics, and stay organized.
      </p>

      {/* Call to Action */}
      <button 
        onClick={handleLogin}
        className="group bg-primary hover:bg-blue-700 text-white text-xl font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
      >
        Get Started with Google
        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Feature Pills */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm font-medium text-slate-500">
        <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-100">
          🤖 AI Solver Agent
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-100">
          🔒 Private & Secure
        </div>
        <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-slate-100">
          📚 Google Classroom Sync
        </div>
      </div>
    </div>
  );
};

export default Login;
