const el = sel => document.querySelector(sel);
const results = el('#results');
const searchInput = el('#search');
const dialog = el('#productDialog');
const dialogContent = el('#dialogContent');
let products = [];

async function loadProducts(){
  try{
    const res = await fetch('products/products.json');
    products = await res.json();
    render(products);
  }catch(e){
    results.innerHTML = '<p style="padding:12px">Failed to load products.</p>';
  }
}

function render(list){
  if(!list || list.length===0){
    results.innerHTML = '<p style="padding:12px">No products found.</p>';
    return;
  }
  results.innerHTML = list.map(p => `
    <article class="card" tabindex="0" data-id="${p.id}">
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.category)}</p>
      <div class="price">${p.currency} ${p.price}</div>
    </article>
  `).join('');

  results.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('click', ()=> openProduct(card.dataset.id));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter') openProduct(card.dataset.id); });
  });
}

function openProduct(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  dialogContent.innerHTML = `
    <h2>${escapeHtml(p.name)}</h2>
    <img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:100%;height:220px;object-fit:cover;border-radius:8px;margin-bottom:8px" />
    <p style="color:#475569">${escapeHtml(p.description)}</p>
    <p class="price">${p.currency} ${p.price}</p>
  `;
  dialog.showModal();
}

el('#closeDialog').addEventListener('click', ()=> dialog.close());

function escapeHtml(str){ return String(str).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":"&#39;" }[c])); }

function debounce(fn, wait=250){ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; }

const doSearch = debounce(()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q) return render(products);
  const filtered = products.filter(p => (
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  ));
  render(filtered);
}, 200);

searchInput.addEventListener('input', doSearch);

// Service worker register
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('service-worker.js').then(()=>console.log('SW registered'))
  .catch(err=>console.log('SW register failed', err));
}

// Prompt install (deferred)
let deferredPrompt;
const btnInstall = el('#btn-install');
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  btnInstall.hidden = false;
});
btnInstall.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstall.hidden = true;
});

loadProducts();
