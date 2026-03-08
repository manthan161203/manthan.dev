import { motion } from 'framer-motion';
import { portfolioDataJSON } from '../data';

export default function Skills() {
    return (
        <section id="skills" className="py-24 border-t border-white/10 relative">
            <div className="section-container">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Expertise</h2>
                    <h3 className="section-heading">Technical Skills</h3>
                </div>

                <div className="flex flex-col gap-6">
                    {portfolioDataJSON.skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group minimal-card relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 p-6 sm:p-8 md:p-10 overflow-hidden"
                        >
                            {/* Abstract Ambient Glow */}
                            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#64f5d21a] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="w-full md:w-1/3 flex flex-col z-10">
                                <span className="text-slate-500 font-mono text-xs mb-3 tracking-[0.2em] uppercase">Category {String(index + 1).padStart(2, '0')}</span>
                                <h4 className="text-2xl font-bold font-title text-[#f8f6f1] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#f8f6f1] group-hover:to-[#64f5d2] transition-all duration-300">
                                    {category.name}
                                </h4>
                                <div className="h-px w-12 bg-white/20 mt-6 group-hover:w-24 group-hover:bg-[#64f5d2] transition-all duration-500" />
                            </div>

                            <div className="w-full md:w-2/3 flex flex-wrap gap-3 z-10 justify-start md:justify-end">
                                {category.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#f7d47c12] border border-[#f7d47c2e] rounded-lg text-xs sm:text-sm font-medium text-[#fce3a4]
                                                   shadow-[0_4px_20px_rgba(0,0,0,0.1)] backdrop-blur-sm
                                                   hover:-translate-y-1 hover:bg-[#f7d47c20] hover:border-[#f7d47c55] hover:text-[#fff5dc] transition-all duration-300 cursor-default"
                                    >
                                        {skill}
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
