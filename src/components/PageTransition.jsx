import {motion} from 'framer-motion';
export default function PageTransition({children}){return <motion.main initial={{opacity:0,x:30,filter:'blur(6px)'}} animate={{opacity:1,x:0,filter:'blur(0px)'}} exit={{opacity:0,x:-30,filter:'blur(6px)'}} transition={{duration:.5,ease:[.22,1,.36,1]}} className="relative z-10 min-h-screen pt-24 px-5 md:px-12 pb-16">{children}
<motion.div aria-hidden initial={{x:'-120%'}} animate={{x:'120%'}} transition={{duration:.9}} className="fixed inset-y-0 w-24 pointer-events-none z-50 bg-gradient-to-r from-transparent via-pink/30 to-transparent"/></motion.main>}
