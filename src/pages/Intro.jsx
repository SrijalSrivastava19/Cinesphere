import {useEffect} from 'react';import {motion} from 'framer-motion';import {useNavigate} from 'react-router-dom';
export default function Intro(){const n=useNavigate();useEffect(()=>{const t=setTimeout(()=>n('/home'),5200);return()=>clearTimeout(t)},[n]);
const L='CINESPHERE'.split('');
return <div className="relative z-10 min-h-screen grid place-items-center text-center"><div>
<motion.div aria-hidden initial={{scale:.6,opacity:0,rotate:0}} animate={{scale:1,opacity:1,rotate:45}} transition={{duration:2}} className="mx-auto mb-10 w-16 h-16 border border-pink shadow-[0_0_40px_#ff6b8a66]"/>
<h1 aria-label="CineSphere" className="font-display text-3xl md:text-6xl tracking-[.3em]">{L.map((c,i)=><motion.span key={i} aria-hidden initial={{opacity:0,y:12,filter:'blur(8px)'}} animate={{opacity:1,y:0,filter:'blur(0)'}} transition={{delay:1+i*.15,duration:.7}} className={i>3?'text-pink drop-shadow-[0_0_14px_#ff6b8a]':''}>{c}</motion.span>)}</h1>
<motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3,duration:1}} className="mt-6 text-xs tracking-[.4em] text-slate-400">CINEMA · COMMUNITY</motion.p>
<motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3.5}} onClick={()=>n('/home')} className="mt-10 text-xs text-slate-500 hover:text-white underline">Skip intro</motion.button></div></div>}
