"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Mic, Volume2, ThumbsUp, ThumbsDown, Grid3x3, UserPlus, LogIn, BrainCircuit, Sparkles, ShoppingCart, HeartHandshake, AreaChart } from 'lucide-react';

// --- CHATBOT DATA & COMPONENTS ---

const chatFAQ = {
  "What is AI Universe Global?": "AI Universe Global is a pioneering technology firm engineering a smarter future. We build intelligent ecosystems that seamlessly integrate with daily life, focusing on next-generation commerce, holistic family well-being, and predictive system intelligence.",
  "Tell me about the AI Family Universe.": "The AI Family Universe is a revolutionary connected platform for modern families. It harmonizes education, wellness, and creative engagement, offering real-time insights to empower the holistic development of children like our digital companions, Janvi and Gagan.",
  "How does AI eCommerce Universe work?": "Our AI eCommerce Universe redefines retail by infusing it with deep intelligence. The platform automates complex billing, optimizes hyperlocal logistics, and delivers truly personalized shopping journeys, creating a frictionless experience for both businesses and consumers.",
  "What is AI Intelligence Universe?": "The AI Intelligence Universe is our advanced platform providing a real-time, machine learning-powered pulse on complex digital systems. It moves beyond reactive monitoring to offer predictive insights, ensuring peak performance and operational stability.",
  "When is the official launch?": "We are on the brink of a major reveal! The countdown on our site marks a significant milestone on our journey to launch. Stay tuned for an exciting announcement.",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ id: 1, sender: 'bot', text: 'Hello! How can I help you today? Ask me a question or choose from the suggestions.' }]);
  const [inputValue, setInputValue] = useState('');
  const chatBoxRef = useRef(null);

  const suggestedQuestions = Object.keys(chatFAQ).filter(q => !messages.some(msg => msg.userQuestion === q));

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputValue(speechToText);
      // Automatically send after successful recognition
      const matchedQuestion = Object.keys(chatFAQ).find(q => q.toLowerCase().includes(speechToText.toLowerCase()));
      if (matchedQuestion) {
        handleSend(matchedQuestion);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleSpeakerClick = (text) => {
    if (!window.speechSynthesis) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }
    // Stop any currently speaking utterance
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    // Find and set a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // The voices might load asynchronously, so we handle that.
    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => handleSpeakerClick(text);
    } else {
        window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = (question) => {
    if (!question.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: question };
    const botResponseText = chatFAQ[question] || "I'm sorry, I don't have an answer for that yet. We are still in development.";
    const botResponse = { id: Date.now() + 1, sender: 'bot', text: botResponseText, userQuestion: question };
    
    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputValue('');
  };

  const autocompleteQuestions = Object.keys(chatFAQ).filter(q => q.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white shadow-lg"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-8 z-40 w-full max-w-sm rounded-lg border border-zinc-200 bg-white/80 shadow-2xl backdrop-blur-lg"
          >
            <div className="flex h-[500px] flex-col">
              <div className="border-b border-zinc-200 p-4">
                <h3 className="font-semibold text-zinc-800">AI Universe Assistant</h3>
              </div>
              <div ref={chatBoxRef} className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((msg, index) => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`group relative max-w-xs rounded-lg px-3 py-2 text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-zinc-200 text-zinc-800'}`}>
                      <p>{msg.text}</p>
                      {msg.sender === 'bot' && (
                        <div className="absolute -bottom-2 right-0 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleSpeakerClick(msg.text)} className="p-1 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white"><Volume2 size={12} className="text-zinc-600" /></button>
                           <button className="p-1 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white"><ThumbsUp size={12} className="text-green-600" /></button>
                           <button className="p-1 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white"><ThumbsDown size={12} className="text-red-600" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-200 p-4">
                {inputValue === '' && suggestedQuestions.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {suggestedQuestions.slice(0, 2).map(q => (
                      <button key={q} onClick={() => handleSend(q)} className="rounded-full border border-blue-400 px-3 py-1 text-xs text-blue-600 hover:bg-blue-50">
                        {q}
                      </button>
                    ))}
                  </div>
                )}
                {inputValue !== '' && (
                  <div className="mb-2 max-h-20 overflow-y-auto">
                    {autocompleteQuestions.map(q => (
                       <button key={q} onClick={() => handleSend(q)} className="block w-full rounded p-1 text-left text-sm text-zinc-600 hover:bg-zinc-100">
                         {q}
                       </button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question..."
                    className="w-full rounded-full border border-zinc-300 bg-transparent px-4 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && inputValue && autocompleteQuestions.length > 0 && handleSend(autocompleteQuestions[0])}
                  />
                  <button onClick={handleMicClick} className="text-zinc-500 hover:text-blue-500"><Mic size={18} /></button>
                  <button onClick={() => inputValue && autocompleteQuestions.length > 0 && handleSend(autocompleteQuestions[0])} className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600"><Send size={18} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- UNIVERSE SECTIONS ---

const UniverseSection = ({ id, title, description, children, gradient }) => (
  <section id={id} className="min-h-screen w-full py-20 px-4 md:px-8 flex items-center">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      <div className="text-center md:text-left">
        <h2 className={`text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent ${gradient}`}>
          {title}
        </h2>
        <p className="mt-4 text-lg text-zinc-600">{description}</p>
      </div>
      <div className="flex justify-center items-center">
        {children}
      </div>
    </motion.div>
  </section>
);

const ProductPillar = ({ id, title, description, gradient, onClick }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
    className="cursor-pointer rounded-xl border border-zinc-200 bg-white/50 p-6 text-left"
    onClick={() => onClick(id)}
  >
    <h3 className={`text-xl font-bold bg-clip-text text-transparent ${gradient}`}>{title}</h3>
    <p className="mt-2 text-zinc-600">{description}</p>
  </motion.div>
);

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2026-02-19T00:00:00+05:30") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents = Object.keys(timeLeft).map(interval => {
    if (!isClient || timeLeft[interval] === undefined) return null;
    const value = String(timeLeft[interval]).padStart(2, '0');
    return (
      <div key={interval} className="flex flex-col items-center leading-none">
        <div className="relative h-7 w-6 overflow-hidden">
          <AnimatePresence>
            <motion.span
              key={value}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ ease: 'easeInOut', duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
              style={{
                backgroundSize: '200% 200%',
              }}
            >
              {value}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="text-[10px] uppercase text-zinc-500">{interval}</span>
      </div>
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }} className="hidden lg:flex items-center">
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/60 shadow-inner w-[210px] justify-center">
        {isClient && timerComponents.length ? timerComponents : <div className="h-7 w-48"></div>}
      </div>
    </motion.div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
    setIsMenuOpen(false); // Close menu after clicking
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 bg-white/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
          >
            <h2 className="text-xl font-bold tracking-wide bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
              AI Universe
            </h2>
            <p className="text-xs text-zinc-500 -mt-1">Global Private Limited</p>
          </motion.div>

          <div className="flex items-center gap-4">
            <CountdownTimer />
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              <LogIn size={16} /> Login
            </button>
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              <UserPlus size={16} /> Create Account
            </button>
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="h-10 w-10 p-2 rounded-full hover:bg-zinc-200 transition-colors flex justify-center items-center">
                <motion.div
                  animate={isMenuOpen ? "open" : "closed"}
                  variants={{
                    open: { rotate: 180, scale: 1.1 },
                    closed: { rotate: 0, scale: 1 },
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  <Grid3x3 className="text-zinc-600" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-12 right-0 w-80 origin-top-right rounded-lg border border-zinc-200 bg-white p-4 shadow-xl"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <AppMenuItem onClick={() => scrollToSection('commerce')} icon={<ShoppingCart className="mx-auto text-cyan-500" />} label="Commerce" />
                      <AppMenuItem onClick={() => scrollToSection('family')} icon={<HeartHandshake className="mx-auto text-purple-500" />} label="Family" />
                      <AppMenuItem onClick={() => scrollToSection('intelligence')} icon={<AreaChart className="mx-auto text-green-500" />} label="Intelligence" />
                      <AppMenuItem onClick={() => scrollToSection('hero')} icon={<BrainCircuit className="mx-auto text-blue-500" />} label="AI Engine" />
                      <AppMenuItem onClick={() => scrollToSection('hero')} icon={<Sparkles className="mx-auto text-amber-500" />} label="Stay Tuned" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const AppMenuItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="p-2 rounded-lg hover:bg-zinc-100 transition-colors">
    {icon}
    <span className="mt-1 block text-xs font-medium text-zinc-700">{label}</span>
  </button>
);

const DynamicWelcome = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Greetings, early riser. The future is built in the morning.');
    else if (hour < 18) setGreeting('Hello, visionary. A productive afternoon to you.');
    else setGreeting('Good evening. The world sleeps, but intelligence never rests.');
  }, []);

  const AiIcon = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 10, ease: "linear", repeat: Infinity }}
    >
      <BrainCircuit size={20} className="text-purple-400" />
    </motion.div>
  );

  return (
    <div className="flex items-center justify-center gap-3">
      <AiIcon />
      <p className="text-lg text-zinc-500 italic">{greeting}</p>
      <AiIcon />
    </div>
  );
};

export default function Home() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="font-sans text-zinc-800 bg-white">
        <Header />

        <main className="relative">
          {/* --- HERO SECTION --- */}
          <section id="hero" className="relative flex w-full flex-col items-center justify-center p-8 text-center py-32">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px]"></div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="mb-8 text-center">
              <DynamicWelcome />
              <motion.h2 
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 mt-2"
                style={{ backgroundSize: '200% 200%' }}
              >
                A new era of future intelligence is arriving, stay tuned for an exciting launch! 
              </motion.h2>
            </motion.div>

            <motion.div className="w-full max-w-3xl mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}>
              <Image src="/aiuniglobal-main.png" alt="AI Universe Global Main Concept" width={1200} height={600} className="w-full h-auto rounded-lg shadow-2xl" priority />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <h1 className="text-4xl font-extrabold leading-tight tracking-tighter text-zinc-900 sm:text-5xl md:text-7xl">
                Engineering the Future of
                <br />
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Intelligent Living
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 md:text-xl">
                Our vision is to seamlessly integrate artificial intelligence into the core aspects of commerce, family life, and digital infrastructure. Explore our universe below.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="mt-12 grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
            >
              <ProductPillar
                id="commerce"
                title="AI eCommerce Universe"
                description="Redefining transactions with intelligent billing and hyperlocal e-commerce solutions."
                gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
                onClick={scrollToSection}
              />
              <ProductPillar
                id="family"
                title="AI Family Universe"
                description="A connected ecosystem for education, wellness, and family engagement."
                gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={scrollToSection}
              />
              <ProductPillar
                id="intelligence"
                title="AI Intelligence Universe"
                description="An AI-driven system providing a real-time pulse with machine learning-based insights."
                gradient="bg-gradient-to-r from-green-500 to-teal-500"
                onClick={scrollToSection}
              />
            </motion.div>
          </section>

          {/* --- DYNAMIC UNIVERSE SECTIONS --- */}
          <UniverseSection
            id="commerce"
            title="The AI eCommerce Universe"
            description="We are building a revolutionary commerce platform that leverages AI to automate billing, optimize local logistics, and create personalized shopping experiences. It's more than e-commerce; it's intelligent commerce."
            gradient="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            <div className="w-full h-auto">
              <Image src="/aiuniglobal-ai-e-commerce-universe.png" alt="AI Powered E-commerce Universe" width={500} height={400} className="rounded-lg shadow-xl" />
            </div>
          </UniverseSection>

          <UniverseSection
            id="family"
            title="The AI Family Universe"
            description="Imagine a world where technology nurtures family bonds. Our Family Universe connects kids' education, fitness, and creative pursuits, offering parents and schools valuable insights for holistic development."
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
          >
             <div className="w-full h-auto">
              <Image src="/aiuniglobal-ai-family-universe.png" alt="AI Powered Family Universe with Janvi and Gagan" width={500} height={400} className="rounded-lg shadow-xl" />
            </div>
          </UniverseSection>

          <UniverseSection
            id="intelligence"
            title="The AI Intelligence Universe"
            description="Go beyond simple monitoring. Our platform provides an artificial intelligence-based ecosystem with a machine learning-powered real-time pulse, offering predictive insights to ensure your digital services are always performing at their peak."
            gradient="bg-gradient-to-r from-green-500 to-teal-500"
          >
             <div className="w-full h-auto">
              <Image src="/aiuniglobal-ai-intelligence-universe.png" alt="AI Powered Intelligence Universe" width={500} height={400} className="rounded-lg shadow-xl" />
            </div>
          </UniverseSection>

          <footer className="mt-24 border-t border-zinc-200 bg-zinc-50 py-8 text-center text-zinc-500">
            <p>&copy; {new Date().getFullYear()} AI Universe Global Private Limited. All Rights Reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <a href="#" className="hover:text-zinc-900">Twitter</a>
              <a href="#" className="hover:text-zinc-900">LinkedIn</a>
            </div>
          </footer>
        </main>

        <Chatbot />
      </div>
    </>
  );
}
