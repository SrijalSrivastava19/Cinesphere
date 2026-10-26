import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
return (
<motion.main
initial={{ opacity: 0, x: 30, filter: 'blur(6px)' }}
animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
exit={{ opacity: 0, x: -30, filter: 'blur(6px)' }}
transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
className="relative z-10 min-h-screen pt-24 px-5 md:px-12 pb-16"
>
{children}
</motion.main>
);
}
