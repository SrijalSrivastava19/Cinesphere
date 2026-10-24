import {createContext,useContext,useEffect,useState} from 'react';
import {Routes,Route,useLocation,Navigate} from 'react-router-dom';
import {AnimatePresence,MotionConfig} from 'framer-motion';
import Navbar from './components/Navbar';import PageTransition from './components/PageTransition';import ParticleBackground from './components/ParticleBackground';
import Intro from './pages/Intro';import Home from './pages/Home';import Auth from './pages/Auth';import Community from './pages/Community';import Discover from './pages/Discover';import Watchlist from './pages/Watchlist';import Profile from './pages/Profile';
const Ctx=createContext();export const useStore=()=>useContext(Ctx);
function useLS(k,d){const [v,s]=useState(()=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}});useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v]);return [v,s]}
export default function App(){
 const loc=useLocation();const [watch,setWatch]=useLS('cs_watch',[]);const [liked,setLiked]=useLS('cs_liked',[]);const [saved,setSaved]=useLS('cs_saved',[]);
 const tog=(set)=>id=>set(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]);
 const bare=loc.pathname==='/'||loc.pathname==='/login'||loc.pathname==='/signup';
 const P=(el)=><PageTransition key={loc.pathname}>{el}</PageTransition>;
 return <MotionConfig reducedMotion="user"><Ctx.Provider value={{watch,liked,saved,toggleWatch:tog(setWatch),toggleLike:tog(setLiked),toggleSave:tog(setSaved)}}>
  <ParticleBackground/>{loc.pathname!=='/'&&<Navbar/>}
  <Routes location={loc}>
   <Route path="/" element={<Intro/>}/><Route path="/home" element={P(<Home/>)}/>
   <Route path="/login" element={P(<Auth mode="login"/>)}/><Route path="/signup" element={P(<Auth mode="signup"/>)}/>
   <Route path="/community" element={P(<Community/>)}/><Route path="/discover" element={P(<Discover/>)}/>
   <Route path="/watchlist" element={P(<Watchlist/>)}/><Route path="/profile" element={P(<Profile/>)}/><Route path="*" element={<Navigate to="/home"/>}/>
  </Routes></Ctx.Provider></MotionConfig>}
