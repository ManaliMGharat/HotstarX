import React from 'react';
import { Link } from 'react-router-dom';
import { PrimeXLogo } from '../brand/HotstarXLogo';
import { Tv, Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-cyan-500/15 bg-[#030712]/95 backdrop-blur-xl text-slate-400 select-none relative">
      {/* Ambient Depth Arc */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 via-violet-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info & Powered by XQORA */}
          <div className="col-span-2 space-y-4">
            <PrimeXLogo size="md" showTagline={true} />
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              PrimeX is the next-generation OTT streaming platform engineered for ultra-fast performance, immersive Dolby spatial audio, and cinematic storytelling without borders.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Dolby Vision • Dolby Atmos • 4K HDR</span>
              </div>
              <span className="hidden sm:inline text-slate-600">•</span>
              <div className="flex items-center gap-1.5 text-violet-400 font-mono text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Powered by XQORA Engine</span>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/movies" className="hover:text-cyan-400 transition-colors">Popular Movies</Link></li>
              <li><Link to="/series" className="hover:text-cyan-400 transition-colors">Top Series</Link></li>
              <li><Link to="/sports" className="hover:text-cyan-400 transition-colors">Live Sports & Tournaments</Link></li>
              <li><Link to="/live" className="hover:text-cyan-400 transition-colors">24/7 Live Broadcasts</Link></li>
              <li><Link to="/originals" className="hover:text-cyan-400 transition-colors">PrimeX Originals</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support & Info</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link to="/plans" className="hover:text-cyan-400 transition-colors">Subscription Plans</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Terms of Use</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Supported Devices</Link></li>
            </ul>
          </div>

          {/* Connected Apps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">PrimeX Ecosystem</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Android & iOS</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <Tv className="w-4 h-4 text-violet-400" />
                <span>Android TV & Apple TV</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>Web & Smart TV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Powered by XQORA */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {CURRENT_YEAR} PrimeX Media Network Inc. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400/90">
            <span>Powered by XQORA</span>
            <span>•</span>
            <span className="text-slate-400 font-sans">Your World of Entertainment.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
