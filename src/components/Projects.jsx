import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub } from 'react-icons/fi';
import { portfolioDataJSON } from '../data';

export default function Projects() {
    const projects = portfolioDataJSON.projects;
    const [activeTag, setActiveTag] = useState('All');
    const [query, setQuery] = useState('');

    const filterTags = useMemo(() => {
        const unique = [];
        projects.forEach((project) => {
            project.tags.forEach((tag) => {
                if (!unique.includes(tag)) unique.push(tag);
            });
        });
        return ['All', 'Featured', ...unique];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        const search = query.trim().toLowerCase();

        return projects.filter((project) => {
            if (activeTag === 'Featured' && !project.featured) return false;
            if (activeTag !== 'All' && activeTag !== 'Featured' && !project.tags.includes(activeTag)) return false;

            if (!search) return true;

            const haystack = [
                project.title,
                project.subtitle,
                project.description,
                ...project.tags,
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(search);
        });
    }, [activeTag, projects, query]);

    return (
        <section id="projects" className="py-24 border-t border-white/10 relative">
            <div className="section-container">
                <div className="mb-16">
                    <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Portfolio</h2>
                    <h3 className="section-heading">Featured Projects</h3>
                    <p className="section-subheading">A selection of my recent AI and backend engineering work.</p>

                    <div className="mt-8 flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                            {filterTags.map((tag) => (
                                <button
                                    type="button"
                                    key={tag}
                                    onClick={() => setActiveTag(tag)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-colors ${
                                        activeTag === tag
                                            ? 'bg-[#f7d47c] border-[#f7d47c] text-[#1f1a10]'
                                            : 'bg-white/[0.04] border-white/15 text-slate-300 hover:border-[#64f5d2] hover:text-[#64f5d2]'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <input
                                type="search"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search projects by stack or use case..."
                                className="w-full sm:max-w-md bg-black/30 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#64f5d2]"
                                aria-label="Search projects"
                            />
                            <p className="text-xs text-slate-400 font-mono">
                                Showing {filteredProjects.length} of {projects.length}
                            </p>
                        </div>
                    </div>
                </div>

                {filteredProjects.length === 0 ? (
                    <div className="minimal-card p-8 text-center text-slate-300">
                        No projects match this filter. Try another tag or search text.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {filteredProjects.map((proj, index) => (
                        <motion.div
                            key={`${proj.title}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="minimal-card p-6 sm:p-8 flex flex-col group"
                        >
                            <div className="flex justify-between items-start mb-6 w-full">
                                <div className="text-sm font-mono text-slate-400 group-hover:text-[#64f5d2] transition-colors">
                                    {proj.featured ? 'Featured Project' : `Project 0${index + 1}`}
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
                )}
            </div>
        </section>
    );
}
