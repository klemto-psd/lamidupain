const menu=document.querySelector('.menu'),nav=document.querySelector('.nav nav');menu.addEventListener('click',()=>nav.classList.toggle('open'));document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('on')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
// V1.3 carousel
const track=document.querySelector('.carousel-track');
if(track){
 const slides=[...track.children], dots=document.querySelector('.carousel-dots'), prev=document.querySelector('.carousel-btn.prev'), next=document.querySelector('.carousel-btn.next'), carousel=document.querySelector('.carousel');
 let index=0,timer;
 const perView=()=>innerWidth<=850?1:3;
 const maxIndex=()=>Math.max(0,slides.length-perView());
 function buildDots(){dots.innerHTML='';for(let i=0;i<=maxIndex();i++){const b=document.createElement('button');b.setAttribute('aria-label','Afficher les avis suivants');b.onclick=()=>go(i);dots.appendChild(b)}}
 function go(i){index=i<0?maxIndex():i>maxIndex()?0:i;const gap=20;const w=slides[0].getBoundingClientRect().width;track.style.transform=`translateX(-${index*(w+gap)}px)`;[...dots.children].forEach((d,n)=>d.classList.toggle('active',n===index))}
 function auto(){clearInterval(timer);timer=setInterval(()=>go(index+1),5000)}
 prev.onclick=()=>{go(index-1);auto()};next.onclick=()=>{go(index+1);auto()};
 carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',auto);
 let sx=0;carousel.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45){go(index+(dx<0?1:-1));auto()}},{passive:true});
 addEventListener('resize',()=>{buildDots();index=Math.min(index,maxIndex());go(index)});
 buildDots();go(0);auto();
}


// ============================================================
// SANITY — CONFIGURATION COMMUNE
// ============================================================
const SANITY_PROJECT='6c347qaw';
const SANITY_DATASET='production';
async function sanityQuery(query){
  const url=`https://${SANITY_PROJECT}.api.sanity.io/v2026-11-25/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const r=await fetch(url); if(!r.ok) throw new Error(`Sanity ${r.status}`); return (await r.json()).result||[];
}

// ============================================================
// BANDEAU VACANCES / FERMETURE
// ============================================================
(async()=>{
 const bar=document.querySelector('#vacation-banner'); if(!bar)return;
 try{
  const rows=await sanityQuery(`*[_type=="fermeture" && actif==true] | order(dateDebut asc){titre,message,dateDebut,dateFin,afficherDesMaintenant}`);
  const today=new Date().toISOString().slice(0,10);
  const item=rows.find(x=>x.dateFin>=today && (x.afficherDesMaintenant || x.dateDebut<=today));
  if(!item)return;
  const fmt=d=>new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(new Date(d+'T12:00:00'));
  bar.innerHTML=`<strong>${item.titre||'Fermeture exceptionnelle'}</strong><span>${item.message||''} <b>Du ${fmt(item.dateDebut)} au ${fmt(item.dateFin)} inclus.</b></span>`;
  bar.hidden=false;
 }catch(e){console.warn('Bandeau fermeture indisponible',e)}
})();

// ============================================================
// GALERIES — SANITY AVEC SECOURS LOCAL galeries.js
// ============================================================
async function initGalerie({type,category,dossier,gridSelector,lightboxSelector,dataName,label}){
 const grid=document.querySelector(gridSelector), lightbox=document.querySelector(lightboxSelector); if(!grid||!lightbox)return;
 let items=[];
 try{
   const remote=await sanityQuery(`*[_type=="${type}" && afficher!=false] | order(ordre asc){titre,"imageUrl":image.asset->url,"anglesUrls":angles[].asset->url}`);
   if(remote.length) items=remote.map(x=>({imageUrl:x.imageUrl,anglesUrls:x.anglesUrls||[]}));
 }catch(e){console.warn(`Galerie ${type}: secours local`,e)}
 if(!items.length && typeof galerieItems!=='undefined'){
   items=galerieItems.filter(x=>x.category===category).map(x=>({imageUrl:`${dossier}/${x.image}`,anglesUrls:(x.angles||[]).map(a=>`${dossier}/${a}`)}));
 }
 if(!items.length)return;
 grid.innerHTML='';
 items.forEach((item,pos)=>{const b=document.createElement('button');b.className='piece-card reveal';b.dataset[dataName]=pos;b.innerHTML=`<img src="${item.imageUrl}" alt="${label} ${pos+1}" loading="lazy"><span>Voir en grand</span>`;grid.appendChild(b);io.observe(b)});
 const photos=[]; items.forEach((x,i)=>{photos.push({itemIndex:i,src:x.imageUrl,angle:'',position:i+1});x.anglesUrls.forEach((u,a)=>photos.push({itemIndex:i,src:u,angle:`Autre angle ${a+1}`,position:i+1}))});
 const image=lightbox.querySelector('.lightbox-image'),count=lightbox.querySelector('.lightbox-count'),angle=lightbox.querySelector('.lightbox-angle');let current=0;
 const render=()=>{const x=photos[current];image.src=x.src;image.alt=`${label} ${x.position}`;if(count)count.textContent=`Réalisation ${x.position} / ${items.length}`;if(angle)angle.textContent=x.angle};
 const open=i=>{current=photos.findIndex(x=>x.itemIndex===i&&!x.angle);if(current<0)current=0;render();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-lock')};
 const close=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-lock')};
 const move=d=>{current=(current+d+photos.length)%photos.length;render()};
 grid.querySelectorAll(`[data-${dataName}]`).forEach(c=>c.onclick=()=>open(Number(c.dataset[dataName])));
 lightbox.querySelector('.lightbox-close').onclick=close;lightbox.querySelector('.lightbox-prev').onclick=()=>move(-1);lightbox.querySelector('.lightbox-next').onclick=()=>move(1);
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});
 addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
}
initGalerie({type:'pieceMontee',category:'piece-montee',dossier:'assets/pieces-montees',gridSelector:'#galerie-pieces .pieces-grid',lightboxSelector:'#piece-lightbox',dataName:'piece',label:'Pièce montée'});
initGalerie({type:'gateau',category:'gateau',dossier:'assets/gateaux',gridSelector:'#galerie-gateaux .pieces-grid',lightboxSelector:'#gateau-lightbox',dataName:'gateau',label:'Gâteau'});
initGalerie({type:'patisserie',category:'patisserie',dossier:'assets/patisseries',gridSelector:'#galerie-patisseries .pieces-grid',lightboxSelector:'#patisserie-lightbox',dataName:'patisserie',label:'Pâtisserie'});
initGalerie({type:'traiteur',category:'traiteur',dossier:'assets/traiteur',gridSelector:'#galerie-traiteur .pieces-grid',lightboxSelector:'#traiteur-lightbox',dataName:'traiteur',label:'Traiteur'});

// ============================================================
// EN CE MOMENT — SANITY + DÉPLIANT 2 VOLETS
// ============================================================
(async()=>{
 const grid=document.querySelector('#flyers-grid');if(!grid)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let items=[];
 try{const today=new Date().toISOString().slice(0,10);items=await sanityQuery(`*[_type=="enCeMoment" && afficher==true && (!defined(dateDebut)||dateDebut<="${today}") && (!defined(dateFin)||dateFin>="${today}")] | order(ordre asc){titre,categorie,description,"imageUrl":image.asset->url,"imageVersoUrl":imageVerso.asset->url}`)}catch(e){console.warn('Sanity offres indisponible',e)}
 if(!items.length && typeof flyerItems!=='undefined') items=flyerItems.map(x=>({titre:x.titre,categorie:x.categorie,description:x.texte,imageUrl:`assets/flyers/${x.image}`,imageVersoUrl:null}));
 grid.innerHTML=items.map((x,i)=>`<article class="flyer-card"><button class="flyer-visual" data-flyer="${i}" type="button"><img src="${esc(x.imageUrl)}" alt="${esc(x.titre)}" loading="lazy"></button><div class="flyer-info"><span class="flyer-tag">${esc(x.categorie||'Actualité')}</span><h3>${esc(x.titre)}</h3>${x.description?`<p>${esc(x.description)}</p>`:''}</div></article>`).join('');
 const box=document.querySelector('#flyer-lightbox');if(!box)return;const brochure=box.querySelector('#brochure'),inside=box.querySelector('.brochure-inside'),front=box.querySelector('.brochure-cover-front'),back=box.querySelector('.brochure-cover-back'),openBtn=box.querySelector('.brochure-open'),outsideBtn=box.querySelector('.brochure-outside'),closeBtn=box.querySelector('.flyer-lightbox-close');let current=null,opened=false,outside=false;
 const bg=(el,url,pos,size='200% 100%')=>{el.style.backgroundImage=`url("${url}")`;el.style.backgroundSize=size;el.style.backgroundPosition=pos;el.style.backgroundRepeat='no-repeat'};
 function setState(){brochure.classList.toggle('is-open',opened);brochure.classList.toggle('show-outside',outside);openBtn.textContent=opened?'Refermer le flyer':'Ouvrir le flyer';outsideBtn.hidden=!opened;outsideBtn.textContent=outside?'Voir l’intérieur (pages 2–3)':'Voir l’extérieur (pages 4–1)'}
 function openViewer(x){current=x;opened=false;outside=false;box.classList.add('open');document.body.classList.add('flyer-lightbox-lock');box.setAttribute('aria-hidden','false');if(x.imageVersoUrl){brochure.classList.remove('simple-flyer');bg(front,x.imageUrl,'right center');bg(back,x.imageVersoUrl,'left center');bg(inside,x.imageVersoUrl,'center','100% 100%');openBtn.hidden=false}else{brochure.classList.add('simple-flyer');bg(inside,x.imageUrl,'center','contain');openBtn.hidden=true;outsideBtn.hidden=true}setState()}
 function close(){box.classList.remove('open');document.body.classList.remove('flyer-lightbox-lock');box.setAttribute('aria-hidden','true')}
 grid.querySelectorAll('.flyer-visual').forEach(b=>b.onclick=()=>openViewer(items[Number(b.dataset.flyer)]));
 openBtn.onclick=()=>{opened=!opened;if(!opened)outside=false;setState()};outsideBtn.onclick=()=>{outside=!outside;setState()};closeBtn.onclick=close;box.addEventListener('click',e=>{if(e.target===box)close()});addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('open'))close()});
})();

// Photo familiale locale conservée
(function(){const photo=document.querySelector('.family-photo');if(photo&&typeof photoBoulangerieFamiliale!=='undefined'&&photoBoulangerieFamiliale)photo.style.setProperty('background-image',`url("assets/${photoBoulangerieFamiliale}")`,'important')})();
