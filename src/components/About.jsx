import { motion } from 'framer-motion';
import { portfolioDataJSON } from '../data';

export default function About() {
    const { stats } = portfolioDataJSON;
    const { bio, name } = portfolioDataJSON.personalInfo;

    return (
        <section id="about" className="py-24 relative border-t border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,188,154,0.08)_0%,rgba(8,12,20,0)_35%)] pointer-events-none" />

            <div className="section-container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                        {/* Profile Image Column */}
                        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start shrink-0">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl border border-white/15 flex items-center justify-center mb-6 overflow-hidden minimal-card p-1">
                                <img
                                    src="/profile_pic.jpg"
                                    alt={`${name} profile`}
                                    className="w-full h-full rounded-xl object-cover object-center border border-white/10"
                                    loading="lazy"
                                />
                            </div>

                            {/* Quick Stats */}
                            <div className="w-full grid grid-cols-2 gap-4">
                                {stats.map((stat, i) => (
                                    <div key={i} className="minimal-card p-4 text-center">
                                        <div className="text-xl font-bold font-title text-[#f7d47c] mb-1">{stat.value}</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="w-full md:w-2/3">
                            <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">About Me</h2>
                            <h3 className="text-2xl sm:text-3xl font-bold font-title text-[#f8f6f1] mb-6 leading-snug">
                                Engineering intelligence<br />at scale.
                            </h3>

                            <div className="space-y-6 text-slate-300 leading-relaxed text-base sm:text-lg">
                                <p>{bio}</p>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
