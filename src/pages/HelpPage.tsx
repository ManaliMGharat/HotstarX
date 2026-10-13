import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Server,
  Activity,
  Shield,
  CreditCard
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FAQItem {
  id: string;
  topic: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-4k',
    topic: '4K requirements',
    question: 'What are the 4K Ultra HD streaming requirements?',
    answer: 'To stream in 4K Ultra HD on PrimeX, you need a Max Ultra active subscription plan, an Ultra HD-compatible display (TV or monitor with HDCP 2.2 support), and a stable internet connection with continuous download speeds of 25 Mbps or higher.'
  },
  {
    id: 'faq-dolby',
    topic: 'Dolby Atmos',
    question: 'How do I enable Dolby Atmos spatial audio?',
    answer: 'Dolby Atmos is enabled automatically when playing supported titles on audio systems equipped with Dolby Atmos (such as compatible AV receivers, soundbars, or Apple AirPods spatial audio). Ensure "Surround 5.1/Atmos" is selected in your system sound output settings.'
  },
  {
    id: 'faq-tvs',
    topic: 'Supported Smart TVs',
    question: 'Which Smart TVs and streaming devices are supported?',
    answer: 'PrimeX is certified on Android TV (v9+), Google TV, Apple TV 4K (tvOS 15+), LG Smart TVs with webOS (2020 and later), Samsung TVs with Tizen OS (2020 and later), and Amazon Fire TV Stick 4K Max.'
  },
  {
    id: 'faq-latency',
    topic: 'Live sports latency',
    question: 'How do I minimize live sports broadcast latency?',
    answer: 'Our Ultra-Low Latency streaming engine delivers live feeds within 1.5 to 3 seconds of the on-field stadium action. For optimal latency, connect your streaming device via Ethernet cable or 5GHz Wi-Fi and set Streaming Quality to "Auto".'
  },
  {
    id: 'faq-downloads',
    topic: 'Offline downloads',
    question: 'How do offline downloads work?',
    answer: 'Titles displaying the download icon can be saved locally on your iOS or Android mobile device. Downloaded content remains playable offline for up to 30 days or 48 hours after you begin watching.'
  },
  {
    id: 'faq-account',
    topic: 'Account problems',
    question: 'How do I resolve account login or profile problems?',
    answer: 'If you encounter issues accessing your profile, navigate to the Sign In modal and log in with your registered email and password. You can also switch between Personal and Kids profiles anytime from the profile avatar menu.'
  },
  {
    id: 'faq-subscription',
    topic: 'Subscription',
    question: 'How does billing and plan cancellation work?',
    answer: 'PrimeX subscriptions are billed on a recurring monthly or annual basis. You can upgrade, downgrade, or cancel auto-renewal anytime in the Plans section without cancellation fees. Annual plans include a built-in 20% discount.'
  },
  {
    id: 'faq-playback',
    topic: 'Playback problems',
    question: 'What should I do if a stream buffers or shows a black screen?',
    answer: 'First, clear your browser cache and refresh the video player. In your player settings, adjust Video Quality from "Auto" to "1080p" or "720p". If issues persist, check our System Status panel below to ensure your regional CDN node is running smoothly.'
  }
];

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>('faq-4k');
  
  // Support Form State
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Playback problems');
  const [ticketDescription, setTicketDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesTopic = selectedTopic === 'all' || faq.topic === selectedTopic;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesQuery;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName.trim() || !ticketEmail.trim() || !ticketDescription.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setTicketName('');
      setTicketEmail('');
      setTicketDescription('');
      showToast({
        title: 'Support Ticket Submitted',
        description: `Thank you, ${ticketName}. Ticket #${Math.floor(100000 + Math.random() * 900000)} created. Concierge team will reply to ${ticketEmail}.`,
        type: 'success',
      });
    }, 750);
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>PrimeX Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-white tracking-tight">
            How can we assist you?
          </h1>

          <p className="text-sm text-slate-300">
            Find immediate answers on 4K streaming, Dolby Atmos, Smart TVs, latency, and subscription management.
          </p>

          {/* Search Input */}
          <div className="relative max-w-lg mx-auto mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 4K requirements, Dolby Atmos, latency..."
              className="w-full bg-[#070e1c] text-white pl-12 pr-4 py-3.5 rounded-2xl border border-white/10 focus:outline-none focus:border-cyan-400 shadow-inner text-sm"
            />
          </div>
        </div>

        {/* System Status Panel (Fictional Demo Status Information) */}
        <div className="mb-10 rounded-2xl bg-[#070e1c] border border-white/10 p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>PrimeX System Status Panel (Live Demo)</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#050B14] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Server className="w-3.5 h-3.5 text-[#00C2FF]" />
                <span>CDN Status</span>
              </div>
              <p className="text-white font-bold">Operational (12ms)</p>
            </div>

            <div className="p-3 rounded-xl bg-[#050B14] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Streaming Status</span>
              </div>
              <p className="text-white font-bold">4K UHD Active</p>
            </div>

            <div className="p-3 rounded-xl bg-[#050B14] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Shield className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>Authentication</span>
              </div>
              <p className="text-white font-bold">Operational</p>
            </div>

            <div className="p-3 rounded-xl bg-[#050B14] border border-white/5 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Payments Status</span>
              </div>
              <p className="text-white font-bold">Sandbox Ready</p>
            </div>
          </div>
        </div>

        {/* Topic Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
          <button
            onClick={() => setSelectedTopic('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedTopic === 'all'
                ? 'bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white shadow-lg'
                : 'bg-[#0B1422] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            All Topics
          </button>
          {FAQS.map((faq) => (
            <button
              key={faq.id}
              onClick={() => setSelectedTopic(faq.topic)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedTopic === faq.topic
                  ? 'bg-gradient-to-r from-[#00C2FF] to-[#6366F1] text-white shadow-lg'
                  : 'bg-[#0B1422] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {faq.topic}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-14">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-[#0B1422] rounded-2xl border border-white/5">
              <p className="text-sm">No matching topics found for "{searchQuery}".</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#0B1422] border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-white hover:text-[#00C2FF] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#00C2FF] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Ticket Form */}
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1422] to-[#111e33] border border-white/10 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[#00C2FF] text-xs font-bold uppercase tracking-wider mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Still Need Assistance?</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white mb-2">
            Submit a Support Ticket
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Fill out the form below and our customer engineering desk will get back to you immediately.
          </p>

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full bg-[#050B14] text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={ticketEmail}
                  onChange={(e) => setTicketEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#050B14] text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Category</label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full bg-[#050B14] text-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF]"
              >
                <option value="4K requirements">4K Requirements & Display</option>
                <option value="Dolby Atmos">Dolby Atmos Audio</option>
                <option value="Supported Smart TVs">Smart TV Compatibility</option>
                <option value="Live sports latency">Live Sports Latency</option>
                <option value="Offline downloads">Offline Downloads</option>
                <option value="Account problems">Account & Profile Problems</option>
                <option value="Subscription">Subscription & Billing</option>
                <option value="Playback problems">Playback & Buffering Problems</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Describe your issue or inquiry in detail..."
                className="w-full bg-[#050B14] text-white text-xs sm:text-sm p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#00C2FF] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00C2FF] via-[#6366F1] to-[#A855F7] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-[#00C2FF]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
