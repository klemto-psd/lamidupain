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
// GALERIES — génération automatique depuis galeries.js
// Tu modifies uniquement la liste "galerieItems" dans galeries.js.
// ============================================================
function initGalerie({category, dossier, gridSelector, lightboxSelector, dataName, label}){
  const items=(typeof galerieItems!=='undefined' ? galerieItems : []).filter(item=>item.category===category);
  const grid=document.querySelector(gridSelector);
  const lightbox=document.querySelector(lightboxSelector);
  if(!items.length || !grid || !lightbox) return;

  const src=file=>`${dossier}/${file}`;

  items.forEach((item,pos)=>{
    const btn=document.createElement('button');
    btn.className='piece-card reveal';
    btn.dataset[dataName]=pos;
    btn.setAttribute('aria-label',`Voir ${label.toLowerCase()} ${pos+1}`);
    btn.innerHTML=`<img src="${src(item.image)}" alt="${label} ${pos+1}" loading="lazy"><span>Voir en grand</span>`;
    grid.appendChild(btn);
    io.observe(btn);
  });

  const photos=[];
  items.forEach((item,pos)=>{
    photos.push({itemIndex:pos,src:src(item.image),angle:'',position:pos+1});
    (item.angles||[]).forEach((file,a)=>photos.push({itemIndex:pos,src:src(file),angle:`Autre angle ${a+1}`,position:pos+1}));
  });

  const image=lightbox.querySelector('.lightbox-image');
  const count=lightbox.querySelector('.lightbox-count');
  const angle=lightbox.querySelector('.lightbox-angle');
  let current=0;
  function render(){
    const p=photos[current];
    image.src=p.src; image.alt=`${label} ${p.position}${p.angle?' — '+p.angle.toLowerCase():''}`;
    count.textContent=`Réalisation ${p.position} / ${items.length}`;
    angle.textContent=p.angle;
  }
  function open(itemIndex){current=photos.findIndex(p=>p.itemIndex===itemIndex&&!p.angle);render();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-lock')}
  function close(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-lock')}
  function move(d){current=(current+d+photos.length)%photos.length;render()}

  grid.querySelectorAll(`[data-${dataName}]`).forEach(c=>c.addEventListener('click',()=>open(Number(c.dataset[dataName]))));
  lightbox.querySelector('.lightbox-close').onclick=close;
  lightbox.querySelector('.lightbox-prev').onclick=()=>move(-1);
  lightbox.querySelector('.lightbox-next').onclick=()=>move(1);
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)close()});
  addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
}

initGalerie({category:'piece-montee',dossier:'assets/pieces-montees',gridSelector:'#galerie-pieces .pieces-grid',lightboxSelector:'#piece-lightbox',dataName:'piece',label:'Pièce montée'});
initGalerie({category:'gateau',dossier:'assets/gateaux',gridSelector:'#galerie-gateaux .pieces-grid',lightboxSelector:'#gateau-lightbox',dataName:'gateau',label:'Gâteau'});
initGalerie({category:'patisserie',dossier:'assets/patisseries',gridSelector:'#galerie-patisseries .pieces-grid',lightboxSelector:'#patisserie-lightbox',dataName:'patisserie',label:'Pâtisserie'});
initGalerie({category:'traiteur',dossier:'assets/traiteur',gridSelector:'#galerie-traiteur .pieces-grid',lightboxSelector:'#traiteur-lightbox',dataName:'traiteur',label:'Traiteur'});


// ============================================================
// OFFRES & ACTUALITÉS — SANITY + vrai dépliant 2 volets
// ============================================================
(async()=>{
 const grid=document.querySelector('#flyers-grid');
 if(!grid)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const projectId='6c347qaw', dataset='production';
 const today=new Date().toISOString().slice(0,10);
 const query=`*[_type == "enCeMoment" && afficher == true && (!defined(dateDebut) || dateDebut <= $today) && (!defined(dateFin) || dateFin >= $today)] | order(ordre asc){_id,titre,categorie,description,"imageUrl":image.asset->url,"imageVersoUrl":imageVerso.asset->url}`;
 const url=`https://${projectId}.api.sanity.io/v2026-11-25/data/query/${dataset}?query=${encodeURIComponent(query)}&$today=${encodeURIComponent(JSON.stringify(today))}`;
 const localItems=()=>typeof flyerItems!=='undefined'?flyerItems.map(item=>({titre:item.titre,categorie:item.categorie,description:item.texte||'',telephone:item.telephone||'',imageUrl:item.image?`assets/flyers/${item.image}`:'',imageVersoUrl:item.imageVerso?`assets/flyers/${item.imageVerso}`:''})):[];
 let items=[];
 try{const r=await fetch(url);if(!r.ok)throw new Error(`Sanity ${r.status}`);const d=await r.json();items=(d.result||[]).filter(x=>x.imageUrl)}catch(e){console.warn('Sanity indisponible, offres locales utilisées.',e)}
 if(!items.length)items=localItems();
 grid.innerHTML=items.map((item,i)=>{const tel=String(item.telephone||'').replace(/\s/g,'');return `<article class="flyer-card"><button class="flyer-visual" data-flyer="${i}" type="button" aria-label="Voir ${esc(item.titre)} en grand">${item.imageUrl?`<img src="${esc(item.imageUrl)}" alt="${esc(item.titre)} — L’Ami du Pain" loading="lazy">`:''}</button><div class="flyer-info">${item.categorie?`<span class="flyer-tag">${esc(item.categorie)}</span>`:''}<h3>${esc(item.titre)}</h3>${item.description?`<p>${esc(item.description)}</p>`:''}${tel?`<a class="flyer-call-btn" href="tel:${esc(tel)}">☎ ${esc(item.telephone)}</a>`:''}</div></article>`}).join('');

 const box=document.querySelector('#flyer-lightbox'); if(!box)return;
 const book=box.querySelector('#flyer-book'), recto=box.querySelector('.flyer-recto'), verso=box.querySelector('.flyer-verso');
 const coverFront=box.querySelector('.brochure-cover-front'), coverBack=box.querySelector('.brochure-cover-back');
 const closeBtn=box.querySelector('.flyer-lightbox-close'), openBtn=box.querySelector('.flyer-open-btn'), flipBtn=box.querySelector('.flyer-flip-btn'), hint=box.querySelector('.flyer-hint');
 if(!book||!recto||!verso||!coverFront||!coverBack)return;
 let current=null,state='closed';

 function setBg(el,url,pos){el.style.backgroundImage=`url("${String(url).replace(/"/g,'\\"')}")`;el.style.backgroundPosition=pos}
 function renderState(){
   const hasVerso=!!current?.imageVersoUrl;
   book.classList.toggle('single-flyer',!hasVerso);
   book.classList.remove('is-closed','is-open','show-outside');
   if(!hasVerso){book.classList.add('single-flyer');openBtn.hidden=true;flipBtn.hidden=true;hint.hidden=true;return}
   openBtn.hidden=false;hint.hidden=false;
   if(state==='closed'){
     book.classList.add('is-closed');openBtn.textContent='Ouvrir le flyer';flipBtn.hidden=true;
     hint.textContent='Le flyer est plié : vous voyez la page 1 (couverture)';
   }else if(state==='open'){
     book.classList.add('is-open');openBtn.textContent='Refermer le flyer';flipBtn.hidden=false;flipBtn.textContent='Voir l’extérieur (pages 4–1)';
     hint.textContent='Flyer ouvert : pages 2 et 3';
   }else{
     book.classList.add('show-outside');openBtn.textContent='Refermer le flyer';flipBtn.hidden=false;flipBtn.textContent='Revenir à l’intérieur (pages 2–3)';
     hint.textContent='Extérieur du flyer : page 4 à gauche, page 1 à droite';
   }
 }
 function openItem(item){
   if(!item?.imageUrl)return; current=item;state=item.imageVersoUrl?'closed':'open';
   recto.src=item.imageUrl;recto.alt=`${item.titre} — extérieur pages 4 et 1`;
   if(item.imageVersoUrl){
     verso.src=item.imageVersoUrl;verso.alt=`${item.titre} — intérieur pages 2 et 3`;
     setBg(coverFront,item.imageUrl,'right center');
     setBg(coverBack,item.imageVersoUrl,'left center');
   }else{verso.removeAttribute('src');coverFront.style.backgroundImage='none';coverBack.style.backgroundImage='none'}
   renderState();box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.classList.add('flyer-lightbox-lock');
 }
 function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.classList.remove('flyer-lightbox-lock');current=null;state='closed'}
 function toggleOpen(){if(!current?.imageVersoUrl)return;if(state==='closed')state='open';else if(state==='open'||state==='outside')state='closed';renderState()}
 function toggleOutside(){if(!current?.imageVersoUrl||state==='closed')return;state=state==='outside'?'open':'outside';renderState()}
 grid.querySelectorAll('.flyer-visual').forEach(b=>b.addEventListener('click',()=>openItem(items[Number(b.dataset.flyer)])));
 openBtn?.addEventListener('click',toggleOpen);flipBtn?.addEventListener('click',toggleOutside);closeBtn?.addEventListener('click',close);
 box.addEventListener('click',e=>{if(e.target===box)close()});
 book.addEventListener('keydown',e=>{if(e.key==='Enter'&&current?.imageVersoUrl){e.preventDefault();toggleOpen()}});
 addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight'&&state==='open')toggleOutside();if(e.key==='ArrowLeft'&&state==='outside')toggleOutside()});
})();

// Photo de la section "Une boulangerie familiale" gérée depuis galeries.js
(function () {
  const photo = document.querySelector('.family-photo');
  if (photo && typeof photoBoulangerieFamiliale !== 'undefined' && photoBoulangerieFamiliale) {
    photo.style.setProperty('background-image', `url("assets/${photoBoulangerieFamiliale}")`, 'important');
  }
})();
