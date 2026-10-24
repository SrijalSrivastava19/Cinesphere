import {useEffect,useRef} from 'react';
export default function ParticleBackground(){const r=useRef();useEffect(()=>{const c=r.current,x=c.getContext('2d');let w,h,id;const rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const rs=()=>{w=c.width=innerWidth;h=c.height=innerHeight};rs();addEventListener('resize',rs);
 const p=Array.from({length:90},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.2,v:Math.random()*.15+.03,c:Math.random()>.7?'#ff6b8a':'#9fe8ee'}));
 const f=()=>{x.clearRect(0,0,w,h);p.forEach(q=>{x.globalAlpha=.6;x.fillStyle=q.c;x.beginPath();x.arc(q.x,q.y,q.r,0,7);x.fill();if(!rm){q.x+=q.v;if(q.x>w)q.x=0}});id=requestAnimationFrame(f)};f();
 return()=>{cancelAnimationFrame(id);removeEventListener('resize',rs)}},[]);
 return <canvas ref={r} aria-hidden className="fixed inset-0 z-0 pointer-events-none"/>}
