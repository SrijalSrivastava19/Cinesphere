import {NavLink,Link} from 'react-router-dom';import {motion} from 'framer-motion';
const L=[['/home','Home'],['/discover','Discover'],['/community','Community'],['/watchlist','Watchlist'],['/profile','Profile']];
export default function Navbar(){return <header className="fixed top-0 inset-x-0 z-40 glass border-x-0 border-t-0"><nav aria-label="Main" className="flex items-center justify-between px-5 md:px-12 h-16">
 <Link to="/home" className="font-display text-sm tracking-[.3em]">CINE<span className="text-pink">SPHERE</span></Link>
 <ul className="flex gap-4 md:gap-8 text-xs md:text-sm overflow-x-auto">{L.map(([to,t])=><li key={to}><NavLink to={to} className={({isActive})=>`relative py-2 ${isActive?'text-white':'text-slate-400 hover:text-white'}`}>{({isActive})=><>{t}{isActive&&<motion.span layoutId="ind" className="absolute -bottom-0.5 inset-x-0 h-px bg-pink shadow-[0_0_8px_#ff6b8a]"/>}</>}</NavLink></li>)}</ul>
 <Link to="/login" className="btn2 hidden sm:block">SIGN IN</Link></nav></header>}
