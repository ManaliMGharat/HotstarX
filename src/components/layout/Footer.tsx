import React from 'react';
import { Link } from 'react-router-dom';
import { HotstarXLogo } from '../brand/HotstarXLogo';
import { Tv, Smartphone, Monitor, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-orange-500/15 bg-[#0c0517]/90 backdrop-blur-xl text-stone-400 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <HotstarXLogo size="md" showTagline={true} />
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              HotstarX is the next-generation OTT streaming platform engineered for ultra-fast performance, immersive cinematic audio, and original storytelling without borders.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Dolby Vision • Dolby Atmos • 4K HDR Certified</span>
            </div>
          </div>

          {/* Explore Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/movies" className="hover:text-[#FF5E3A] transition-colors">Popular Movies</Link></li>
              <li><Link to="/series" className="hover:text-[#FF5E3A] transition-colors">Top Series</Link></li>
              <li><Link to="/sports" className="hover:text-[#FF5E3A] transition-colors">Live Sports & Tournaments</Link></li>
              <li><Link to="/live" className="hover:text-[#FF5E3A] transition-colors">24/7 Live Broadcasts</Link></li>
              <li><Link to="/originals" className="hover:text-[#FF5E3A] transition-colors">HotstarX Originals</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#help" className="hover:text-[#FF5E3A] transition-colors">Help Center</a></li>
              <li><Link to="/plans" className="hover:text-[#FF5E3A] transition-colors">Subscription Plans</Link></li>
              <li><a href="#terms" className="hover:text-[#FF5E3A] transition-colors">Terms of Use</a></li>
              <li><a href="#privacy" className="hover:text-[#FF5E3A] transition-colors">Privacy Policy</a></li>
              <li><a href="#faq" className="hover:text-[#FF5E3A] transition-colors">Supported Devices</a></li>
            </ul>
          </div>

          {/* Connected Apps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">HotstarX Apps</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-stone-300">
                <Smartphone className="w-4 h-4 text-[#FF5E3A]" />
                <span>Android & iOS</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-stone-300">
                <Tv className="w-4 h-4 text-[#C026D3]" />
                <span>Android TV & Apple TV</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-stone-300">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>Web & Smart TV</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HotstarX Media Network Inc. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with cinematic precision</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
