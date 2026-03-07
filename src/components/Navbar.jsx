import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
import { portfolioDataJSON } from '../data';

const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrolled
                    ? 'py-3 border-b border-white/10 bg-[#0b1120]/80 backdrop-blur-xl'
                    : 'py-5 bg-transparent'
            }`}
        >
            <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between" aria-label="Primary navigation">
                <a
                    href="#home"
                    className="text-xl md:text-2xl font-bold font-title tracking-tight text-[#f8f6f1] hover:text-[#f7d47c] transition-colors"
                >
                    Manthan<span className="text-[#64f5d2]">.ai</span>
                </a>

                <ul className="hidden md:flex items-center gap-7">
                    {navLinks.map((link) => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                className="text-sm font-medium text-slate-300 hover:text-[#f7d47c] transition-colors"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="hidden md:flex items-center gap-4">
                    <a
                        href={portfolioDataJSON.resume.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0c1324] bg-[#f7d47c] px-4 py-2 rounded-full border border-[#f7d47c80] hover:bg-[#f3c95d] transition-colors"
                    >
                        <FiDownload /> Resume
                    </a>
                </div>

                <button
                    type="button"
                    className="md:hidden text-slate-200 hover:text-[#f7d47c]"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="absolute top-full left-0 w-full md:hidden border-b border-white/10 bg-[#0b1120]/95 backdrop-blur-xl flex flex-col items-center py-6 gap-6"
                    >
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-base font-medium text-slate-300 hover:text-[#f7d47c]"
                            >
                                {link.label}
                            </a>
                        ))}
                        <a
                            href={portfolioDataJSON.resume.url}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setMenuOpen(false)}
                            className="text-base font-semibold text-[#0c1324] bg-[#f7d47c] px-6 py-2 rounded-full border border-[#f7d47c80]"
                        >
                            Download Resume
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
