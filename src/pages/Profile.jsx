import {MOVIES,POSTS} from '../data';import {useStore} from '../App';

// Read the logged-in user saved by Auth.jsx at login
function getUser(){
  try{return JSON.parse(localStorage.getItem('cs_user'))||{};}
  catch{return {};}
}

export default function Profile(){
const {watch,liked}=useStore();const fav=MOVIES.slice(0,4);
const user=getUser();
const name=(user.name||user.fullName||user.username||(user.email?user.email.split('@')[0]:'')||'CineSphere User').trim();
const initial=name.charAt(0).toUpperCase();
return <section className="max-w-4xl"><div className="flex items-center gap-5"><span aria-hidden className="w-20 h-20 rounded-full bg-gradient-to-br from-pink to-cyan grid place-items-center text-ink text-3xl font-semibold">{initial}</span><div><h1 className="font-display text-2xl">{name}</h1><p className="text-slate-400 text-sm">{user.email||'CineSphere member'}</p></div></div>
<dl className="mt-6 flex gap-8"><div><dt className="text-xs text-slate-500">Watchlist</dt><dd className="text-xl">{watch.length}</dd></div><div><dt className="text-xs text-slate-500">Likes</dt><dd className="text-xl">{liked.length}</dd></div></dl>
<h2 className="mt-10 mb-3">Favorite movies</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{fav.map(m=><div key={m.id} style={{background:m.art}} className="aspect-[2/3] p-3 flex items-end text-xs font-display">{m.title}</div>)}</div>
<h2 className="mt-10 mb-3">Reviews and activity</h2><ul className="space-y-3">{POSTS.slice(0,3).map(p=><li key={p.id} className="glass p-4 text-sm">“{p.text}” <span className="text-slate-500">on {MOVIES.find(m=>m.id===p.movie).title}</span></li>)}</ul></section>}
