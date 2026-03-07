import { motion } from 'framer-motion';
import { FiMail, FiGithub, FiLinkedin, FiSend } from 'react-icons/fi';
import { useState } from 'react';
import { portfolioDataJSON } from '../data';

export default function Contact() {
    const { email, github, linkedin } = portfolioDataJSON.personalInfo;
    const { successMessage, placeholders } = portfolioDataJSON.contactInfo;

    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setStatus('');
        setErrorMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                setStatus('error');
                setErrorMessage(data?.error || 'Failed to send message. Please try again.');
                return;
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 4000);
        } catch {
            setStatus('error');
            setErrorMessage('Network issue while sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-24 border-t border-white/10 relative">
            <div className="section-container max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em] mb-4">Get In Touch</h2>
                    <h3 className="section-heading">Let's Work Together</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <form onSubmit={handleSubmit} className="minimal-card p-8 flex flex-col gap-5">
                            <h4 className="text-xl font-title font-semibold text-[#f8f6f1] mb-2">Send a Message</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder={placeholders.name} className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#64f5d2] transition-colors" />
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder={placeholders.email} className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#64f5d2] transition-colors" />
                            </div>

                            <input required type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder={placeholders.subject} className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#64f5d2] transition-colors" />

                            <textarea required name="message" value={formData.message} onChange={handleChange} placeholder={placeholders.message} rows="4" className="w-full bg-black/40 border border-white/15 rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#64f5d2] transition-colors resize-y" />

                            <button disabled={isSubmitting} type="submit" className="btn-minimal btn-minimal-primary justify-center mt-2 w-full sm:w-auto self-start disabled:opacity-65 disabled:cursor-not-allowed">
                                <FiSend /> {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>

                            {status === 'success' && (
                                <p className="text-green-400 text-sm mt-2 font-medium">{successMessage}</p>
                            )}
                            {status === 'error' && (
                                <p className="text-red-400 text-sm mt-2 font-medium">{errorMessage}</p>
                            )}
                        </form>
                    </motion.div>

                    {/* Right: Direct Links */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col justify-center gap-8"
                    >
                        <p className="text-slate-300 leading-relaxed text-lg">
                            I'm currently open to new opportunities, collaborations, and conversations about AI and backend engineering.
                        </p>

                        <div className="flex flex-col gap-6">
                            <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#f7d47c] group-hover:border-[#f7d47c80] transition-all">
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 font-medium">Email</div>
                                    <div className="text-slate-200 group-hover:text-[#64f5d2] transition-colors">{email}</div>
                                </div>
                            </a>

                            <a href={linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#f7d47c] group-hover:border-[#f7d47c80] transition-all">
                                    <FiLinkedin size={20} />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 font-medium">LinkedIn</div>
                                    <div className="text-slate-200 group-hover:text-[#64f5d2] transition-colors">Connect with me</div>
                                </div>
                            </a>

                            <a href={github} target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#f7d47c] group-hover:border-[#f7d47c80] transition-all">
                                    <FiGithub size={20} />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500 font-medium">GitHub</div>
                                    <div className="text-slate-200 group-hover:text-[#64f5d2] transition-colors">View my repositories</div>
                                </div>
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
