import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import { portfolioDataJSON } from '../data';

export default function Projects() {
    return (
        <section id="projects" className="py-24 border-t border-white/10 relative">
            <div className="section-container">
                <div className="mb-16">
                    <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Portfolio</h2>
                    <h3 className="section-heading">Featured Projects</h3>
                    <p className="section-subheading">A selection of my recent AI and backend engineering work.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {portfolioDataJSON.projects.map((proj, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="minimal-card p-8 flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-6 w-full">
                                <div className="text-sm font-mono text-slate-400 group-hover:text-[#64f5d2] transition-colors">
                                    Project 0{index + 1}
                                </div>
                                <div className="flex gap-4">
                                    {proj.github && (
                                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-[#f7d47c] transition-colors" title="View Source">
                                            <FiGithub size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold font-title text-[#f8f6f1] mb-2">{proj.title}</h4>
                            <p className="text-sm text-slate-400 mb-6 font-medium">{proj.subtitle}</p>

                            <p className="text-slate-300 leading-relaxed mb-8 flex-grow">
                                {proj.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto w-full">
                                {proj.tags.map((tag, i) => (
                                    <span key={i} className="text-xs font-mono px-3 py-1 rounded-full bg-[#64f5d214] border border-[#64f5d236] text-[#9fffe8]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
