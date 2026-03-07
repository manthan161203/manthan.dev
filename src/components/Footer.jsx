import { portfolioDataJSON } from '../data';

export default function Footer() {
    const { name } = portfolioDataJSON.personalInfo;
    const year = new Date().getFullYear();

    return (
        <footer className="py-8 bg-[#050505] border-t border-white/5 text-center">
            <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
                <p className="text-gray-500 text-sm font-medium">
                    &copy; {year} {name}. All rights reserved.
                </p>
                <div className="mt-2 text-xs text-gray-600 font-mono">
                    Built with React & Tailwind CSS
                </div>
            </div>
        </footer>
    );
}
