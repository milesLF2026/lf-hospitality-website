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

  // Group uniform products into their series, then by Case collection.
  const collections = CATALOG.collections || [];
  const uniformSeries = CATALOG.uniformSeries || [];

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

  const renderedCollectionIds = new Set();

  const appendCollection = (parent, collection, items) => {
    if (collection) {
      const head = document.createElement("div");
      head.className = "collection-head";
      head.innerHTML = `<h4>${collection.title}</h4>` +
        (collection.blurb ? `<p>${collection.blurb}</p>` : "");
      parent.appendChild(head);
    }
    const row = document.createElement("div");
    row.className = "product-row";
    items.forEach((p) => row.appendChild(renderCard(p)));
    parent.appendChild(row);
  };

  uniformSeries.forEach((series) => {
    const seriesCollections = collections
      .filter((collection) => collection.series === series.id)
      .map((collection) => ({
        collection,
        items: liveProducts.filter((p) => p.collection === collection.id),
      }))
      .filter((group) => group.items.length);

    if (!seriesCollections.length) return;

    const section = document.createElement("section");
    section.className = "uniform-series";
    section.innerHTML = `<div class="series-head"><h3>${series.title}</h3>` +
      (series.blurb ? `<p>${series.blurb}</p>` : "") + "</div>";

    seriesCollections.forEach(({ collection, items }) => {
      renderedCollectionIds.add(collection.id);
      appendCollection(section, collection, items);
    });
    grid.appendChild(section);
  });

  // Keep any future collections without a series visible instead of hiding them.
  collections.forEach((collection) => {
    if (renderedCollectionIds.has(collection.id)) return;
    const items = liveProducts.filter((p) => p.collection === collection.id);
    if (items.length) appendCollection(grid, collection, items);
  });

  const rest = liveProducts.filter((p) => !p.collection);
  if (rest.length) appendCollection(grid, null, rest);

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
