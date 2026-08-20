/* LI & FUNG HOSPITALITY catalog site — renders data/catalog.js. No build step needed. */

(function () {
  const { company, categories, products } = CATALOG;

  // Hero & contact
  document.getElementById("hero-tagline").textContent = company.tagline;
  document.getElementById("hero-intro").textContent = company.intro;
  const mail = document.getElementById("contact-email");
  const emails = company.emails || [company.email];
  emails.forEach((email, index) => {
    if (index > 0) mail.appendChild(document.createTextNode(" / "));
    const link = document.createElement("a");
    link.textContent = email;
    link.href = "mailto:" + email;
    mail.appendChild(link);
  });
  document.getElementById("year").textContent = new Date().getFullYear();

  // Products for live categories
  const liveNames = categories.filter((c) => c.live).map((c) => c.en);
  const liveProducts = products.filter((p) => liveNames.includes(p.category));

  const grid = document.getElementById("product-grid");
  grid.innerHTML = liveProducts.length
    ? ""
    : "<p class='empty'>Products coming soon.</p>";

  // Group products by collection (if any) and render each group
  // under its own header; products without a collection go last.
  const cols = CATALOG.collections || [];
  const groups = [];
  cols.forEach((c) => {
    const items = liveProducts.filter((p) => p.collection === c.id);
    if (items.length) groups.push({ title: c.title, blurb: c.blurb, items });
  });
  const rest = liveProducts.filter((p) => !p.collection);
  if (rest.length) groups.push({ title: null, blurb: null, items: rest });

  const renderCard = (p) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">
        <img src="${p.image}" alt="${p.name}"
             onerror="this.parentNode.classList.add('no-img');this.remove();" />
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
      </div>`;
    card.onclick = () => openModal(p);
    return card;
  };

  groups.forEach((g) => {
    if (g.title) {
      const head = document.createElement("div");
      head.className = "collection-head";
      head.innerHTML = `<h3>${g.title}</h3>` +
        (g.blurb ? `<p>${g.blurb}</p>` : "");
      grid.appendChild(head);
    }
    const row = document.createElement("div");
    row.className = "product-row";
    g.items.forEach((p) => row.appendChild(renderCard(p)));
    grid.appendChild(row);
  });

  // Category directory
  const catGrid = document.getElementById("category-grid");
  categories
    .filter((c) => !c.live)
    .forEach((c) => {
      const el = document.createElement("div");
      el.className = "cat-card";
      el.innerHTML = `
        <div class="cat-img">
          <img src="${c.image || ""}" alt="${c.en}"
               onerror="this.parentNode.remove();" />
        </div>
        <h3>${c.en}</h3>
        <p>${c.blurb || ""}</p>
        <ul>${c.subs.map((s) => `<li>${s}</li>`).join("")}</ul>
        <span class="badge">Coming soon</span>`;
      catGrid.appendChild(el);
    });
})();

function openModal(p) {
  const m = document.getElementById("modal");
  const img = document.getElementById("m-img");
  img.src = p.image;
  img.alt = p.name;
  img.onerror = () => (img.style.display = "none");
  img.onload = () => (img.style.display = "");
  document.getElementById("m-name").textContent = p.name;
  document.getElementById("m-desc").textContent = p.description || "";
  document.getElementById("m-specs").innerHTML = Object.entries(p.specs || {})
    .map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`)
    .join("");
  m.hidden = false;
}

function closeModal() {
  document.getElementById("modal").hidden = true;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});
