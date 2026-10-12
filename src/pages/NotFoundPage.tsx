import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import { HotstarXLogo } from '../components/brand/HotstarXLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <HotstarXLogo size="lg" clickable={false} />
      </div>

      <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 text-cyan-400">
        <Film className="w-10 h-10" />
      </div>

      <h1 className="text-4xl sm:text-6xl font-black font-['Outfit'] text-white tracking-tight mb-3">
        404
      </h1>

      <h2 className="text-xl font-bold text-slate-200 mb-2">Lost in the Stream?</h2>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The channel or show you requested is off the air or does not exist. Let's get you back to the home cinema.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
      >
        <Home className="w-4 h-4" />
        <span>Return to HotstarX Home</span>
      </Link>
    </div>
  );
};
