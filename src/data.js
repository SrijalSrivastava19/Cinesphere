const g=(a,b)=>`linear-gradient(160deg,${a},${b})`;
export const GENRES=['All','Sci-Fi','Drama','Action','Thriller','Fantasy'];
export const MOVIES=[
{id:1,title:'Interstellar',year:2014,genre:'Sci-Fi',rating:8.7,art:g('#ff6b8a','#05080d'),plot:'A crew travels through a wormhole to save humanity.'},
{id:2,title:'The Dark Knight',year:2008,genre:'Action',rating:9.0,art:g('#37d6e0','#05080d'),plot:'Batman faces the Joker in a battle for Gotham.'},
{id:3,title:'Dune: Part Two',year:2024,genre:'Sci-Fi',rating:8.5,art:g('#ff9a5a','#2a0d0d'),plot:'Paul Atreides unites the Fremen against House Harkonnen.'},
{id:4,title:'Parasite',year:2019,genre:'Thriller',rating:8.5,art:g('#7be0a8','#05080d'),plot:'Two families collide in a darkly funny class thriller.'},
{id:5,title:'Spirited Away',year:2001,genre:'Fantasy',rating:8.6,art:g('#8aa4ff','#05080d'),plot:'A girl enters a spirit world to free her parents.'},
{id:6,title:'Whiplash',year:2014,genre:'Drama',rating:8.5,art:g('#ffd166','#2a0d0d'),plot:'A drummer is pushed to the edge by his instructor.'},
{id:7,title:'Blade Runner 2049',year:2017,genre:'Sci-Fi',rating:8.0,art:g('#ff6b8a','#0d2a30'),plot:'A replicant blade runner uncovers a buried secret.'},
{id:8,title:'Oppenheimer',year:2023,genre:'Drama',rating:8.3,art:g('#ff9a5a','#05080d'),plot:'The story of the man behind the atomic bomb.'}];
export const POSTS=[
{id:1,user:'Aarav',time:'2h',movie:1,text:'Still thinking about this ending… a masterpiece.',likes:128,comments:34,type:'Reviews'},
{id:2,user:'Sana',time:'4h',movie:2,text:'Best villain ever? Let’s discuss.',likes:246,comments:52,type:'Discussions'},
{id:3,user:'Rohan',time:'6h',movie:3,text:'These visuals were insane. Denis is on another level.',likes:320,comments:68,type:'Reviews'},
{id:4,user:'Meera',time:'1d',movie:5,text:'Rewatched with my niece. Still magic.',likes:97,comments:21,type:'Following'}];
export const TRENDING=[['Best sci-fi movies of all time?','1.2K'],['Your most rewatchable film?','856'],['Favorite movie soundtracks?','642'],['CineSphere users’ top 10','420']];
