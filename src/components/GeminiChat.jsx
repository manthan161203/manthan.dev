import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSend, FiX } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import { GEMINI_CONTEXT } from '../data';

const SUGGESTED = [
    "Give me a 60-second recruiter pitch for Manthan.",
    "Summarize his strongest AI/backend skills.",
    "List relevant projects for an LLM engineer role.",
    "Generate 10 interview questions for this profile.",
];

const MODELS = [
    { value: 'gemini-2.5-flash-lite', label: 'gemini-2.5-flash-lite' },
    { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
];

export default function GeminiChat() {
    const [open, setOpen] = useState(false);
    const [model, setModel] = useState(MODELS[0].value);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hi. I am Manthan's AI assistant. Ask me about his projects, experience, and skills.",
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (open && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [open]);

    const sendMessage = async (draft) => {
        const msg = (draft || input).trim();
        if (!msg || loading) return;

        setInput('');
        const history = [...messages, { role: 'user', text: msg }];
        setMessages(history);
        setLoading(true);

        const contents = [
            { role: 'user', parts: [{ text: GEMINI_CONTEXT }] },
            {
                role: 'model',
                parts: [
                    {
                        text: "Understood. I will answer only from the provided profile context and be precise.",
                    },
                ],
            },
            ...history.slice(1).map((m) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            })),
        ];

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ model, contents }),
            });

            const data = await response.json();

            if (!response.ok) {
                const errMsg = data?.error?.message || data?.error || 'Gemini request failed';
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: `Error: ${errMsg}. Ensure GEMINI_API_KEY is set on the server.`,
                        isError: true,
                    },
                ]);
                return;
            }

            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!reply) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: 'No response from Gemini. Try again.',
                        isError: true,
                    },
                ]);
                return;
            }

            setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: `Network error: ${error.message}`,
                    isError: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const onInputKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {open && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto w-[380px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] rounded-3xl border border-white/15 bg-[#101526]/95 shadow-2xl shadow-[#0fbc9a1f] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        <header className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-[#0fbc9a1f] border border-[#0fbc9a55] text-[#64f5d2] flex items-center justify-center">
                                    <FaBrain />
                                </span>
                                <div>
                                    <h3 className="font-title font-semibold text-white text-sm">Portfolio Copilot</h3>
                                    <p className="text-xs text-slate-400">Server-side Gemini route</p>
                                </div>
                            </div>
                            <select
                                className="text-xs bg-black/30 border border-white/15 rounded-lg px-2 py-1 text-slate-200 outline-none"
                                value={model}
                                onChange={(event) => setModel(event.target.value)}
                                aria-label="Select Gemini model"
                            >
                                {MODELS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                                        message.role === 'user'
                                            ? 'self-end bg-[#f7d47c] text-[#1f1a10] rounded-br-sm'
                                            : message.isError
                                                ? 'self-start bg-[#ff6b6b1a] text-[#ffc7c7] border border-[#ff6b6b4d] rounded-bl-sm'
                                                : 'self-start bg-white/10 text-slate-200 border border-white/10 rounded-bl-sm'
                                    }`}
                                >
                                    {message.text}
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="self-start bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-3 py-2 flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:130ms]" />
                                    <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:260ms]" />
                                </div>
                            )}

                            {!loading && messages.length === 1 && (
                                <div className="pt-1 flex flex-wrap gap-2">
                                    {SUGGESTED.map((prompt) => (
                                        <button
                                            type="button"
                                            key={prompt}
                                            onClick={() => sendMessage(prompt)}
                                            className="text-xs text-left px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="border-t border-white/10 bg-white/[0.02] p-3 flex items-center gap-2">
                            <textarea
                                ref={inputRef}
                                rows={1}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={onInputKeyDown}
                                placeholder="Ask about projects, stacks, or interview fit..."
                                disabled={loading}
                                className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-500 text-sm outline-none resize-none px-2 py-1 disabled:opacity-60"
                            />
                            <button
                                type="button"
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading}
                                className="w-9 h-9 rounded-xl bg-[#f7d47c] text-[#1f1a10] flex items-center justify-center disabled:opacity-50 transition-opacity"
                                aria-label="Send message"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                ) : (
                                    <FiSend size={14} />
                                )}
                            </button>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={() => setOpen((current) => !current)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full border border-[#f7d47c80] bg-[#f7d47c] text-[#1f1a10] flex items-center justify-center shadow-xl shadow-[#f7d47c38] relative"
                aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.span
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FiX size={24} />
                        </motion.span>
                    ) : (
                        <motion.span
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FaBrain size={22} />
                        </motion.span>
                    )}
                </AnimatePresence>
                {!open && (
                    <span className="absolute inset-0 rounded-full border border-[#f7d47c80] animate-ping opacity-30 pointer-events-none" />
                )}
            </motion.button>
        </div>
    );
}
