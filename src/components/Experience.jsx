import { motion } from 'framer-motion';
import { portfolioDataJSON } from '../data';

export default function Experience() {
    return (
        <section id="experience" className="py-24 border-t border-white/10 relative">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Career</h2>
                    <h3 className="section-heading">Professional Experience</h3>
                </div>

                <div className="w-full relative">
                    {/* Desktop Timeline Vertical Line */}
                    <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-white/15 transform -translate-x-1/2 z-0" />

                    {portfolioDataJSON.experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative md:flex items-center justify-between w-full mb-16 pl-8 md:pl-0 z-10 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-[#64f5d2] border-4 border-[#0b1120] transform -translate-x-[5.5px] md:-translate-x-1/2 mt-1.5 md:mt-0 z-20" />

                            {/* Empty Space for alignment */}
                            <div className="hidden md:block w-5/12" />

                            {/* Content Card */}
                            <div className="w-full md:w-5/12">
                                <div className="minimal-card p-8">
                                    <div className="flex flex-col gap-1 mb-4">
                                        <span className="text-[#64f5d2] font-mono text-xs uppercase tracking-wider">{exp.duration}</span>
                                        <h4 className="text-xl font-bold font-title text-[#f8f6f1]">{exp.role}</h4>
                                        <span className="text-slate-300 font-medium">{exp.company}</span>
                                    </div>

                                    <div className="text-sm text-slate-500 mb-6">{exp.location} · {exp.type}</div>

                                    <ul className="flex flex-col gap-3">
                                        {exp.highlights.map((highlight, i) => (
                                            <li key={i} className="text-slate-300 text-sm flex items-start">
                                                <span className="text-[#f7d47c] mr-3 mt-0.5">▹</span>
                                                <span className="flex-1 leading-relaxed">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
