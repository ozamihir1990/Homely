import React, { useState, useEffect } from 'react';
import { Role } from './types';
import { ApiService } from './services/storage';
import { ClientDashboard } from './views/ClientDashboard';
import { WorkerDashboard } from './views/WorkerDashboard';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>(Role.NONE);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const initUser = async () => {
       const user = await ApiService.getUser();
       if (user) setCurrentRole(user.role);
    }
    initUser();
  }, []);

  const handleLogin = async (role: Role) => {
    setIsLoggingIn(true);
    try {
      await ApiService.login(role);
      setCurrentRole(role);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await ApiService.logout();
    setCurrentRole(Role.NONE);
  };

  // Landing Page / Login
  if (currentRole === Role.NONE) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
              Homely
            </h1>
            <p className="text-xl text-gray-600">
              The easiest way to find household help or find your next job.
              AI-powered matching and price estimation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               {/* Decorative elements only */}
               <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span> Active Jobs
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Instant Quotes
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Choose your path</h2>
            <div className="space-y-4">
              <Button 
                onClick={() => handleLogin(Role.CLIENT)}
                className="w-full group relative p-4 border-2 border-indigo-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left bg-white text-gray-900 shadow-none"
                disabled={isLoggingIn}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full text-indigo-600 group-hover:bg-white group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">I need help</h3>
                    <p className="text-sm text-gray-500">Book cleaners, plumbers, & more.</p>
                  </div>
                </div>
              </Button>

              <Button 
                onClick={() => handleLogin(Role.WORKER)}
                className="w-full group relative p-4 border-2 border-emerald-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left bg-white text-gray-900 shadow-none"
                disabled={isLoggingIn}
              >
                 <div className="flex items-center gap-4">
                  <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 group-hover:bg-white group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">I am a worker</h3>
                    <p className="text-sm text-gray-500">Find jobs and manage bookings.</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
               <div className={`p-1.5 rounded-lg ${currentRole === Role.CLIENT ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
               </div>
               <span className="font-bold text-xl tracking-tight text-gray-900">Homely</span>
               <span className="ml-2 px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                 {currentRole === Role.CLIENT ? 'Client App' : 'Worker App'}
               </span>
            </div>
            
            <button 
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main>
        {currentRole === Role.CLIENT ? <ClientDashboard /> : <WorkerDashboard />}
      </main>
    </div>
  );
};

export default App;