import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiDownload, FiMail } from 'react-icons/fi';
import { portfolioDataJSON } from '../data';

const ROLE_TEXT = 'AI x Backend Engineer';

export default function Hero() {
    const { name, tagline } = portfolioDataJSON.personalInfo;
    const stats = portfolioDataJSON.stats;
    const [typedRole, setTypedRole] = useState(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return ROLE_TEXT;
        }
        return '';
    });
    const signals = [
        'LLM + RAG integrations in live products',
        'FastAPI backend architecture for AI workloads',
        'OCR and NLP automations for operations',
        'Model-aware system design and deployment',
    ];

    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        let index = 0;
        const timer = window.setInterval(() => {
            index += 1;
            setTypedRole(ROLE_TEXT.slice(0, index));
            if (index >= ROLE_TEXT.length) {
                window.clearInterval(timer);
            }
        }, 65);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <section id="home" className="relative min-h-screen pt-28 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-16 left-[8%] h-44 w-44 rounded-full border border-[#64f5d266] animate-spin-slow" />
                <div className="absolute top-[40%] right-[12%] h-24 w-24 rounded-full border border-[#f7d47c55]" />
                <div className="absolute bottom-10 left-[45%] h-56 w-56 rounded-full bg-[radial-gradient(circle,_rgba(100,245,210,0.15)_0%,_rgba(100,245,210,0)_70%)] blur-2xl" />
            </div>

            <div className="section-container relative z-10 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center lg:items-start">
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64f5d24d] bg-[#64f5d212] text-[#9fffe8] text-sm font-medium mb-7"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#64f5d2] animate-pulse" />
                        Building AI systems in production
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="text-5xl md:text-7xl font-bold font-title tracking-tight text-[#f8f6f1] leading-[0.95]"
                    >
                        {name}
                        <span className="block text-[#f7d47c] mt-2">
                            {typedRole}
                            <span className="type-cursor ml-1" aria-hidden="true" />
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.24 }}
                        className="mt-5 text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    >
                        {tagline}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.32 }}
                        className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
                    >
                        <a href="#projects" className="btn-minimal btn-minimal-primary justify-center">
                            Explore Projects <FiArrowRight />
                        </a>
                        <a
                            href={portfolioDataJSON.resume.url}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-minimal btn-minimal-outline justify-center"
                        >
                            <FiDownload /> Resume
                        </a>
                        <a
                            href="#contact"
                            className="btn-minimal btn-minimal-ghost justify-center"
                        >
                            <FiMail /> Contact
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
                    >
                        {stats.map((stat) => (
                            <article key={stat.label} className="minimal-card p-4 text-left">
                                <p className="text-2xl font-bold font-title text-[#f7d47c]">{stat.value}</p>
                                <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">{stat.label}</p>
                            </article>
                        ))}
                    </motion.div>
                </div>

                <motion.aside
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className="minimal-card p-7 h-fit lg:h-[280px] relative overflow-hidden flex flex-col lg:mt-20"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,#64f5d2_0%,#f7d47c_100%)]" />
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-4">Live Engineering Signal</p>
                    <ul className="space-y-3 flex-1">
                        {signals.map((line) => (
                            <li key={line} className="text-slate-200 flex items-start gap-3">
                                <span className="mt-1 h-2 w-2 rounded-full bg-[#64f5d2]" />
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {['FastAPI', 'LangChain', 'Gemini', 'RAG', 'Docker', 'MySQL', 'NLP', 'OCR'].map((tag) => (
                            <span
                                key={tag}
                                className="text-xs px-3 py-1 rounded-full bg-[#f7d47c14] border border-[#f7d47c42] text-[#fce3a4]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.aside>
            </div>
        </section>
    );
}
