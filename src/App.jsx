import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';
import ScrollProgress from './components/ScrollProgress';

export default function App() {
  return (
    <div className="min-h-screen text-[var(--text-main)] font-sans selection:bg-[#f7d47c55]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:bg-[#f7d47c] focus:px-4 focus:py-2 focus:text-[#111827] focus:font-semibold"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 -left-20 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,_rgba(15,188,154,0.22)_0%,_rgba(15,188,154,0)_72%)] blur-2xl" />
        <div className="absolute -bottom-32 -right-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,_rgba(247,212,124,0.18)_0%,_rgba(247,212,124,0)_70%)] blur-2xl" />
      </div>
      <Navbar />
      <main id="main-content" tabIndex="-1">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <GeminiChat />
    </div>
  );
}
