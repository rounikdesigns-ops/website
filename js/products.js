// ═══════════════════════════════════════════════════════════════════════════
// ROUNIK — Live Product Database via Google Sheets
// ═══════════════════════════════════════════════════════════════════════════
//
// HOW IT WORKS:
//   1. Products live in a Google Sheet (Ruchi manages this)
//   2. This file fetches from the Sheet on every page load
//   3. Any device / browser sees the latest products automatically
//
// SETUP: Replace SHEET_CSV_URL below with your published Google Sheet URL
// (Full instructions in GOOGLE_SHEETS_SETUP.txt)
// ═══════════════════════════════════════════════════════════════════════════

const WHATSAPP_NUMBER = "919XXXXXXXXX"; // ← Replace with Ruchi's number

// ── Step 1: Paste your Google Sheet published CSV URL here ────────────────
// Format: https://docs.google.com/spreadsheets/d/YOUR_ID/pub?output=csv
const SHEET_CSV_URL = "YOUR_GOOGLE_SHEET_CSV_URL_HERE";

// ── Fallback products (shown while Sheet loads or if Sheet is not set up) ─
const FALLBACK_PRODUCTS = [
  {
    id:"001", name:"Jade Blossom Saree", category:"Sarees", price:8500, discountedPrice:null,
    description:"A stunning handwoven georgette saree with gold zari border. Perfect for festive occasions.",
    material:"Georgette Silk", care:"Dry clean only. Store in muslin cloth.",
    sizes:["Free Size"], colors:["Sage Green","Ivory"],
    images:["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=85"],
    badge:"New", inStock:true, tags:["festive","wedding"]
  },
  {
    id:"002", name:"Royal Heritage Lehenga", category:"Bridal Wear", price:22000, discountedPrice:null,
    description:"Breathtaking bridal lehenga with heavy embroidery and mirror work. Custom stitching available.",
    material:"Raw Silk with Net Dupatta", care:"Dry clean only.",
    sizes:["Custom Stitching"], colors:["Blush Pink","Red","Ivory"],
    images:["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=85"],
    badge:"Bestseller", inStock:true, tags:["bridal","wedding"]
  },
  {
    id:"003", name:"Miraya Anarkali Kurti", category:"Kurtis", price:3200, discountedPrice:2800,
    description:"Flowy anarkali-style kurti in premium cotton blend with embroidery at neckline.",
    material:"Cotton Blend", care:"Hand wash in cold water.",
    sizes:["XS","S","M","L","XL"], colors:["Teal","Mustard","White"],
    images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85"],
    badge:"Sale", inStock:true, tags:["casual","cotton"]
  }
];

const CATEGORIES = ["All","Sarees","Bridal Wear","Kurtis","Churidar","Western Wear","Couture"];

// ── Global product store ──────────────────────────────────────────────────
let PRODUCTS = [];
let _productsLoaded = false;

// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE SHEETS FETCH & CSV PARSER
// ═══════════════════════════════════════════════════════════════════════════

async function loadProductsFromSheet() {
  // If Sheet URL not configured, use fallback immediately
  if (!SHEET_CSV_URL || SHEET_CSV_URL === "YOUR_GOOGLE_SHEET_CSV_URL_HERE") {
    console.warn("ROUNIK: Google Sheet not configured. Using fallback products.");
    PRODUCTS = FALLBACK_PRODUCTS;
    _productsLoaded = true;
    return PRODUCTS;
  }

  try {
    // Add cache-busting so browser always gets fresh data
    const url = SHEET_CSV_URL + "&t=" + Date.now();
    const response = await fetch(url);
    if (!response.ok) throw new Error("Sheet fetch failed: " + response.status);

    const csv = await response.text();
    const parsed = parseCSV(csv);

    if (parsed.length === 0) throw new Error("Empty sheet");

    PRODUCTS = parsed;
    _productsLoaded = true;
    console.log(`ROUNIK: Loaded ${PRODUCTS.length} products from Google Sheets ✅`);
    return PRODUCTS;

  } catch (err) {
    console.error("ROUNIK: Could not load from Google Sheets:", err.message);
    console.warn("ROUNIK: Falling back to sample products.");
    PRODUCTS = FALLBACK_PRODUCTS;
    _productsLoaded = true;
    return PRODUCTS;
  }
}

// ── CSV Parser — converts Google Sheet rows into product objects ──────────
function parseCSV(csv) {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]).map(h => h.trim().toLowerCase().replace(/\s+/g,'_'));
  console.log("ROUNIK: Sheet headers:", headers);

  const products = [];
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    if (!row.length) continue;

    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (row[idx] || '').trim(); });

    // ── Column name map — matches Google Form output exactly ──────────────
    // Google Form creates: "product_name", "product_id", "image_1_url" etc.
    const id          = obj['product_id']          || obj['id']          || ('P' + i);
    const name        = obj['product_name']         || obj['name']        || '';
    const category    = obj['category']             || '';
    const material    = obj['material']             || '';
    const price       = parseFloat(obj['price'])    || 0;
    const salePrice   = obj['sale_price']           ? parseFloat(obj['sale_price']) || null : null;
    const description = obj['description']          || '';
    const care        = obj['care_instructions']    || obj['care']        || '';
    const sizes       = obj['sizes']                || '';
    const colors      = obj['colors']               || '';
    const tags        = obj['tags']                 || '';
    const image1      = obj['image_1_url']          || obj['image1']      || '';
    const image2      = obj['image_2_url']          || obj['image2']      || '';
    const badge       = obj['badge']                || null;
    const inStockRaw  = obj['in_stock']             || 'true';

    if (!name) continue; // skip empty rows

    const images = [];
    if (image1 && image1.startsWith('http')) images.push(image1);
    if (image2 && image2.startsWith('http')) images.push(image2);

    const product = {
      id:             id,
      name:           name,
      category:       category,
      price:          price,
      discountedPrice:salePrice,
      description:    description,
      material:       material,
      care:           care,
      sizes:          sizes  ? sizes.split(',').map(s=>s.trim()).filter(Boolean)  : [],
      colors:         colors ? colors.split(',').map(c=>c.trim()).filter(Boolean) : [],
      tags:           tags   ? tags.split(',').map(t=>t.trim().toLowerCase()).filter(Boolean) : [],
      images:         images.length ? images : ['https://via.placeholder.com/400x500?text=' + encodeURIComponent(name)],
      badge:          badge || null,
      inStock:        inStockRaw.toLowerCase() !== 'false' && inStockRaw !== '0' && inStockRaw.toLowerCase() !== 'no',
    };

    products.push(product);
  }
  console.log("ROUNIK: Loaded", products.length, "products. Categories:", [...new Set(products.map(p=>p.category))]);
  return products;
}

// Proper CSV row parser (handles quoted fields with commas inside)
function parseCSVRow(row) {
  const result = [];
  let field = '', inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i+1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(field); field = '';
    } else {
      field += ch;
    }
  }
  result.push(field);
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// WHATSAPP ORDER
// ═══════════════════════════════════════════════════════════════════════════
function orderOnWhatsApp(productId, selectedSize='', selectedColor='') {
  const p = PRODUCTS.find(p => p.id === productId);
  if (!p) return;
  const sizeText  = selectedSize  ? `\nSize: ${selectedSize}`  : `\nSizes available: ${p.sizes.join(', ')}`;
  const colorText = selectedColor ? `\nColor: ${selectedColor}` : `\nColors available: ${p.colors.join(', ')}`;
  const msg = `Hi ROUNIK! 👗\n\nI'd like to order:\n*${p.name}*\nCategory: ${p.category}\nMaterial: ${p.material}\nPrice: Rs. ${Number(p.price).toLocaleString('en-IN')}${sizeText}${colorText}\n\nPlease confirm availability and delivery details. Thank you! 🙏`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT CARD RENDERER
// ═══════════════════════════════════════════════════════════════════════════
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card fade-in';
  const hasDiscount = product.discountedPrice && product.discountedPrice < product.price;
  const priceHTML = hasDiscount
      ? `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span class="product-price">Rs. ${Number(product.discountedPrice).toLocaleString('en-IN')}</span>
        <span style="font-size:0.8rem;color:var(--muted);text-decoration:line-through;">Rs. ${Number(product.price).toLocaleString('en-IN')}</span>
       </div>`
      : `<div class="product-price">Rs. ${Number(product.price).toLocaleString('en-IN')}</div>`;
  const imgSrc = (product.images && product.images[0]) ? product.images[0] : 'https://via.placeholder.com/400x500?text=No+Image';
  const badgeMap = {'New':'new','Sale':'sale','Bestseller':''};
  const badgeHTML = product.badge ? `<div class="product-badge ${badgeMap[product.badge]||''}">${product.badge}</div>` : '';
  const soldHTML  = !product.inStock ? '<div class="product-badge sold">Sold Out</div>' : '';
  const sizesHTML = (product.sizes||[]).slice(0,4).map(s=>`<div class="size-dot" title="${s}">${s[0]}</div>`).join('');

  card.innerHTML = `
    <div class="product-img-wrap" onclick="openProductModal('${product.id}')" style="cursor:pointer;">
      <img src="${imgSrc}" alt="${product.name}" loading="lazy">
      ${badgeHTML}${soldHTML}
      <div class="product-overlay">
        <button class="btn" style="background:rgba(255,255,255,0.15);color:#fff;border:1.5px solid rgba(255,255,255,0.5);padding:10px 22px;font-size:0.8rem;letter-spacing:1px;" onclick="event.stopPropagation();openProductModal('${product.id}')">Quick View</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${product.category} · <em style="font-style:normal;color:var(--muted);">${product.material||''}</em></div>
      <div class="product-name" onclick="openProductModal('${product.id}')" style="cursor:pointer;">${product.name}</div>
      <div class="product-desc">${(product.description||'').substring(0,80)}${(product.description||'').length>80?'...':''}</div>
      <div class="product-footer">${priceHTML}<div class="product-sizes">${sizesHTML}</div></div>
      ${product.inStock
      ? `<button class="product-order-btn" onclick="openProductModal('${product.id}')">📲 View & Order</button>`
      : `<button class="product-order-btn sold-btn" disabled>Sold Out</button>`}
    </div>`;
  return card;
}

// ═══════════════════════════════════════════════════════════════════════════
// RENDER GRID (with loading skeleton)
// ═══════════════════════════════════════════════════════════════════════════
function showLoadingSkeleton(containerId, count=4) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = Array(count).fill(`
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
      <div style="background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;aspect-ratio:3/4;"></div>
      <div style="padding:1.2rem;">
        <div style="height:10px;background:#f0f0f0;border-radius:4px;margin-bottom:8px;animation:shimmer 1.5s infinite;"></div>
        <div style="height:14px;background:#f0f0f0;border-radius:4px;margin-bottom:8px;width:70%;animation:shimmer 1.5s infinite;"></div>
        <div style="height:10px;background:#f0f0f0;border-radius:4px;width:50%;animation:shimmer 1.5s infinite;"></div>
      </div>
    </div>`).join('');
  // Add shimmer keyframes if not present
  if (!document.getElementById('shimmer-style')) {
    const s = document.createElement('style');
    s.id = 'shimmer-style';
    s.textContent = '@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}';
    document.head.appendChild(s);
  }
}

async function renderProducts(containerId, filterCategory='All', limit=null, sortBy='default') {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Show skeleton while loading
  showLoadingSkeleton(containerId, limit||6);

  // Load from Sheet if not yet loaded
  if (!_productsLoaded) await loadProductsFromSheet();

  let filtered = filterCategory==='All' ? [...PRODUCTS] : PRODUCTS.filter(p=>p.category===filterCategory);
  if(sortBy==='price-low')  filtered.sort((a,b)=>a.price-b.price);
  if(sortBy==='price-high') filtered.sort((a,b)=>b.price-a.price);
  if(sortBy==='name')       filtered.sort((a,b)=>a.name.localeCompare(b.name));
  if(limit) filtered = filtered.slice(0,limit);

  container.innerHTML='';

  if(!filtered.length){
    container.innerHTML=`<div class="no-products"><div style="font-size:3rem">🔍</div><p>No products in this category yet.</p></div>`;
    return;
  }

  filtered.forEach((p,i)=>{
    const c=createProductCard(p);
    c.style.transitionDelay=`${i*55}ms`;
    container.appendChild(c);
  });
  setTimeout(()=>container.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible')),60);
}

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════
let _selectedSize='', _selectedColor='';

function openProductModal(productId) {
  const p = PRODUCTS.find(x=>x.id===productId);
  if(!p) return;
  _selectedSize=''; _selectedColor='';
  const hasDiscount = p.discountedPrice && p.discountedPrice < p.price;
  const discountPct = hasDiscount ? Math.round((1-p.discountedPrice/p.price)*100) : 0;
  const imgSrc = (p.images&&p.images[0]) ? p.images[0] : 'https://via.placeholder.com/600x700';
  const thumbsHTML = (p.images||[]).length>1
      ? (p.images||[]).map((img,i)=>`<img src="${img}" class="modal-thumb${i===0?' active':''}" onclick="switchModalImg('${img}',this)" alt="View ${i+1}">`).join('')
      : '';
  const sizesHTML  = (p.sizes||[]).map(s=>`<button class="size-option-btn" onclick="selectSize(this,'${s}')">${s}</button>`).join('');
  const colorsHTML = (p.colors||[]).map(c=>`<button class="color-option-btn" onclick="selectColor(this,'${c}')">${c}</button>`).join('');
  const tagsHTML   = (p.tags||[]).map(t=>`<span class="tag-chip">${t}</span>`).join('');

  document.getElementById('product-modal').innerHTML = `
    <div class="modal-backdrop" onclick="closeModal()"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="closeModal()">✕</button>
      <div class="modal-grid">
        <div class="modal-images">
          <div class="modal-main-img-wrap">
            <img id="modal-main-img" src="${imgSrc}" alt="${p.name}">
            ${!p.inStock?'<div class="modal-sold-badge">Sold Out</div>':''}
            ${p.badge?`<div class="modal-new-badge">${p.badge}</div>`:''}
          </div>
          ${thumbsHTML?`<div class="modal-thumbs">${thumbsHTML}</div>`:''}
        </div>
        <div class="modal-info">
          <div class="modal-category">${p.category}</div>
          <h2 class="modal-name">${p.name}</h2>
          <div class="modal-price-row">
            ${hasDiscount
      ? `<span class="modal-price">Rs. ${Number(p.discountedPrice).toLocaleString('en-IN')}</span>
                 <span class="modal-price-original">Rs. ${Number(p.price).toLocaleString('en-IN')}</span>
                 <span class="modal-discount-badge">${discountPct}% OFF</span>`
      : `<span class="modal-price">Rs. ${Number(p.price).toLocaleString('en-IN')}</span>`}
          </div>
          <div class="modal-divider"></div>
          <div class="modal-desc">${p.description}</div>
          <div class="modal-detail-grid">
            <div class="modal-detail-item"><span class="modal-detail-label">🪡 Material</span><span class="modal-detail-val">${p.material||'—'}</span></div>
            <div class="modal-detail-item"><span class="modal-detail-label">🧺 Care</span><span class="modal-detail-val">${p.care||'—'}</span></div>
            ${tagsHTML?`<div class="modal-detail-item"><span class="modal-detail-label">🏷 Tags</span><span class="modal-detail-val">${tagsHTML}</span></div>`:''}
          </div>
          ${sizesHTML?`<div class="modal-section"><div class="modal-section-label">Size <span id="selected-size-label" style="color:var(--gold);font-weight:600;"></span></div><div class="size-options">${sizesHTML}</div></div>`:''}
          ${colorsHTML?`<div class="modal-section"><div class="modal-section-label">Color <span id="selected-color-label" style="color:var(--gold);font-weight:600;"></span></div><div class="color-options">${colorsHTML}</div></div>`:''}
          ${p.inStock
      ? `<button class="modal-order-btn" onclick="orderFromModal('${p.id}')">📲 Order on WhatsApp</button>
               <p class="modal-order-note">Tap to open WhatsApp with product details pre-filled.</p>`
      : `<button class="modal-order-btn" style="background:var(--muted);cursor:not-allowed;" disabled>Currently Sold Out</button>
               <p class="modal-order-note">WhatsApp us to request a restock.</p>`}
        </div>
      </div>
    </div>`;
  document.getElementById('product-modal').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal()     { document.getElementById('product-modal').classList.remove('open'); document.body.style.overflow=''; }
function switchModalImg(src,el) { document.getElementById('modal-main-img').src=src; document.querySelectorAll('.modal-thumb').forEach(t=>t.classList.remove('active')); el.classList.add('active'); }
function selectSize(btn,size)   { _selectedSize=size;  document.querySelectorAll('.size-option-btn').forEach(b=>b.classList.remove('active'));  btn.classList.add('active'); const l=document.getElementById('selected-size-label');  if(l) l.textContent=`— ${size}`; }
function selectColor(btn,color) { _selectedColor=color; document.querySelectorAll('.color-option-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const l=document.getElementById('selected-color-label'); if(l) l.textContent=`— ${color}`; }
function orderFromModal(productId) { orderOnWhatsApp(productId,_selectedSize,_selectedColor); }

// ═══════════════════════════════════════════════════════════════════════════
// FILTER SYSTEM (shop page)
// ═══════════════════════════════════════════════════════════════════════════
function initFilters(filterBarId, gridId) {
  const bar = document.getElementById(filterBarId);
  if(!bar) return;
  let active='All';
  CATEGORIES.forEach(cat=>{
    const btn=document.createElement('button');
    btn.className='filter-btn'+(cat==='All'?' active':'');
    btn.textContent=cat;
    btn.onclick=()=>{
      active=cat;
      bar.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(gridId,active);
    };
    bar.appendChild(btn);
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
function initFadeObserver() {
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:0.08});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
}
function initNav() {
  const nav=document.querySelector('nav');
  if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',window.scrollY>40));
  const ham=document.querySelector('.hamburger'), menu=document.querySelector('.mobile-menu');
  if(ham&&menu) ham.addEventListener('click',()=>menu.classList.toggle('open'));
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
document.addEventListener('DOMContentLoaded',()=>{initNav();initFadeObserver();});
