import { portfolioDataJSON } from '../data';

export default function Footer() {
    const { name } = portfolioDataJSON.personalInfo;
    const year = new Date().getFullYear();

    return (
        <footer className="py-8 border-t border-white/10 text-center">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
                <p className="text-slate-400 text-sm font-medium">
                    &copy; {year} {name}. All rights reserved.
                </p>
                <div className="mt-2 text-xs text-slate-500 font-mono">
                    Built with React, motion, and server-side Gemini routing
                </div>
            </div>
        </footer>
    );
}
