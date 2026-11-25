// ============================================================
// MENU MOBILE
// ============================================================

const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  document.querySelectorAll('.nav nav a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}


// ============================================================
// ANIMATIONS AU SCROLL
// ============================================================

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('on');
      }
    });
  },
  {
    threshold: 0.12
  }
);

document.querySelectorAll('.reveal').forEach(element => {
  io.observe(element);
});


// ============================================================
// CAROUSEL AVIS
// ============================================================

const track = document.querySelector('.carousel-track');

if (track) {

  const slides = [...track.children];
  const dots = document.querySelector('.carousel-dots');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const carousel = document.querySelector('.carousel');

  let index = 0;
  let timer;

  const perView = () => innerWidth <= 850 ? 1 : 3;

  const maxIndex = () =>
    Math.max(0, slides.length - perView());

  function buildDots() {

    if (!dots) return;

    dots.innerHTML = '';

    for (let i = 0; i <= maxIndex(); i++) {

      const button = document.createElement('button');

      button.setAttribute(
        'aria-label',
        'Afficher les avis suivants'
      );

      button.onclick = () => go(i);

      dots.appendChild(button);
    }
  }

  function go(i) {

    if (!slides.length) return;

    index =
      i < 0
        ? maxIndex()
        : i > maxIndex()
          ? 0
          : i;

    const gap = 20;

    const width =
      slides[0].getBoundingClientRect().width;

    track.style.transform =
      `translateX(-${index * (width + gap)}px)`;

    if (dots) {
      [...dots.children].forEach((dot, n) => {
        dot.classList.toggle(
          'active',
          n === index
        );
      });
    }
  }

  function auto() {
    clearInterval(timer);

    timer = setInterval(() => {
      go(index + 1);
    }, 5000);
  }

  if (prev) {
    prev.onclick = () => {
      go(index - 1);
      auto();
    };
  }

  if (next) {
    next.onclick = () => {
      go(index + 1);
      auto();
    };
  }

  if (carousel) {

    carousel.addEventListener(
      'mouseenter',
      () => clearInterval(timer)
    );

    carousel.addEventListener(
      'mouseleave',
      auto
    );

    let sx = 0;

    carousel.addEventListener(
      'touchstart',
      e => {
        sx = e.touches[0].clientX;
      },
      {
        passive: true
      }
    );

    carousel.addEventListener(
      'touchend',
      e => {

        const dx =
          e.changedTouches[0].clientX - sx;

        if (Math.abs(dx) > 45) {

          go(
            index +
            (dx < 0 ? 1 : -1)
          );

          auto();
        }
      },
      {
        passive: true
      }
    );
  }

  addEventListener(
    'resize',
    () => {

      buildDots();

      index = Math.min(
        index,
        maxIndex()
      );

      go(index);
    }
  );

  buildDots();
  go(0);
  auto();
}


// ============================================================
// GALERIES
// Génération automatique depuis galeries.js
// ============================================================

function initGalerie({
  category,
  dossier,
  gridSelector,
  lightboxSelector,
  dataName,
  label
}) {

  const items =
    (
      typeof galerieItems !== 'undefined'
        ? galerieItems
        : []
    ).filter(
      item => item.category === category
    );

  const grid =
    document.querySelector(gridSelector);

  const lightbox =
    document.querySelector(lightboxSelector);

  if (
    !items.length ||
    !grid ||
    !lightbox
  ) {
    return;
  }

  const src =
    file => `${dossier}/${file}`;


  // ----------------------------------------------------------
  // CRÉATION DES CARTES
  // ----------------------------------------------------------

  items.forEach(
    (item, pos) => {

      const btn =
        document.createElement('button');

      btn.className =
        'piece-card reveal';

      btn.dataset[dataName] = pos;

      btn.setAttribute(
        'aria-label',
        `Voir ${label.toLowerCase()} ${pos + 1}`
      );

      btn.innerHTML = `
        <img
          src="${src(item.image)}"
          alt="${label} ${pos + 1}"
          loading="lazy"
        >

        <span>
          Voir en grand
        </span>
      `;

      grid.appendChild(btn);

      io.observe(btn);
    }
  );


  // ----------------------------------------------------------
  // PHOTOS + ANGLES
  // ----------------------------------------------------------

  const photos = [];

  items.forEach(
    (item, pos) => {

      photos.push({
        itemIndex: pos,
        src: src(item.image),
        angle: '',
        position: pos + 1
      });

      (item.angles || []).forEach(
        (file, angleIndex) => {

          photos.push({
            itemIndex: pos,
            src: src(file),
            angle:
              `Autre angle ${angleIndex + 1}`,
            position: pos + 1
          });
        }
      );
    }
  );


  const image =
    lightbox.querySelector(
      '.lightbox-image'
    );

  const count =
    lightbox.querySelector(
      '.lightbox-count'
    );

  const angle =
    lightbox.querySelector(
      '.lightbox-angle'
    );

  let current = 0;


  function render() {

    const photo =
      photos[current];

    if (!photo) return;

    if (image) {

      image.src =
        photo.src;

      image.alt =
        `${label} ${photo.position}${
          photo.angle
            ? ' — ' +
              photo.angle.toLowerCase()
            : ''
        }`;
    }

    if (count) {

      count.textContent =
        `Réalisation ${photo.position} / ${items.length}`;
    }

    if (angle) {

      angle.textContent =
        photo.angle;
    }
  }


  function open(itemIndex) {

    current =
      photos.findIndex(
        photo =>
          photo.itemIndex === itemIndex &&
          !photo.angle
      );

    if (current < 0) {
      current = 0;
    }

    render();

    lightbox.classList.add('open');

    lightbox.setAttribute(
      'aria-hidden',
      'false'
    );

    document.body.classList.add(
      'lightbox-lock'
    );
  }


  function close() {

    lightbox.classList.remove('open');

    lightbox.setAttribute(
      'aria-hidden',
      'true'
    );

    document.body.classList.remove(
      'lightbox-lock'
    );
  }


  function move(direction) {

    current =
      (
        current +
        direction +
        photos.length
      ) % photos.length;

    render();
  }


  grid
    .querySelectorAll(
      `[data-${dataName}]`
    )
    .forEach(card => {

      card.addEventListener(
        'click',
        () => {

          open(
            Number(
              card.dataset[dataName]
            )
          );
        }
      );
    });


  const closeButton =
    lightbox.querySelector(
      '.lightbox-close'
    );

  const prevButton =
    lightbox.querySelector(
      '.lightbox-prev'
    );

  const nextButton =
    lightbox.querySelector(
      '.lightbox-next'
    );


  if (closeButton) {
    closeButton.onclick =
      close;
  }

  if (prevButton) {
    prevButton.onclick =
      () => move(-1);
  }

  if (nextButton) {
    nextButton.onclick =
      () => move(1);
  }


  lightbox.addEventListener(
    'click',
    e => {

      if (e.target === lightbox) {
        close();
      }
    }
  );


  addEventListener(
    'keydown',
    e => {

      if (
        !lightbox.classList.contains(
          'open'
        )
      ) {
        return;
      }

      if (e.key === 'Escape') {
        close();
      }

      if (e.key === 'ArrowLeft') {
        move(-1);
      }

      if (e.key === 'ArrowRight') {
        move(1);
      }
    }
  );
}


// ============================================================
// INITIALISATION DES GALERIES
// ============================================================

initGalerie({
  category: 'piece-montee',
  dossier: 'assets/pieces-montees',
  gridSelector:
    '#galerie-pieces .pieces-grid',
  lightboxSelector:
    '#piece-lightbox',
  dataName: 'piece',
  label: 'Pièce montée'
});

initGalerie({
  category: 'gateau',
  dossier: 'assets/gateaux',
  gridSelector:
    '#galerie-gateaux .pieces-grid',
  lightboxSelector:
    '#gateau-lightbox',
  dataName: 'gateau',
  label: 'Gâteau'
});

initGalerie({
  category: 'patisserie',
  dossier: 'assets/patisseries',
  gridSelector:
    '#galerie-patisseries .pieces-grid',
  lightboxSelector:
    '#patisserie-lightbox',
  dataName: 'patisserie',
  label: 'Pâtisserie'
});

initGalerie({
  category: 'traiteur',
  dossier: 'assets/traiteur',
  gridSelector:
    '#galerie-traiteur .pieces-grid',
  lightboxSelector:
    '#traiteur-lightbox',
  dataName: 'traiteur',
  label: 'Traiteur'
});


// ============================================================
// OFFRES & ACTUALITÉS — SANITY
// image = RECTO / imageVerso = VERSO FACULTATIF
// ============================================================

(async () => {

  const grid =
    document.querySelector(
      '#flyers-grid'
    );

  if (!grid) return;


  // ----------------------------------------------------------
  // CONFIGURATION SANITY
  // ----------------------------------------------------------

  const projectId =
    '6c347qaw';

  const dataset =
    'production';

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);


  // ----------------------------------------------------------
  // REQUÊTE SANITY
  // ----------------------------------------------------------

  const query = `*[
    _type == "enCeMoment" &&
    afficher == true &&
    (!defined(dateDebut) || dateDebut <= $today) &&
    (!defined(dateFin) || dateFin >= $today)
  ] | order(ordre asc) {
    _id,
    titre,
    categorie,
    description,
    "imageUrl": image.asset->url,
    "imageVersoUrl": imageVerso.asset->url
  }`;


  const url =
    `https://${projectId}.api.sanity.io/v2026-11-25/data/query/${dataset}` +
    `?query=${encodeURIComponent(query)}` +
    `&$today=${encodeURIComponent(JSON.stringify(today))}`;


  // ----------------------------------------------------------
  // SÉCURISATION DU TEXTE HTML
  // ----------------------------------------------------------

  const esc = s =>
    String(s ?? '').replace(
      /[&<>"']/g,
      c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[c])
    );


  try {

    // --------------------------------------------------------
    // CHARGEMENT SANITY
    // --------------------------------------------------------

    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Erreur Sanity : ${response.status}`
      );
    }


    const data =
      await response.json();


    const items =
      data.result || [];


    // --------------------------------------------------------
    // CRÉATION DES CARTES
    // --------------------------------------------------------

    grid.innerHTML =
      items.map(
        (item, i) => `

          <article class="flyer-card">

            <button
              class="flyer-visual"
              data-flyer="${i}"
              type="button"
              aria-label="Voir ${esc(item.titre)} en grand"
            >

              ${
                item.imageUrl
                  ? `
                    <img
                      src="${esc(item.imageUrl)}"
                      alt="${esc(item.titre)} — L’Ami du Pain"
                      loading="lazy"
                    >
                  `
                  : ''
              }

            </button>


            <div class="flyer-info">

              ${
                item.categorie
                  ? `
                    <span class="flyer-tag">
                      ${esc(item.categorie)}
                    </span>
                  `
                  : ''
              }


              <h3>
                ${esc(item.titre)}
              </h3>


              ${
                item.description
                  ? `
                    <p>
                      ${esc(item.description)}
                    </p>
                  `
                  : ''
              }

            </div>

          </article>

        `
      )
      .join('');


    // ========================================================
    // LIGHTBOX DU FLYER
    // ========================================================

    const box =
      document.querySelector(
        '#flyer-lightbox'
      );


    if (!box) return;


    const book =
      box.querySelector(
        '#flyer-book'
      );


    const rectoImage =
      box.querySelector(
        '.flyer-recto'
      );


    const versoImage =
      box.querySelector(
        '.flyer-verso'
      );


    const closeBtn =
      box.querySelector(
        '.flyer-lightbox-close'
      );


    const openBtn =
      box.querySelector(
        '.flyer-open-btn'
      );


    const sideBtn =
      box.querySelector(
        '.flyer-side-btn'
      );


    const hint =
      box.querySelector(
        '.flyer-hint'
      );


    const controls =
      box.querySelector(
        '.flyer-controls'
      );


    if (
      !book ||
      !rectoImage ||
      !versoImage
    ) {

      console.error(
        'Structure HTML du flyer introuvable.'
      );

      return;
    }


    let currentItem =
      null;


    let isBack =
      false;


    // ========================================================
    // MISE À JOUR DES BOUTONS
    // ========================================================

    function updateControls() {

      const hasVerso =
        Boolean(
          currentItem?.imageVersoUrl
        );


      if (controls) {

        controls.style.display =
          hasVerso
            ? 'flex'
            : 'none';
      }


      if (openBtn) {

        openBtn.style.display =
          hasVerso
            ? ''
            : 'none';


        openBtn.textContent =
          isBack
            ? 'Revenir au recto'
            : 'Ouvrir le flyer';
      }


      if (sideBtn) {

        sideBtn.style.display =
          hasVerso
            ? ''
            : 'none';


        sideBtn.textContent =
          isBack
            ? 'Voir le recto'
            : 'Voir le verso';


        sideBtn.classList.toggle(
          'active',
          isBack
        );
      }


      if (hint) {

        hint.style.display =
          hasVerso
            ? ''
            : 'none';


        hint.textContent =
          isBack
            ? 'Intérieur du flyer — cliquez pour revenir au recto'
            : 'Cliquez sur le flyer pour l’ouvrir';
      }
    }


    // ========================================================
    // REMISE À ZÉRO
    // ========================================================

    function resetBook() {

      isBack =
        false;


      book.classList.remove(
        'show-back',
        'flyer-opening'
      );


      requestAnimationFrame(
        () => {

          book.classList.add(
            'flyer-opening'
          );

        }
      );


      updateControls();
    }


    // ========================================================
    // RECTO / VERSO
    // ========================================================

    function setSide(back) {

      if (
        !currentItem?.imageVersoUrl
      ) {

        return;
      }


      isBack =
        back;


      book.classList.toggle(
        'show-back',
        isBack
      );


      updateControls();
    }


    function toggleSide() {

      setSide(
        !isBack
      );
    }


    // ========================================================
    // OUVERTURE
    // ========================================================

    function open(item) {

      if (
        !item ||
        !item.imageUrl
      ) {

        return;
      }


      currentItem =
        item;


      isBack =
        false;


      // RECTO

      rectoImage.src =
        item.imageUrl;


      rectoImage.alt =
        `${item.titre} — Recto`;


      // VERSO

      if (
        item.imageVersoUrl
      ) {

        versoImage.src =
          item.imageVersoUrl;


        versoImage.alt =
          `${item.titre} — Verso`;

      } else {

        versoImage.removeAttribute(
          'src'
        );


        versoImage.alt =
          '';
      }


      resetBook();


      box.classList.add(
        'open'
      );


      box.setAttribute(
        'aria-hidden',
        'false'
      );


      document.body.classList.add(
        'flyer-lightbox-lock'
      );
    }


    // ========================================================
    // FERMETURE
    // ========================================================

    function close() {

      box.classList.remove(
        'open'
      );


      box.setAttribute(
        'aria-hidden',
        'true'
      );


      document.body.classList.remove(
        'flyer-lightbox-lock'
      );


      book.classList.remove(
        'show-back',
        'flyer-opening'
      );


      rectoImage.removeAttribute(
        'src'
      );


      versoImage.removeAttribute(
        'src'
      );


      currentItem =
        null;


      isBack =
        false;
    }


    // ========================================================
    // CLIC SUR UNE OFFRE
    // ========================================================

    grid
      .querySelectorAll(
        '.flyer-visual'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              const flyerIndex =
                Number(
                  button.dataset.flyer
                );


              open(
                items[flyerIndex]
              );
            }
          );
        }
      );


    // ========================================================
    // BOUTON FERMER
    // ========================================================

    if (closeBtn) {

      closeBtn.addEventListener(
        'click',
        close
      );
    }


    // ========================================================
    // BOUTON "OUVRIR LE FLYER"
    // ========================================================

    if (openBtn) {

      openBtn.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          toggleSide();
        }
      );
    }


    // ========================================================
    // BOUTON RECTO / VERSO
    // ========================================================

    if (sideBtn) {

      sideBtn.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          toggleSide();
        }
      );
    }


    // ========================================================
    // CLIC DIRECTEMENT SUR LE FLYER
    // ========================================================

    book.addEventListener(
      'click',
      e => {

        e.stopPropagation();


        if (
          currentItem?.imageVersoUrl
        ) {

          toggleSide();
        }
      }
    );


    // ========================================================
    // CLIC SUR LE FOND NOIR
    // ========================================================

    box.addEventListener(
      'click',
      e => {

        if (
          e.target === box ||
          e.target.classList.contains(
            'flyer-viewer'
          )
        ) {

          close();
        }
      }
    );


    // ========================================================
    // CLAVIER
    // ========================================================

    addEventListener(
      'keydown',
      e => {

        if (
          !box.classList.contains(
            'open'
          )
        ) {

          return;
        }


        // ESC = FERMER

        if (
          e.key === 'Escape'
        ) {

          close();

          return;
        }


        if (
          !currentItem?.imageVersoUrl
        ) {

          return;
        }


        // DROITE = VERSO

        if (
          e.key === 'ArrowRight'
        ) {

          setSide(
            true
          );
        }


        // GAUCHE = RECTO

        if (
          e.key === 'ArrowLeft'
        ) {

          setSide(
            false
          );
        }
      }
    );


  } catch (error) {

    console.error(
      'Impossible de charger les actualités Sanity :',
      error
    );
  }

})();


// ============================================================
// PHOTO "UNE BOULANGERIE FAMILIALE"
// Gérée depuis galeries.js
// ============================================================

(function () {

  const photo =
    document.querySelector(
      '.family-photo'
    );


  if (
    photo &&
    typeof photoBoulangerieFamiliale !== 'undefined' &&
    photoBoulangerieFamiliale
  ) {

    photo.style.setProperty(
      'background-image',
      `url("assets/${photoBoulangerieFamiliale}")`,
      'important'
    );
  }

})();