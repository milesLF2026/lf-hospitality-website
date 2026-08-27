/* LI & FUNG HOSPITALITY catalog site — renders data/catalog.js. No build step needed. */

(function () {
  const { company, categories, products } = CATALOG;

  // Render only the shared elements that exist on the current page.
  const heroTagline = document.getElementById("hero-tagline");
  const heroIntro = document.getElementById("hero-intro");
  if (heroTagline) heroTagline.textContent = company.tagline;
  if (heroIntro) heroIntro.textContent = company.intro;

  const mail = document.getElementById("contact-email");
  if (mail) {
    const emails = company.emails || [company.email];
    emails.forEach((email, index) => {
      if (index > 0) mail.appendChild(document.createTextNode(" / "));
      const link = document.createElement("a");
      link.textContent = email;
      link.href = "mailto:" + email;
      mail.appendChild(link);
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Products for live categories
  const liveNames = categories.filter((c) => c.live).map((c) => c.en);
  const liveProducts = products.filter((p) => liveNames.includes(p.category));

  const grid = document.getElementById("product-grid");
  if (grid) {
    grid.innerHTML = "";

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

  const populatedSeries = uniformSeries
    .map((series) => ({
      series,
      collections: collections
        .filter((collection) => collection.series === series.id)
        .map((collection) => ({
          collection,
          items: liveProducts.filter((p) => p.collection === collection.id),
        }))
        .filter((group) => group.items.length),
    }))
    .filter((group) => group.collections.length);

  const tabs = [];
  const panels = [];
  const activateSeries = (seriesId, moveFocus = false) => {
    tabs.forEach(({ id, button }) => {
      const active = id === seriesId;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && moveFocus) button.focus();
    });
    panels.forEach(({ id, panel }) => {
      panel.hidden = id !== seriesId;
    });
  };

  if (populatedSeries.length > 1) {
    const switcher = document.createElement("div");
    switcher.className = "series-switcher";
    switcher.setAttribute("role", "tablist");
    switcher.setAttribute("aria-label", "Uniform series");
    grid.appendChild(switcher);

    populatedSeries.forEach(({ series, collections: seriesCollections }, index) => {
      const tabId = `uniform-series-tab-${series.id}`;
      const panelId = `uniform-series-panel-${series.id}`;
      const button = document.createElement("button");
      button.className = "series-tab";
      button.type = "button";
      button.id = tabId;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panelId);
      button.textContent = series.title;
      button.addEventListener("click", () => activateSeries(series.id));
      switcher.appendChild(button);
      tabs.push({ id: series.id, button });

      const section = document.createElement("section");
      section.className = "uniform-series";
      section.id = panelId;
      section.setAttribute("role", "tabpanel");
      section.setAttribute("aria-labelledby", tabId);
      section.hidden = index !== 0;
      section.innerHTML = `<div class="series-head"><h3>${series.title}</h3>` +
        (series.blurb ? `<p>${series.blurb}</p>` : "") + "</div>";

      seriesCollections.forEach(({ collection, items }) => {
        renderedCollectionIds.add(collection.id);
        appendCollection(section, collection, items);
      });
      grid.appendChild(section);
      panels.push({ id: series.id, panel: section });
    });

    tabs.forEach(({ id, button }, index) => {
      button.addEventListener("keydown", (event) => {
        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        activateSeries(tabs[nextIndex].id, true);
      });
    });
    activateSeries(populatedSeries[0].series.id);
  } else {
    populatedSeries.forEach(({ series, collections: seriesCollections }) => {
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
  }

  // Keep any future collections without a series visible instead of hiding them.
  collections.forEach((collection) => {
    if (renderedCollectionIds.has(collection.id)) return;
    const items = liveProducts.filter((p) => p.collection === collection.id);
    if (items.length) appendCollection(grid, collection, items);
  });

    const rest = liveProducts.filter((p) => !p.collection);
    if (rest.length) appendCollection(grid, null, rest);
  }

  // OS&E Catalog: render every subcategory as an image card under its major category.
  const catGrid = document.getElementById("category-grid");
  if (catGrid) {
    categories
      .filter((category) => !category.live)
      .forEach((category) => {
        const section = document.createElement("section");
        section.className = "ose-category";
        section.innerHTML = `<div class="ose-category-head"><h2>${category.en}</h2>` +
          (category.blurb ? `<p>${category.blurb}</p>` : "") + "</div>";

        const subGrid = document.createElement("div");
        subGrid.className = "ose-subcategory-grid";
        category.subs.forEach((sub) => {
          const name = typeof sub === "string" ? sub : sub.name;
          const image = typeof sub === "string" ? "" : sub.image;
          const card = document.createElement("article");
          card.className = "ose-subcategory-card";
          card.innerHTML = `
            <div class="ose-subcategory-image">
              <img src="${image}" alt="${name}" loading="lazy" />
            </div>
            <h3>${name}</h3>`;
          subGrid.appendChild(card);
        });
        section.appendChild(subGrid);
        catGrid.appendChild(section);
      });
  }
})();

function openModal(p) {
  const m = document.getElementById("modal");
  if (!m) return;
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
  const modal = document.getElementById("modal");
  if (modal) modal.hidden = true;
}

const modal = document.getElementById("modal");
if (modal) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
  modal.addEventListener("click", (e) => {
    if (e.target.id === "modal") closeModal();
  });
}
