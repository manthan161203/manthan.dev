import { useEffect, useState } from 'react';

const SECTION_ITEMS = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' },
];

const HEADER_OFFSET = 96;

export default function SectionNavigator() {
    const [activeId, setActiveId] = useState(SECTION_ITEMS[0].id);

    useEffect(() => {
        const updateActiveSection = () => {
            const threshold = window.scrollY + HEADER_OFFSET + 16;
            let nextId = SECTION_ITEMS[0].id;

            SECTION_ITEMS.forEach((item) => {
                const section = document.getElementById(item.id);
                if (!section) return;
                if (section.offsetTop <= threshold) {
                    nextId = item.id;
                }
            });

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
                nextId = SECTION_ITEMS[SECTION_ITEMS.length - 1].id;
            }

            setActiveId(nextId);
        };

        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
        window.addEventListener('resize', updateActiveSection);

        return () => {
            window.removeEventListener('scroll', updateActiveSection);
            window.removeEventListener('resize', updateActiveSection);
        };
    }, []);

    const jumpToSection = (id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        window.history.replaceState(null, '', `#${id}`);
        setActiveId(id);
    };

    return (
        <>
            <nav
                aria-label="Section navigator"
                className="fixed right-2 xl:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex"
            >
                <div className="relative rounded-2xl border border-white/10 bg-[#0b1120bf] backdrop-blur-xl px-2 py-5 shadow-[0_14px_40px_rgba(0,0,0,0.3)]">
                    <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-white/20"
                    />
                    <ul className="relative flex flex-col gap-4">
                        {SECTION_ITEMS.map((item) => {
                            const isActive = activeId === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => jumpToSection(item.id)}
                                        aria-current={isActive ? 'true' : undefined}
                                        aria-label={`Go to ${item.label}`}
                                        className="group relative z-10 flex h-6 w-6 items-center justify-center rounded-full focus-visible:bg-white/5"
                                    >
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full border transition-colors ${
                                                isActive
                                                    ? 'bg-[#64f5d2] border-[#64f5d2] shadow-[0_0_0_3px_rgba(100,245,210,0.2)]'
                                                    : 'bg-transparent border-white/45 group-hover:border-[#f7d47c]'
                                            }`}
                                        />
                                        <span
                                            className="pointer-events-none absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-[#0b1120f2] px-3 py-1 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                                        >
                                            {item.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>

            <nav
                aria-label="Mobile section navigator"
                className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:hidden"
            >
                <div className="rounded-full border border-white/10 bg-[#0b1120d9] px-3 py-2 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.3)]">
                    <ul className="flex items-center gap-2.5">
                        {SECTION_ITEMS.map((item) => {
                            const isActive = activeId === item.id;

                            return (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => jumpToSection(item.id)}
                                        aria-current={isActive ? 'true' : undefined}
                                        aria-label={`Go to ${item.label}`}
                                        className="flex h-6 w-6 items-center justify-center rounded-full"
                                    >
                                        <span
                                            className={`h-2.5 rounded-full transition-all ${
                                                isActive
                                                    ? 'w-5 bg-[#64f5d2] shadow-[0_0_0_3px_rgba(100,245,210,0.2)]'
                                                    : 'w-2.5 border border-white/45 bg-transparent'
                                            }`}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </>
    );
}
