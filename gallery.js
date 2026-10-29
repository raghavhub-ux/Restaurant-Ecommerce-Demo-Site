// The Saffron Plate - Gallery & Lightbox Logic
document.addEventListener('DOMContentLoaded', () => {
  const ITEMS = [
    { id: 'g1', title: 'The Starlit Rooftop Terrace', cat: 'terrace', badge: 'Terrace & View', img: 'images/terrace_dining.jpg', desc: 'Panoramic open-air dining under twilight skies with candle-lit teak tables and ambient live sitar.' },
    { id: 'g2', title: 'Skyline Twilight Veranda', cat: 'terrace', badge: 'Panoramic Vista', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', desc: 'Sweeping 360-degree views over South Delhi canopies, illuminated under warm golden hour hues.' },
    { id: 'g3', title: 'Candlelit Fountain Courtyard', cat: 'terrace', badge: 'Open Courtyard', img: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1200&q=80', desc: 'Central marble fountain rippling amidst hand-carved jaali screens, floating lotus candles, and jasmine.' },
    { id: 'g4', title: 'The Maharaja Grand Dining Hall', cat: 'architecture', badge: 'Palace Hall', img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80', desc: 'Imperial banquet hall crowned with Venetian crystal chandeliers, hand-gilded arches, and Italian marble inlays.' },
    { id: 'g5', title: 'Sandstone Jaali Colonnade', cat: 'architecture', badge: 'Heritage Design', img: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80', desc: 'Sandstone archways and geometric jaali screens casting dramatic light patterns across imperial walkways.' },
    { id: 'g6', title: 'Ambient Royal Archways', cat: 'architecture', badge: 'Palace Corridor', img: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80', desc: 'Serene corridors with illuminated fluted pillars, antique brass mashaals, and traditional royal motifs.' },
    { id: 'g7', title: 'The Maharaja Imperial Suite', cat: 'suites', badge: 'Royal Suite', img: 'images/private_dining.jpg', desc: 'Private dining sanctum featuring hand-carved teak woodwork, acoustic seclusion, and dedicated royal butler.' },
    { id: 'g8', title: 'The Private Jharokha Alcove', cat: 'suites', badge: 'Intimate Dining', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80', desc: 'Romantic private alcove dressed in raw silk drapery, low royal seating, and dedicated sommelier concierge.' },
    { id: 'g9', title: 'Mirror-Inlaid Private Sanctum', cat: 'suites', badge: 'Sheesh Chamber', img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80', desc: 'Belgian mirror inlays multiplying candlelight, creating an ethereal setting for celebratory banquets.' },
    { id: 'g10', title: 'The Saffron Velvet Evening Lounge', cat: 'lounge', badge: 'Velvet Lounge', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80', desc: 'Amber lighting, hand-knotted Persian silk carpets, and plush divans with acoustic live sitar performances.' },
    { id: 'g11', title: 'Botanical Saffron & Mocktail Bar', cat: 'lounge', badge: 'Beverage Atelier', img: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80', desc: 'Artisanal mocktails crafted with handpicked Kashmiri saffron, mountain elderflower, and fresh citrus.' },
    { id: 'g12', title: 'Evening Candlelit Welcome Pathway', cat: 'lounge', badge: 'Ambiance Vibe', img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80', desc: 'A grand entrance flanked by brass oil lanterns, fresh rose petal urns, and aromatic saffron incense.' },
    { id: 'g13', title: 'Live Charcoal Tandoor & Handi Theater', cat: 'culinary', badge: 'Open Kitchen', img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', desc: 'Open kitchen theater where bawarchis roast kebabs over hardwood embers and slow-simmer copper handis.' },
    { id: 'g14', title: 'Master Chef Vikramaditya', cat: 'culinary', badge: 'Culinary Master', img: 'images/chef_portrait.jpg', desc: 'Our visionary executive chef preserving ancestral Awadhi and Mewari royal court recipes with modern finesse.' },
    { id: 'g15', title: 'The Royal Saffron Crown Presentation', cat: 'culinary', badge: 'Signature Dish', img: 'images/hero_dish.jpg', desc: 'A royal vegetarian centerpiece garnished with 24k edible gold vark, saffron threads, and herb oils.' },
    { id: 'g16', title: 'The 12-Course Kansa Bronze Thali', cat: 'culinary', badge: 'Royal Banquet', img: 'images/indian_thali.jpg', desc: 'Traditional banquet served in pure hand-hammered bronze tableware, presenting an imperial culinary journey.' },
    { id: 'g17', title: 'Charcoal Tandoori Malai Chaap', cat: 'culinary', badge: 'Tandoor Special', img: 'images/malai_chaap.jpg', desc: 'Char-grilled soya skewers steeped in clotted cream, green cardamom, roasted cashew puree, and micro-greens.' },
    { id: 'g18', title: 'Kesar Pista Saffron Rasmalai', cat: 'culinary', badge: 'Artisan Dessert', img: 'images/rasmalai.jpg', desc: 'Cottage cheese medallions simmered in dense saffron-infused rabri, crowned with Persian pistachios.' }
  ];

  const grid = document.getElementById('gallery-grid');
  const tabs = document.querySelectorAll('.gallery-tabs .filter-tab');
  const counter = document.getElementById('gallery-counter');
  const lb = document.getElementById('gallery-lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbWrap = document.getElementById('lightbox-img-wrap');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbBadge = document.getElementById('lightbox-badge');
  const lbCounter = document.getElementById('lightbox-counter');

  let activeFilter = 'all';
  let currentIndex = 0;
  let isZoomed = false;

  function getFiltered() {
    return activeFilter === 'all' ? ITEMS : ITEMS.filter(it => it.cat === activeFilter);
  }

  function renderGallery() {
    if (!grid) return;
    const list = getFiltered();
    grid.innerHTML = list.map((it, idx) => `
      <article class="gallery-item" data-index="${idx}">
        <div class="gallery-item-media">
          <img src="${it.img}" alt="${it.title}" class="gallery-item-img" loading="lazy">
          <span class="gallery-zoom-badge">View Details</span>
        </div>
        <div class="gallery-item-info">
          <span class="card-category-badge">${it.badge}</span>
          <h3>${it.title}</h3>
          <p>${it.desc}</p>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.gallery-item').forEach(card => {
      card.addEventListener('click', () => openLightbox(Number(card.dataset.index)));
    });

    if (counter) counter.textContent = `Showing ${list.length} Showcases`;
  }

  function openLightbox(idx) {
    const list = getFiltered();
    if (idx < 0 || idx >= list.length || !lb) return;
    currentIndex = idx;
    const it = list[idx];
    lbImg.src = it.img;
    lbImg.alt = it.title;
    lbTitle.textContent = it.title;
    lbDesc.textContent = it.desc;
    lbBadge.textContent = it.badge;
    if (lbCounter) lbCounter.textContent = `${currentIndex + 1} / ${list.length}`;
    isZoomed = false;
    if (lbWrap) lbWrap.classList.remove('zoomed');
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lb) return;
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  function navLightbox(delta) {
    const list = getFiltered();
    currentIndex = (currentIndex + delta + list.length) % list.length;
    openLightbox(currentIndex);
  }

  const el = id => document.getElementById(id);
  const addClick = (id, fn) => { const b = el(id); if (b) b.addEventListener('click', fn); };

  addClick('lightbox-close', closeLightbox);
  addClick('lightbox-dismiss-btn', closeLightbox);
  addClick('lightbox-prev', e => { e.stopPropagation(); navLightbox(-1); });
  addClick('lightbox-next', e => { e.stopPropagation(); navLightbox(1); });
  addClick('lightbox-zoom', e => {
    e.stopPropagation();
    isZoomed = !isZoomed;
    if (lbWrap) lbWrap.classList.toggle('zoomed', isZoomed);
  });

  if (lb) {
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  }

  document.addEventListener('keydown', e => {
    if (!lb || lb.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter || 'all';
      renderGallery();
    });
  });

  renderGallery();
});
