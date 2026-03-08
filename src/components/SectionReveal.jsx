import { motion, useReducedMotion } from 'framer-motion';

export default function SectionReveal({ children, className = '' }) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
