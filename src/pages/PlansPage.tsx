import React, { useState } from 'react';
import { Check, Crown, AlertTriangle, ArrowRight } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/plans';
import type { SubscriptionPlan } from '../types';

import { useAuth } from '../context/AuthContext';
import { PlanCheckoutModal } from '../components/plans/PlanCheckoutModal';

export const PlansPage: React.FC = () => {
  const { currentProfile, isAuthenticated, openAuthModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      openAuthModal('signup');
      return;
    }
    setSelectedPlanForCheckout(plan);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold border border-cyan-500/20">
            <Crown className="w-3.5 h-3.5" />
            <span>HotstarX VIP Pass</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight">
            Flexible Plans for Every Screen
          </h1>

          <p className="text-sm text-slate-300">
            Stream all blockbuster movies, original series, and live sporting tournaments in uncompromised 4K Ultra HD and Dolby Atmos.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-[#0a1829] p-1.5 rounded-2xl border border-white/10 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>

              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-black text-[10px] font-black uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-[#0e2038]/80 border border-cyan-500/30 flex items-center gap-3 text-xs text-slate-300 max-w-3xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-white">Interactive Sandbox Environment: </span>
            <span>You can test-drive plan upgrades below. Upgrading changes your active streaming privileges instantly in localStorage.</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            const isCurrentPlan = currentProfile ? currentProfile.plan.toLowerCase() === plan.name.toLowerCase().split(' ')[0] : false;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-[#0e2440] to-[#071324] border-2 border-cyan-400 shadow-[0_15px_40px_rgba(0,210,255,0.2)] md:-translate-y-2'
                    : 'bg-[#0a1829] border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-[11px] font-black uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black font-['Outfit'] text-white">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-6 min-h-[32px]">
                    {plan.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-['Outfit'] text-white">₹{price}</span>
                      <span className="text-xs text-slate-400">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <span className="text-[11px] text-emerald-400 font-medium mt-1 block">
                        Equivalent to ₹{Math.round(price / 12)}/month
                      </span>
                    )}
                  </div>

                  {/* Features list */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Plan Benefits
                    </span>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                    isCurrentPlan
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-400/30 hover:scale-[1.02]'
                      : 'bg-white text-black hover:bg-cyan-300 hover:scale-[1.02]'
                  }`}
                >
                  <span>{isCurrentPlan ? 'Switch Billing Cycle' : isAuthenticated ? `Choose ${plan.name}` : `Sign In to Choose ${plan.name}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="rounded-3xl bg-[#0a1829] border border-white/10 p-6 sm:p-8 overflow-x-auto">
          <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white mb-6">
            Detailed Comparison
          </h3>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400">
                <th className="pb-4 font-semibold">Features & Privileges</th>
                <th className="pb-4 font-semibold text-center">Mobile</th>
                <th className="pb-4 font-semibold text-center text-cyan-400">Standard</th>
                <th className="pb-4 font-semibold text-center text-indigo-400">Max Ultra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              <tr>
                <td className="py-3.5 text-slate-400">Maximum Video Resolution</td>
                <td className="py-3.5 text-center font-mono">720p HD</td>
                <td className="py-3.5 text-center font-mono">1080p FHD</td>
                <td className="py-3.5 text-center font-mono text-cyan-300 font-bold">4K Ultra HD + HDR</td>
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400">Simultaneous Screens</td>
                <td className="py-3.5 text-center font-mono">1</td>
                <td className="py-3.5 text-center font-mono">2</td>
                <td className="py-3.5 text-center font-mono text-cyan-300 font-bold">4</td>
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400">Audio Quality</td>
                <td className="py-3.5 text-center">Stereo 2.0</td>
                <td className="py-3.5 text-center">Dolby 5.1</td>
                <td className="py-3.5 text-center text-cyan-300 font-semibold">Dolby Atmos Spatial</td>
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400">Supported Devices</td>
                <td className="py-3.5 text-center">Phone, Tablet</td>
                <td className="py-3.5 text-center">TV, Laptop, Phone</td>
                <td className="py-3.5 text-center text-cyan-300 font-semibold">All Devices</td>
              </tr>
              <tr>
                <td className="py-3.5 text-slate-400">Live Sports Ad-Free Experience</td>
                <td className="py-3.5 text-center text-slate-500">—</td>
                <td className="py-3.5 text-center text-slate-500">—</td>
                <td className="py-3.5 text-center text-cyan-300 font-semibold">Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Modal */}
      <PlanCheckoutModal
        plan={selectedPlanForCheckout}
        billingCycle={billingCycle}
        isOpen={!!selectedPlanForCheckout}
        onClose={() => setSelectedPlanForCheckout(null)}
      />
    </div>
  );
};
