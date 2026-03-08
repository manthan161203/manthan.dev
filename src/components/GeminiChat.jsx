import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCopy, FiRotateCcw, FiSend, FiX } from 'react-icons/fi';
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

const DEFAULT_MESSAGES = [
    {
        role: 'assistant',
        text: "Hi. I am Manthan's AI assistant. Ask me about his projects, experience, and skills.",
    },
];

const MODEL_STORAGE_KEY = 'portfolio_gemini_model';
const MAX_INPUT_CHARS = 500;

function renderInlineText(text, keyPrefix = 'inline') {
    return text
        .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        .filter(Boolean)
        .map((token, index) => {
            if (token.startsWith('**') && token.endsWith('**')) {
                return (
                    <strong key={`${keyPrefix}-b-${index}`} className="font-semibold text-[#f8f6f1]">
                        {token.slice(2, -2)}
                    </strong>
                );
            }
            if (token.startsWith('`') && token.endsWith('`')) {
                return (
                    <code key={`${keyPrefix}-c-${index}`} className="px-1.5 py-0.5 rounded bg-black/35 border border-white/10 text-[#fce3a4]">
                        {token.slice(1, -1)}
                    </code>
                );
            }
            return <span key={`${keyPrefix}-t-${index}`}>{token}</span>;
        });
}

function renderFormattedMessage(text, keyPrefix = 'msg') {
    const lines = String(text || '').split('\n');
    const nodes = [];
    let bulletItems = [];
    let numberedItems = [];

    const flushLists = (lineIndex) => {
        if (bulletItems.length > 0) {
            nodes.push(
                <ul key={`${keyPrefix}-ul-${lineIndex}`} className="list-disc pl-5 space-y-1">
                    {bulletItems.map((item, i) => (
                        <li key={`${keyPrefix}-ul-item-${lineIndex}-${i}`}>{renderInlineText(item, `${keyPrefix}-ul-inline-${i}`)}</li>
                    ))}
                </ul>,
            );
            bulletItems = [];
        }
        if (numberedItems.length > 0) {
            nodes.push(
                <ol key={`${keyPrefix}-ol-${lineIndex}`} className="list-decimal pl-5 space-y-1">
                    {numberedItems.map((item, i) => (
                        <li key={`${keyPrefix}-ol-item-${lineIndex}-${i}`}>{renderInlineText(item, `${keyPrefix}-ol-inline-${i}`)}</li>
                    ))}
                </ol>,
            );
            numberedItems = [];
        }
    };

    lines.forEach((rawLine, index) => {
        const line = rawLine.trim();
        const bulletMatch = line.match(/^[-*]\s+(.*)$/);
        if (bulletMatch) {
            bulletItems.push(bulletMatch[1]);
            return;
        }

        const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
        if (orderedMatch) {
            numberedItems.push(orderedMatch[1]);
            return;
        }

        flushLists(index);

        if (!line) {
            nodes.push(<div key={`${keyPrefix}-sp-${index}`} className="h-2" />);
            return;
        }

        if (line.startsWith('### ')) {
            nodes.push(
                <h5 key={`${keyPrefix}-h3-${index}`} className="text-sm font-semibold text-[#f8f6f1]">
                    {renderInlineText(line.replace(/^###\s+/, ''), `${keyPrefix}-h3-inline-${index}`)}
                </h5>,
            );
            return;
        }

        if (line.startsWith('## ')) {
            nodes.push(
                <h4 key={`${keyPrefix}-h2-${index}`} className="text-base font-semibold text-[#f8f6f1]">
                    {renderInlineText(line.replace(/^##\s+/, ''), `${keyPrefix}-h2-inline-${index}`)}
                </h4>,
            );
            return;
        }

        nodes.push(
            <p key={`${keyPrefix}-p-${index}`} className="leading-relaxed">
                {renderInlineText(rawLine, `${keyPrefix}-p-inline-${index}`)}
            </p>,
        );
    });

    flushLists(lines.length + 1);
    return nodes;
}

export default function GeminiChat() {
    const [open, setOpen] = useState(false);
    const [model, setModel] = useState(MODELS[0].value);
    const [messages, setMessages] = useState(DEFAULT_MESSAGES);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [errorBanner, setErrorBanner] = useState('');
    const [copiedIndex, setCopiedIndex] = useState(null);
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

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(MODEL_STORAGE_KEY);
            if (stored && MODELS.some((option) => option.value === stored)) {
                setModel(stored);
            }
        } catch {
            // no-op in restricted browser modes
        }
    }, []);

    useEffect(() => {
        try {
            window.localStorage.setItem(MODEL_STORAGE_KEY, model);
        } catch {
            // no-op in restricted browser modes
        }
    }, [model]);

    const sendMessage = async (draft) => {
        const msg = (draft || input).trim();
        if (!msg || loading) return;
        if (msg.length > MAX_INPUT_CHARS) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: `Message too long. Keep it under ${MAX_INPUT_CHARS} characters.`,
                    isError: true,
                },
            ]);
            return;
        }

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
                const errCode = data?.code || data?.error?.code;
                const errMsg = data?.error?.message || data?.error || 'Gemini request failed';
                const isMissingKey =
                    errCode === 'MISSING_GEMINI_KEY' ||
                    /gemini_api_key|google_api_key|api key is missing/i.test(String(errMsg));
                if (isMissingKey) {
                    setNeedsSetup(true);
                }
                setErrorBanner(String(errMsg));
                setMessages((prev) => [
                    ...prev,
                    {
                        role: 'assistant',
                        text: `Error: ${errMsg}`,
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

            setNeedsSetup(false);
            setErrorBanner('');
            setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
        } catch (error) {
            const message = `Network error: ${error.message}`;
            setErrorBanner(message);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: message,
                    isError: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const resetConversation = () => {
        setMessages(DEFAULT_MESSAGES);
        setInput('');
        setNeedsSetup(false);
        setErrorBanner('');
        setCopiedIndex(null);
    };

    const onInputKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    const copyMessage = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1400);
        } catch {
            // ignore clipboard failures
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {open && (
                    <motion.section
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 16 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto w-[420px] max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] h-[80vh] sm:h-[560px] max-h-[84vh] rounded-[1.75rem] border border-white/15 bg-[#0b1120]/95 shadow-2xl shadow-[#64f5d226] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        <header className="p-4 border-b border-white/10 bg-[linear-gradient(135deg,rgba(100,245,210,0.10),rgba(247,212,124,0.08)_55%,rgba(255,255,255,0.02))] flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl bg-[#64f5d21a] border border-[#64f5d255] text-[#64f5d2] flex items-center justify-center">
                                    <FaBrain />
                                </span>
                                <div>
                                    <h3 className="font-title font-semibold text-white text-sm">Portfolio Copilot</h3>
                                    <p className="text-xs text-slate-300">Ask about projects, experience, and fit</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={resetConversation}
                                    className="w-8 h-8 rounded-lg border border-white/15 bg-black/20 text-slate-300 hover:text-[#f7d47c] hover:border-[#f7d47c66] transition-colors flex items-center justify-center"
                                    aria-label="Reset chat"
                                >
                                    <FiRotateCcw size={14} />
                                </button>
                                <select
                                    className="text-[11px] bg-black/30 border border-white/15 rounded-lg px-2 py-1 text-slate-200 outline-none max-w-[132px]"
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
                            </div>
                        </header>

                        {needsSetup && (
                            <div className="mx-4 mt-3 rounded-xl border border-[#f7d47c66] bg-[#f7d47c12] px-3 py-2.5">
                                <p className="text-[#fce3a4] text-xs font-semibold">Gemini key setup required</p>
                                <p className="text-[11px] text-slate-300 mt-1">
                                    Add `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) in `.env`, then restart `npm run dev`.
                                </p>
                            </div>
                        )}
                        {errorBanner && !needsSetup && (
                            <div className="mx-4 mt-3 rounded-xl border border-[#f7d47c66] bg-[#f7d47c12] px-3 py-2 text-[11px] text-[#fce3a4]">
                                {errorBanner}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" aria-live="polite">
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`group max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        message.role === 'user'
                                            ? 'self-end bg-[#f7d47c] text-[#1f1a10] rounded-br-sm'
                                            : message.isError
                                                ? 'self-start bg-[#f7d47c1a] text-[#fce3a4] border border-[#f7d47c4d] rounded-bl-sm'
                                                : 'self-start bg-white/10 text-slate-200 border border-white/10 rounded-bl-sm'
                                    }`}
                                >
                                    <div className="space-y-1 break-words">
                                        {renderFormattedMessage(message.text, `msg-${index}`)}
                                    </div>
                                    {message.role === 'assistant' && !message.isError && (
                                        <button
                                            type="button"
                                            onClick={() => copyMessage(message.text, index)}
                                            className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#64f5d2] transition-colors"
                                            aria-label="Copy assistant message"
                                        >
                                            <FiCopy size={12} />
                                            {copiedIndex === index ? 'Copied' : 'Copy'}
                                        </button>
                                    )}
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="self-start w-[78%] max-w-[300px] bg-white/10 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                                    <div className="h-2.5 w-20 rounded bg-white/20 animate-pulse mb-2.5" />
                                    <div className="space-y-2">
                                        <div className="h-2.5 w-full rounded bg-white/15 animate-pulse" />
                                        <div className="h-2.5 w-[88%] rounded bg-white/15 animate-pulse [animation-delay:120ms]" />
                                        <div className="h-2.5 w-[64%] rounded bg-white/15 animate-pulse [animation-delay:220ms]" />
                                    </div>
                                </div>
                            )}

                            {!loading && messages.length === 1 && (
                                <div className="pt-1 flex flex-wrap gap-2">
                                    {SUGGESTED.map((prompt) => (
                                        <button
                                            type="button"
                                            key={prompt}
                                            onClick={() => sendMessage(prompt)}
                                            className="text-xs text-left px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-[#64f5d212] hover:border-[#64f5d244] transition-colors"
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
                                onChange={(event) => setInput(event.target.value.slice(0, MAX_INPUT_CHARS))}
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
                        <div className="px-4 pb-3 text-[11px] text-slate-500 text-right">
                            {input.length}/{MAX_INPUT_CHARS}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <motion.button
                type="button"
                onClick={() => setOpen((current) => !current)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto w-14 h-14 rounded-full border border-[#f7d47c80] bg-[linear-gradient(135deg,#f7d47c,#f3c95d)] text-[#1f1a10] flex items-center justify-center shadow-xl shadow-[#f7d47c38] relative"
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
