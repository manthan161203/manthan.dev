import { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) {
                setProgress(0);
                return;
            }
            const next = (window.scrollY / maxScroll) * 100;
            setProgress(Math.min(100, Math.max(0, next)));
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    return (
        <div className="fixed left-0 top-0 z-[60] h-1 w-full bg-transparent pointer-events-none">
            <div
                className="h-full bg-[linear-gradient(90deg,#64f5d2_0%,#f7d47c_100%)] transition-[width] duration-150"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
            />
        </div>
    );
}
