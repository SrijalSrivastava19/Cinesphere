import {motion} from 'framer-motion';import {Link} from 'react-router-dom';
const up=i=>({initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{delay:.2+i*.15,duration:.7}});
export default function Home(){return <section className="grid md:grid-cols-2 items-center gap-10 min-h-[80vh]">
<div><motion.p {...up(0)} className="text-pink text-xs tracking-[.3em] mb-4">Welcome to CineSphere</motion.p>
<motion.h1 {...up(1)} className="font-display text-4xl md:text-6xl leading-tight">Your world of <span className="text-pink">cinema.</span></motion.h1>
<motion.p {...up(2)} className="mt-5 max-w-md text-slate-400">Discover movies, log what you watch, share your perspective, and connect with people who love cinema as much as you do.</motion.p>
<motion.div {...up(3)} className="mt-8 flex gap-3"><Link to="/discover" className="btn active:scale-95">EXPLORE MOVIES</Link><Link to="/community" className="btn2 active:scale-95">JOIN COMMUNITY</Link></motion.div>
<motion.dl {...up(4)} className="mt-10 flex gap-10 text-sm"><div><dt className="text-xs text-slate-500">Movies</dt><dd className="text-xl font-display">10K+</dd></div><div><dt className="text-xs text-slate-500">Cinema</dt><dd className="text-xl font-display">24/7</dd></div></motion.dl></div>
<div aria-hidden className="relative mx-auto w-72 h-72 md:w-96 md:h-96">{[1,.68,.38].map((s,i)=><motion.div key={i} animate={{rotate:i%2?-360:360}} transition={{duration:50+i*20,repeat:Infinity,ease:'linear'}} style={{scale:s}} className="absolute inset-0 rounded-full border border-cyan/25"><span className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#37d6e0]"/></motion.div>)}
<motion.div animate={{scale:[1,1.3,1],opacity:[.8,1,.8]}} transition={{duration:2.5,repeat:Infinity}} className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-pink shadow-[0_0_40px_#ff6b8a]"/></div></section>}
