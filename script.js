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
// OFFRES & ACTUALITÉS — génération automatique depuis galeries.js
// Modifie uniquement "flyerItems" dans galeries.js.
// ============================================================
(()=>{
 const grid=document.querySelector('#flyers-grid');
 if(!grid || typeof flyerItems==='undefined') return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 grid.innerHTML=flyerItems.map((item,i)=>{
   const tel=String(item.telephone||'').replace(/\s/g,'');
   const info=`<span class="flyer-tag">${esc(item.categorie)}</span><h3>${esc(item.titre)}</h3>${item.texte?`<p>${esc(item.texte)}</p>`:''}${item.texte2?`<p class="pizza-reserve">${esc(item.texte2)}</p>`:''}${tel?`<a class="flyer-call-btn" href="tel:${esc(tel)}" aria-label="Appeler pour réserver">☎ ${esc(item.telephone)}</a>`:''}`;
   const noel=String(item.image||'').toLowerCase().includes('noel');
   const placeholder=noel?'Collection de Noël':item.titre;
   return `<article class="flyer-card${tel?' flyer-card-featured':''}${noel?' flyer-seasonal':''}"><div class="flyer-visual" data-flyer="${i}"><img src="assets/flyers/${esc(item.image)}" alt="${esc(item.titre)} — L’Ami du Pain" onerror="this.style.display='none'"><div class="flyer-placeholder"><span>✦</span><strong>${esc(placeholder)}</strong><small>Ajoutez ${esc(item.image)} dans assets/flyers</small></div></div><div class="flyer-info">${info}</div></article>`;
 }).join('');

 const box=document.querySelector('#flyer-lightbox');
 if(!box)return;
 const big=box.querySelector('.flyer-lightbox-image');
 const closeBtn=box.querySelector('.flyer-lightbox-close');
 const open=(img)=>{if(!img || getComputedStyle(img).display==='none')return;big.src=img.src;big.alt=img.alt;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.classList.add('flyer-lightbox-lock')};
 const close=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.classList.remove('flyer-lightbox-lock');big.src=''};
 document.querySelectorAll('.flyer-visual img').forEach(img=>img.addEventListener('click',()=>open(img)));
 closeBtn.addEventListener('click',close);
 box.addEventListener('click',e=>{if(e.target===box)close()});
 addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('open'))close()});
})();

// Photo de la section "Une boulangerie familiale" gérée depuis galeries.js
(function () {
  const photo = document.querySelector('.family-photo');
  if (photo && typeof photoBoulangerieFamiliale !== 'undefined' && photoBoulangerieFamiliale) {
    photo.style.setProperty('background-image', `url("assets/${photoBoulangerieFamiliale}")`, 'important');
  }
})();
