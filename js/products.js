// ═══════════════════════════════════════════════════════════════════════════
// ROUNIK — Product Database (synced via localStorage ↔ Admin Panel)
// ═══════════════════════════════════════════════════════════════════════════

const WHATSAPP_NUMBER = "917411127345";

const DEFAULT_PRODUCTS = [
  {
    id:"001", name:"Jade Blossom Saree", category:"Sarees", price:8500, discountedPrice:null,
    description:"A stunning handwoven georgette saree featuring an intricate gold zari border. Perfect for festive occasions and evening events. Lightweight and comfortable to wear all day.",
    material:"Georgette Silk", care:"Dry clean only. Store in muslin cloth. Avoid direct sunlight.",
    sizes:["Free Size"], colors:["Sage Green","Ivory"],
    images:["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=85","https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&q=85"],
    badge:"New", inStock:true, tags:["festive","wedding","zari"]
  },
  {
    id:"002", name:"Royal Heritage Lehenga", category:"Bridal Wear", price:22000, discountedPrice:null,
    description:"A breathtaking bridal lehenga set with heavy embroidery and mirror work. Includes matching blouse and dupatta. Custom stitching available to your exact measurements.",
    material:"Raw Silk with Net Dupatta", care:"Dry clean only. Handle embroidery gently.",
    sizes:["Custom Stitching"], colors:["Blush Pink","Red","Ivory"],
    images:["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=85"],
    badge:"Bestseller", inStock:true, tags:["bridal","wedding","embroidery","custom"]
  },
  {
    id:"003", name:"Miraya Anarkali Kurti", category:"Kurtis", price:3200, discountedPrice:2800,
    description:"A flowy anarkali-style kurti in premium cotton blend with delicate embroidery at neckline and cuffs. Pairs beautifully with churidar or palazzo pants.",
    material:"Cotton Blend", care:"Hand wash in cold water. Iron on medium heat.",
    sizes:["XS","S","M","L","XL"], colors:["Teal","Mustard","White"],
    images:["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=85"],
    badge:"Sale", inStock:true, tags:["casual","office","cotton"]
  },
  {
    id:"004", name:"Pearl Embroidered Salwar Set", category:"Churidar", price:5800, discountedPrice:null,
    description:"Elegant 3-piece churidar set with delicate pearl embroidery. Includes kurta, churidar and dupatta. Ideal for family functions and semi-formal occasions.",
    material:"Pure Cotton with Chiffon Dupatta", care:"Gentle machine wash or hand wash. Iron on low heat.",
    sizes:["S","M","L","XL"], colors:["Cream","Powder Blue"],
    images:["https://images.unsplash.com/photo-1594938291221-94f18cbb5a36?w=800&q=85"],
    badge:null, inStock:true, tags:["ethnic","function","pearl","set"]
  },
  {
    id:"005", name:"Saffron Silk Saree", category:"Sarees", price:12000, discountedPrice:null,
    description:"Pure Kanjivaram silk saree in rich saffron with traditional woven temple border motifs. A timeless piece that exudes grace and sophistication.",
    material:"Pure Kanjivaram Silk", care:"Dry clean only. Store with silica gel. Keep away from moisture.",
    sizes:["Free Size"], colors:["Saffron","Gold"],
    images:["https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=800&q=85"],
    badge:null, inStock:false, tags:["silk","traditional","kanjivaram"]
  },
  {
    id:"006", name:"Boho Floral Maxi", category:"Western Wear", price:4200, discountedPrice:3500,
    description:"A free-spirited bohemian maxi dress with vibrant floral print. V-neckline, smocked back and tiered skirt. Perfect for brunches, beach days and casual outings.",
    material:"Rayon", care:"Hand wash cold. Line dry in shade. Steam iron only.",
    sizes:["XS","S","M","L"], colors:["Floral Multi"],
    images:["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=85","https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85"],
    badge:"Sale", inStock:true, tags:["casual","western","boho","summer"]
  },
  {
    id:"007", name:"Ivory Couture Evening Gown", category:"Couture", price:18000, discountedPrice:null,
    description:"Show-stopping custom evening gown with sweetheart neckline and dramatic trail. Hand-sewn pearl and sequin detailing throughout. Uniquely made to client measurements.",
    material:"Satin with Net Overlay", care:"Dry clean only. Store hanging in garment bag.",
    sizes:["Custom Stitching"], colors:["Ivory","Champagne","Blush"],
    images:["https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=800&q=85"],
    badge:"Bestseller", inStock:true, tags:["gown","couture","evening","custom"]
  },
  {
    id:"008", name:"Daisy Block Print Kurti", category:"Kurtis", price:1800, discountedPrice:null,
    description:"Cheerful hand-block printed cotton kurti with daisy motifs. Relaxed fit with side slits. Great for everyday wear. Available in 3 colour options.",
    material:"100% Cotton", care:"Machine wash cold. Tumble dry low. Colours may slightly fade after first wash — natural for block prints.",
    sizes:["XS","S","M","L","XL","XXL"], colors:["White","Peach","Sky Blue"],
    images:["https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=85"],
    badge:null, inStock:true, tags:["casual","cotton","daily","blockprint"]
  },
  {
    id:"009", name:"Emerald Straight Kurta Set", category:"Churidar", price:4500, discountedPrice:null,
    description:"Sophisticated straight-cut kurta with matching palazzo pants. Subtle thread embroidery at hemline. Suitable for office, festive occasions and family gatherings.",
    material:"Linen Blend", care:"Hand wash or gentle machine wash. Iron on reverse side.",
    sizes:["S","M","L","XL"], colors:["Emerald Green","Jet Black"],
    images:["https://images.unsplash.com/photo-1594938291221-94f18cbb5a36?w=800&q=85"],
    badge:null, inStock:true, tags:["office","festive","linen","set"]
  },
  {
    id:"010", name:"Midnight Sequin Gown", category:"Couture", price:24000, discountedPrice:null,
    description:"Glamorous full-length sequined evening gown with backless design and thigh-high slit. Custom made to exact measurements. Perfect for receptions, galas and sangeet nights.",
    material:"Sequin Fabric on Satin Base", care:"Dry clean only. Store flat or hanging. Avoid friction.",
    sizes:["Custom Stitching"], colors:["Midnight Blue","Jet Black","Emerald"],
    images:["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=85"],
    badge:"New", inStock:true, tags:["gown","sequin","couture","evening"]
  },
  {
    id:"011", name:"Crimson Bridal Lehenga Set", category:"Bridal Wear", price:35000, discountedPrice:null,
    description:"Our most opulent bridal set — heavy Banarasi lehenga with hand-embroidered gold zari work, matching blouse and sheer dupatta with scalloped border. Fully customizable.",
    material:"Banarasi Silk", care:"Dry clean only. Store separately. Avoid folding embroidered panels.",
    sizes:["Custom Stitching"], colors:["Crimson","Deep Maroon","Royal Blue"],
    images:["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=85"],
    badge:"Bestseller", inStock:true, tags:["bridal","banarasi","zari","wedding","luxury"]
  },
  {
    id:"012", name:"Beige Linen Co-ord Set", category:"Western Wear", price:3500, discountedPrice:3000,
    description:"Relaxed matching linen co-ord set — cropped shirt and wide-leg trousers. Minimalist and versatile. Dress up with heels or keep casual with sneakers.",
    material:"Pure Linen", care:"Machine wash cold. Hang dry. Iron on medium while slightly damp.",
    sizes:["XS","S","M","L","XL"], colors:["Beige","Olive Green","White"],
    images:["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=85"],
    badge:"Sale", inStock:true, tags:["casual","western","linen","coordset"]
  }
];

const CATEGORIES = ["All","Sarees","Bridal Wear","Kurtis","Churidar","Western Wear","Couture"];
const MATERIALS  = ["Georgette Silk","Raw Silk","Pure Kanjivaram Silk","Banarasi Silk","Cotton Blend","100% Cotton","Linen Blend","Pure Linen","Rayon","Satin","Net","Chiffon","Crepe","Velvet","Other"];
const ALL_SIZES  = ["XS","S","M","L","XL","XXL","Free Size","Custom Stitching"];

// ── LocalStorage sync ────────────────────────────────────────────────────────
function getProducts() {
  try { const s = localStorage.getItem('rounik_products'); return s ? JSON.parse(s) : DEFAULT_PRODUCTS; }
  catch { return DEFAULT_PRODUCTS; }
}
function saveProducts(products) {
  try { localStorage.setItem('rounik_products', JSON.stringify(products)); } catch(e) {}
}
if (!localStorage.getItem('rounik_products')) saveProducts(DEFAULT_PRODUCTS);
let PRODUCTS = getProducts();

// ── WhatsApp ─────────────────────────────────────────────────────────────────
function orderOnWhatsApp(productId, selectedSize='', selectedColor='') {
  const p = PRODUCTS.find(p => p.id === productId); if(!p) return;
  const sizeText  = selectedSize  ? `\nSize: ${selectedSize}`  : `\nSizes available: ${p.sizes.join(', ')}`;
  const colorText = selectedColor ? `\nColor: ${selectedColor}` : `\nColors available: ${p.colors.join(', ')}`;
  const msg = `Hi ROUNIK! 👗\n\nI'd like to order:\n*${p.name}*\nCategory: ${p.category}\nMaterial: ${p.material}\nPrice: Rs. ${Number(p.price).toLocaleString('en-IN')}${sizeText}${colorText}\n\nPlease confirm availability and delivery details. Thank you! 🙏`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,'_blank');
}

// ── Product Card ─────────────────────────────────────────────────────────────
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

// ── Render Grid ──────────────────────────────────────────────────────────────
function renderProducts(containerId, filterCategory='All', limit=null, sortBy='default') {
  const container = document.getElementById(containerId); if(!container) return;
  PRODUCTS = getProducts();
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
  filtered.forEach((p,i)=>{const c=createProductCard(p);c.style.transitionDelay=`${i*55}ms`;container.appendChild(c);});
  setTimeout(()=>container.querySelectorAll('.fade-in').forEach(el=>el.classList.add('visible')),60);
}

// ── Product Modal ────────────────────────────────────────────────────────────
let _selectedSize='', _selectedColor='';

function openProductModal(productId) {
  PRODUCTS = getProducts();
  const p = PRODUCTS.find(x=>x.id===productId); if(!p) return;
  _selectedSize=''; _selectedColor='';
  const hasDiscount = p.discountedPrice && p.discountedPrice < p.price;
  const discountPct = hasDiscount ? Math.round((1-p.discountedPrice/p.price)*100) : 0;
  const imgSrc = (p.images&&p.images[0]) ? p.images[0] : 'https://via.placeholder.com/600x700?text=No+Image';
  const thumbsHTML = (p.images||[]).length>1
    ? (p.images||[]).map((img,i)=>`<img src="${img}" class="modal-thumb${i===0?' active':''}" onclick="switchModalImg('${img}',this)" alt="View ${i+1}">`).join('')
    : '';
  const sizesHTML = (p.sizes||[]).map(s=>`<button class="size-option-btn" onclick="selectSize(this,'${s}')">${s}</button>`).join('');
  const colorsHTML = (p.colors||[]).map(c=>`<button class="color-option-btn" onclick="selectColor(this,'${c}')">${c}</button>`).join('');
  const tagsHTML = (p.tags||[]).map(t=>`<span class="tag-chip">${t}</span>`).join('');

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
               <p class="modal-order-note">Tap to open WhatsApp with product details pre-filled. We'll confirm size, colour & delivery.</p>`
            : `<button class="modal-order-btn" style="background:var(--muted);cursor:not-allowed;" disabled>Currently Sold Out</button>
               <p class="modal-order-note">WhatsApp us to request a restock of this item.</p>`}
        </div>
      </div>
    </div>`;
  document.getElementById('product-modal').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeModal() { document.getElementById('product-modal').classList.remove('open'); document.body.style.overflow=''; }
function switchModalImg(src,el) { document.getElementById('modal-main-img').src=src; document.querySelectorAll('.modal-thumb').forEach(t=>t.classList.remove('active')); el.classList.add('active'); }
function selectSize(btn,size) { _selectedSize=size; document.querySelectorAll('.size-option-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const lbl=document.getElementById('selected-size-label'); if(lbl) lbl.textContent=`— ${size}`; }
function selectColor(btn,color) { _selectedColor=color; document.querySelectorAll('.color-option-btn').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const lbl=document.getElementById('selected-color-label'); if(lbl) lbl.textContent=`— ${color}`; }
function orderFromModal(productId) { orderOnWhatsApp(productId,_selectedSize,_selectedColor); }

// ── Helpers ───────────────────────────────────────────────────────────────────
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
