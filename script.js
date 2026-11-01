// Tkay Footwears catalogue. Edit product names, categories, prices and photo paths here.
const WHATSAPP_NUMBER = "2348145856688";
const products = [
  {id:1,name:"Foreign Slippers",category:"ladies",price:7500,photo:"assets/foreign-slippers.jpg",tag:"WOMEN"},
  {id:2,name:"Foreign Cover Top",category:"ladies",price:7000,photo:"assets/foreign-cover-top.jpg",tag:"WOMEN"},
  {id:3,name:"Gold High Heel",category:"ladies",price:8000,photo:"assets/gold-high-heel.jpg",tag:"WOMEN"},
  {id:4,name:"Wrapped Insole",category:"men",price:12000,photo:"assets/wrapped-insole.jpg",tag:"MEN"},
  {id:5,name:"Wrapped Insole with Buckle Top",category:"men",price:12000,photo:"assets/wrapped-insole-buckle-top.jpg",tag:"MEN"},
  {id:6,name:"Flat Foreign Sole",category:"men",price:7500,photo:"assets/flat-foreign-sole.jpg",tag:"MEN"},
  {id:7,name:"Birkenstock Half Cover",category:"men",price:17500,photo:"assets/birkenstock-half-cover.jpg",tag:"MEN"},
];
let activeFilter = "all";
let cart = [];
const money = n => "₦" + Number(n).toLocaleString("en-NG");
const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");

function renderProducts(){
  const term = search.value.trim().toLowerCase();
  const shown = products.filter(p => (activeFilter==="all" || p.category===activeFilter) && p.name.toLowerCase().includes(term));
  grid.innerHTML = shown.length ? shown.map(p => `
    <article class="product-card">
      <div class="product-image" ${p.photo ? `style="background-image:url('${p.photo}');background-size:cover;background-position:center"` : ""}>
        <span class="photo-label">${p.tag}</span>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category==="men"?"Men's footwear":"Women's footwear"}</span>
        <h3>${p.name}</h3>
        <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}">Add to bag +</button></div>
      </div>
    </article>`).join("") : `<p class="no-results">No styles found. Try another search.</p>`;
}
function updateCart(){
  document.getElementById("cartCount").textContent = cart.reduce((n,x)=>n+x.qty,0);
  document.getElementById("cartTotal").textContent = money(cart.reduce((n,x)=>n+x.price*x.qty,0));
  const area=document.getElementById("cartItems");
  area.innerHTML=cart.length ? cart.map(x=>`<div class="cart-row"><div><strong>${x.name}</strong><small>${money(x.price)} each</small></div><div class="quantity"><button data-change="${x.id}" data-step="-1" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-change="${x.id}" data-step="1" aria-label="Increase quantity">+</button></div></div>`).join("") : `<p class="empty-cart">Your bag is empty. Find a pair you love.</p>`;
}
function openCart(){document.body.classList.add("drawer-open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){document.body.classList.remove("drawer-open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true")}
function notify(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
grid.addEventListener("click",e=>{const id=Number(e.target.dataset.add);if(!id)return;const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});updateCart();notify(`${p.name} added to your bag`)});
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeFilter=b.dataset.filter;renderProducts()}));
search.addEventListener("input",renderProducts);
document.getElementById("cartItems").addEventListener("click",e=>{const id=Number(e.target.dataset.change);if(!id)return;const item=cart.find(x=>x.id===id);item.qty+=Number(e.target.dataset.step);if(item.qty<=0)cart=cart.filter(x=>x.id!==id);updateCart()});
document.getElementById("cartOpen").addEventListener("click",openCart);
document.getElementById("cartClose").addEventListener("click",closeCart);
document.getElementById("drawerBackdrop").addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!cart.length){notify("Your bag is empty");return}
  const lines=cart.map(x=>`• ${x.name} x${x.qty} — ${money(x.price*x.qty)}`).join("\n");
  const total=cart.reduce((n,x)=>n+x.price*x.qty,0);
  const message=`Hello Tkay Footwears! I would like to enquire about this order:\n\n${lines}\n\nEstimated total: ${money(total)}\n\nPlease confirm availability, sizes, colours and delivery details.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});
document.getElementById("menuToggle").addEventListener("click",()=>{const nav=document.getElementById("mainNav");const isOpen=nav.classList.toggle("open");document.getElementById("menuToggle").setAttribute("aria-expanded",String(isOpen))});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCart();
