const STORAGE_KEY = "asetai_mvp_v1";
const initialPlan = [
  {id:"p1",day:"Hari 1–3",title:"Pilih satu audiens dan masalah nyata",detail:"Tulis siapa calon pembeli dan masalah spesifik yang ingin dibantu."},
  {id:"p2",day:"Hari 1–7",title:"Buat produk digital pertama",detail:"Mulai dengan jurnal, panduan, atau template sederhana. Periksa fakta, ejaan, dan hak penggunaan."},
  {id:"p3",day:"Hari 5–8",title:"Siapkan sampel dan halaman jual",detail:"Tampilkan isi, manfaat, format file, harga, dan batasan produk secara jujur."},
  {id:"p4",day:"Hari 8–14",title:"Publikasikan website etalase",detail:"Uji dari HP, periksa semua tombol dan tautan checkout."},
  {id:"p5",day:"Hari 10–20",title:"Buat dan terbitkan konten promosi",detail:"Uji beberapa hook dan format konten. Jangan memakai testimoni palsu."},
  {id:"p6",day:"Hari 15–21",title:"Uji alur pembelian",detail:"Pastikan pembayaran diverifikasi dan file dikirim dengan benar."},
  {id:"p7",day:"Hari 22–26",title:"Evaluasi data awal",detail:"Catat kunjungan, klik, pertanyaan, pembelian, dan masukan."},
  {id:"p8",day:"Hari 27–30",title:"Perbaiki produk dan penawaran",detail:"Tingkatkan hal yang terbukti dibutuhkan sebelum menambah banyak produk."}
];
let state = loadState();

function loadState(){
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(parsed && Array.isArray(parsed.products) && Array.isArray(parsed.sales)) {
      parsed.plan = Array.isArray(parsed.plan) ? parsed.plan : initialPlan.map(x=>({...x,done:false}));
      return parsed;
    }
  } catch(e) {}
  return {products:[],sales:[],plan:initialPlan.map(x=>({...x,done:false}))};
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); renderAll(); }
function uid(){ return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function rupiah(n){ return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(Number(n)||0); }
function escapeHTML(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function statusLabel(s){return ({draft:"Draft",review:"Perlu ditinjau",approved:"Disetujui",published:"Dipublikasikan"})[s]||"Draft";}
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300);}
function openDialog(id){document.getElementById(id).showModal();}
function closeDialog(id){document.getElementById(id).close();}
function getProduct(id){return state.products.find(p=>p.id===id);}
function renderStats(){
  document.getElementById("statProducts").textContent=state.products.length;
  document.getElementById("statReview").textContent=state.products.filter(p=>p.status==="review").length;
  document.getElementById("statRevenue").textContent=rupiah(state.sales.reduce((a,s)=>a+Number(s.amount||0),0));
}
function renderProducts(){
  const list=document.getElementById("productList");
  const empty=document.getElementById("emptyProducts");
  empty.classList.toggle("hidden",state.products.length>0);
  list.innerHTML=state.products.map(p=>`<article class="product-card">
    <div class="product-top"><div class="product-icon">${p.type.includes("Template")?"▦":p.type.includes("Jurnal")?"✎":p.type.includes("prompt")?"⌘":"▤"}</div>
      <div class="product-main"><h3>${escapeHTML(p.name)}</h3><div class="product-meta">${escapeHTML(p.type)}${p.audience?" • "+escapeHTML(p.audience):""}</div></div>
    </div>
    <p class="product-description">${escapeHTML(p.description)}</p>
    <div class="product-bottom"><span class="price">${rupiah(p.price)}</span><span class="status ${p.status}">${statusLabel(p.status)}</span></div>
    ${p.link?`<p class="product-meta">Tautan: <a href="${escapeHTML(p.link)}" target="_blank" rel="noopener noreferrer">Buka halaman penjualan ↗</a></p>`:""}
    <div class="actions">
      <button class="button button-secondary" data-edit="${p.id}">Edit</button>
      ${p.status!=="approved"&&p.status!=="published"?`<button class="button button-primary" data-approve="${p.id}">Setujui</button>`:""}
      ${p.status==="approved"?`<button class="button button-primary" data-publish="${p.id}">Tandai dipublikasikan</button>`:""}
      <button class="button button-quiet" data-delete="${p.id}">Hapus</button>
    </div>
  </article>`).join("");
  list.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>editProduct(b.dataset.edit));
  list.querySelectorAll("[data-approve]").forEach(b=>b.onclick=()=>updateStatus(b.dataset.approve,"approved"));
  list.querySelectorAll("[data-publish]").forEach(b=>b.onclick=()=>updateStatus(b.dataset.publish,"published"));
  list.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>deleteProduct(b.dataset.delete));
}
function renderProductOptions(){
  const options=state.products.map(p=>`<option value="${p.id}">${escapeHTML(p.name)}</option>`).join("");
  document.getElementById("marketingProduct").innerHTML=options||'<option value="">Buat produk terlebih dahulu</option>';
  document.getElementById("saleProduct").innerHTML=options||'<option value="">Belum ada produk</option>';
}
function renderSales(){
  const list=document.getElementById("salesList"),empty=document.getElementById("emptySales");
  empty.classList.toggle("hidden",state.sales.length>0);
  list.innerHTML=[...state.sales].reverse().map(s=>`<article class="sale-card"><div><strong>${escapeHTML(getProduct(s.productId)?.name||"Produk dihapus")}</strong><small>${escapeHTML(s.date)}${s.note?" • "+escapeHTML(s.note):""}</small></div><div class="sale-amount">${rupiah(s.amount)}<div class="actions"><button class="button button-quiet" data-removesale="${s.id}">Hapus</button></div></div></article>`).join("");
  list.querySelectorAll("[data-removesale]").forEach(b=>b.onclick=()=>{state.sales=state.sales.filter(s=>s.id!==b.dataset.removesale);saveState();toast("Catatan transaksi dihapus");});
}
function renderPlan(){
  const list=document.getElementById("planList");
  list.innerHTML=state.plan.map(p=>`<label class="plan-item"><input type="checkbox" data-plan="${p.id}" ${p.done?"checked":""}><span><strong>${escapeHTML(p.day)} — ${escapeHTML(p.title)}</strong><small>${escapeHTML(p.detail)}</small></span></label>`).join("");
  list.querySelectorAll("[data-plan]").forEach(c=>c.onchange=()=>{const p=state.plan.find(x=>x.id===c.dataset.plan);if(p)p.done=c.checked;saveState();});
  const done=state.plan.filter(p=>p.done).length, pct=state.plan.length?Math.round(done/state.plan.length*100):0;
  document.getElementById("planProgressText").textContent=pct+"%";
  document.getElementById("planProgress").style.width=pct+"%";
}
function renderAll(){renderStats();renderProducts();renderProductOptions();renderSales();renderPlan();}
function resetProductForm(){
  document.getElementById("productForm").reset();
  document.getElementById("productId").value="";
  document.getElementById("productDialogTitle").textContent="Produk baru";
  document.getElementById("productPrice").value=29000;
  document.getElementById("productStatus").value="draft";
}
function editProduct(id){
  const p=getProduct(id);if(!p)return;
  document.getElementById("productId").value=p.id;
  document.getElementById("productName").value=p.name;
  document.getElementById("productType").value=p.type;
  document.getElementById("productAudience").value=p.audience||"";
  document.getElementById("productDescription").value=p.description;
  document.getElementById("productPrice").value=p.price;
  document.getElementById("productStatus").value=p.status;
  document.getElementById("productLink").value=p.link||"";
  document.getElementById("productDialogTitle").textContent="Edit produk";
  openDialog("productDialog");
}
function updateStatus(id,status){const p=getProduct(id);if(!p)return;p.status=status;saveState();toast(status==="approved"?"Produk disetujui":"Status produk diperbarui");}
function deleteProduct(id){
  if(!confirm("Hapus produk ini? Catatan transaksi lama akan tetap tersimpan."))return;
  state.products=state.products.filter(p=>p.id!==id);saveState();toast("Produk dihapus");
}
function makeMarketing(){
  const p=getProduct(document.getElementById("marketingProduct").value);
  if(!p){toast("Buat produk terlebih dahulu");return;}
  const channel=document.getElementById("channel").value;
  const result=`PRODUK: ${p.name}\nTARGET: ${p.audience||"Tentukan target yang spesifik"}\nHARGA: ${rupiah(p.price)}\nSALURAN: ${channel}\n\nHOOK:\n“Sedang mencari cara yang lebih terstruktur untuk ${p.description.toLowerCase()}?”\n\nKERANGKA VIDEO 20–30 DETIK:\n1. 0–3 detik: Sebutkan masalah yang benar-benar dialami target.\n2. 3–10 detik: Berikan satu tips berguna yang bisa langsung dicoba.\n3. 10–20 detik: Tunjukkan bagaimana ${p.name} membantu dan tampilkan contoh isinya.\n4. 20–30 detik: Ajak penonton melihat detail produk melalui tautan profil.\n\nCAPTION:\nJika kamu sedang mencari panduan praktis terkait kebutuhan ini, ${p.name} bisa menjadi salah satu alat bantu. Baca detail dan contoh isinya terlebih dahulu agar kamu tahu apakah produk ini sesuai kebutuhanmu.\n\nCTA:\nLihat detail produk melalui tautan profil.\n\nCATATAN:\nPeriksa agar semua klaim sesuai isi produk. Jangan menjanjikan hasil pasti atau memakai testimoni yang tidak nyata.`;
  const el=document.getElementById("marketingResult");
  el.innerHTML=`<h3>Kerangka promosi</h3><div class="result-content">${escapeHTML(result)}</div><button id="copyMarketingBtn" class="button button-secondary full">Salin materi</button>`;
  el.classList.remove("hidden");
  document.getElementById("copyMarketingBtn").onclick=()=>copyText(result,"Materi disalin");
}
async function copyText(text,message){
  try{await navigator.clipboard.writeText(text);toast(message);}
  catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(message);}catch(err){toast("Salin manual dari teks yang tersedia");}ta.remove();}
}
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));
  document.querySelectorAll(".panel").forEach(p=>p.classList.add("hidden"));
  document.getElementById("panel-"+btn.dataset.tab).classList.remove("hidden");
}));
document.getElementById("newProductBtn").onclick=()=>{resetProductForm();openDialog("productDialog");};
document.getElementById("emptyNewBtn").onclick=()=>{resetProductForm();openDialog("productDialog");};
document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>closeDialog(b.dataset.close));
document.getElementById("productForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=document.getElementById("productId").value;
  const data={id:id||uid(),name:document.getElementById("productName").value.trim(),type:document.getElementById("productType").value,audience:document.getElementById("productAudience").value.trim(),description:document.getElementById("productDescription").value.trim(),price:Number(document.getElementById("productPrice").value),status:document.getElementById("productStatus").value,link:document.getElementById("productLink").value.trim()};
  if(id){state.products=state.products.map(p=>p.id===id?data:p);}else state.products.push(data);
  saveState();closeDialog("productDialog");toast("Produk tersimpan");
});
document.getElementById("makeMarketingBtn").onclick=makeMarketing;
document.getElementById("copyPromptBtn").onclick=()=>copyText(document.getElementById("generalPrompt").value,"Prompt disalin");
document.getElementById("newSaleBtn").onclick=()=>{
  if(!state.products.length){toast("Buat produk terlebih dahulu");return;}
  document.getElementById("saleForm").reset();
  document.getElementById("saleDate").value=new Date().toISOString().slice(0,10);
  const p=state.products[0];document.getElementById("saleProduct").value=p.id;document.getElementById("saleAmount").value=p.price;
  openDialog("saleDialog");
};
document.getElementById("saleProduct").onchange=()=>{const p=getProduct(document.getElementById("saleProduct").value);if(p)document.getElementById("saleAmount").value=p.price;};
document.getElementById("saleForm").addEventListener("submit",e=>{
  e.preventDefault();
  state.sales.push({id:uid(),productId:document.getElementById("saleProduct").value,amount:Number(document.getElementById("saleAmount").value),date:document.getElementById("saleDate").value,note:document.getElementById("saleNote").value.trim()});
  saveState();closeDialog("saleDialog");toast("Transaksi dicatat");
});
document.getElementById("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="asetai-backup.json";a.click();URL.revokeObjectURL(url);toast("File backup disiapkan");
};
renderAll();
