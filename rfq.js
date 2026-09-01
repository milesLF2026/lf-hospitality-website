/* Client-side RFQ list for LI & FUNG HOSPITALITY. Stored only in the visitor's browser. */
(function () {
  const STORAGE_KEY = "lf-hospitality-rfq";
  const collections = CATALOG.collections || [];
  const collectionById = new Map(collections.map((collection) => [collection.id, collection]));
  let memoryCart = [];

  const escapeHtml = (value) => String(value || "").replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  }[character]));

  const normalizeQuantity = (value) => Math.max(1, Math.round(Number(value) || 1));
  const readymadeId = (productName) => `readymade-${encodeURIComponent(productName)}`;

  function normalizeCart(cart) {
    return Array.isArray(cart) ? cart.map((item) => {
      if (item.type === "customize") return { ...item, moq: "To be confirmed" };
      if (item.type === "ffe-project") return { ...item, moq: "" };
      return item;
    }) : [];
  }

  function getCart() {
    try {
      return normalizeCart(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (_) {
      return normalizeCart(memoryCart);
    }
  }

  function saveCart(cart) {
    memoryCart = cart;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (_) { /* browser storage is optional */ }
    renderRfq();
  }

  function upsert(item, overwrite = false) {
    const cart = getCart();
    const index = cart.findIndex((entry) => entry.id === item.id);
    if (index === -1) cart.push(item);
    else if (overwrite) cart[index] = { ...cart[index], ...item };
    saveCart(cart);
  }

  function removeItem(id) {
    saveCart(getCart().filter((item) => item.id !== id));
  }

  function updateItem(id, changes) {
    saveCart(getCart().map((item) => item.id === id ? { ...item, ...changes } : item));
  }

  function itemForReadymade(product, quantity = 50, customNote = "") {
    const notes = [`Selected style: ${product.name}`, customNote.trim()].filter(Boolean).join("\n");
    return {
      id: readymadeId(product.name),
      type: "readymade",
      name: "Readymade Uniform",
      detail: product.name,
      quantity: normalizeQuantity(quantity),
      moq: "50 pcs",
      leadTime: "To be confirmed",
      notes,
    };
  }

  function addReadymade(productName, quantity = 50, note = "", overwrite = false) {
    const product = CATALOG.products.find((item) => item.name === productName);
    if (!product) return;
    upsert(itemForReadymade(product, quantity, note), overwrite);
  }

  function addStandardItem({ id, type, name, detail = "", moq = "To be confirmed", leadTime = "To be confirmed" }) {
    if (getCart().some((item) => item.id === id)) return;
    upsert({ id, type, name, detail, quantity: 1, moq, leadTime, notes: "" });
  }

  function openDrawer() {
    document.getElementById("rfq-drawer")?.classList.add("is-open");
    document.getElementById("rfq-overlay")?.classList.add("is-visible");
  }

  function closeDrawer() {
    document.getElementById("rfq-drawer")?.classList.remove("is-open");
    document.getElementById("rfq-overlay")?.classList.remove("is-visible");
  }

  function openCustomInquiry() {
    const modal = document.getElementById("custom-rfq-modal");
    if (!modal) return;
    const form = modal.querySelector("form");
    form.reset();
    form.elements.quantity.value = 50;
    modal.hidden = false;
    form.elements.quantity.focus();
  }

  function closeCustomInquiry() {
    const modal = document.getElementById("custom-rfq-modal");
    if (modal) modal.hidden = true;
  }

  function openFfeProjectInquiry() {
    const modal = document.getElementById("ffe-project-modal");
    if (!modal) return;
    const form = modal.querySelector("form");
    const existing = getCart().find((item) => item.id === "ffe-project");
    form.elements.projectName.value = existing?.projectName || "";
    form.elements.projectIntroduction.value = existing?.projectIntroduction || "";
    form.elements.deliveryTimeline.value = existing?.leadTime === "To be confirmed" ? "" : (existing?.leadTime || "");
    form.elements.additionalRequirements.value = existing?.additionalRequirements || "";
    modal.hidden = false;
    form.elements.projectIntroduction.focus();
  }

  function closeFfeProjectInquiry() {
    const modal = document.getElementById("ffe-project-modal");
    if (modal) modal.hidden = true;
  }

  function buildEmail() {
    const cart = getCart();
    if (!cart.length) return;
    const lines = [
      "Dear LI & FUNG HOSPITALITY Team,",
      "",
      "Please find our RFQ requirements below:",
      "",
    ];
    cart.forEach((item, index) => {
      lines.push(`${index + 1}. ${item.name}${item.detail ? ` — ${item.detail}` : ""}`);
      if (item.type !== "ffe-project") lines.push(`   Quantity: ${item.quantity}`);
      if (item.type !== "ffe-project") lines.push(`   MOQ: ${item.moq}`);
      lines.push(`   ${item.type === "ffe-project" ? "Requested delivery" : "Lead time"}: ${item.leadTime}`);
      if (item.notes.trim()) lines.push(`   Notes: ${item.notes.replace(/\n/g, "; ")}`);
      lines.push("");
    });
    lines.push("Best regards,");
    const [toRecipient, ...ccRecipients] = (CATALOG.company.emails || [CATALOG.company.email]).filter(Boolean);
    const subject = "RFQ Inquiry — LI & FUNG HOSPITALITY";
    const cc = ccRecipients.length ? `&cc=${encodeURIComponent(ccRecipients.join(","))}` : "";
    window.location.href = `mailto:${toRecipient}?subject=${encodeURIComponent(subject)}${cc}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  function renderRfq() {
    const cart = getCart();
    const totalQuantity = cart.reduce((total, item) => total + normalizeQuantity(item.quantity), 0);
    document.querySelectorAll("[data-rfq-count]").forEach((element) => { element.textContent = cart.length; });

    document.querySelectorAll("[data-rfq-add]").forEach((button) => {
      const id = button.dataset.rfqType === "readymade"
        ? readymadeId(button.dataset.rfqProduct)
        : button.dataset.rfqId;
      const selected = id && cart.some((item) => item.id === id);
      button.disabled = Boolean(selected);
      button.classList.toggle("is-added", Boolean(selected));
      button.textContent = selected ? "In RFQ" : "+ Add to RFQ";
    });
    document.querySelectorAll("[data-rfq-ffe-project]").forEach((button) => {
      const exists = cart.some((item) => item.id === "ffe-project");
      button.textContent = exists ? "Edit FF&E Project Inquiry" : "Start an FF&E Project Inquiry";
    });

    const body = document.getElementById("rfq-drawer-items");
    const summary = document.getElementById("rfq-summary");
    const emailButton = document.getElementById("rfq-email-button");
    if (!body || !summary || !emailButton) return;

    summary.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"} · Total quantity: ${totalQuantity}`;
    emailButton.disabled = !cart.length;
    body.innerHTML = cart.length ? cart.map((item) => `
      <article class="rfq-item">
        <div class="rfq-item-title">
          <div><h3>${escapeHtml(item.name)}</h3>${item.detail ? `<p>${escapeHtml(item.detail)}</p>` : ""}</div>
          <button type="button" class="rfq-remove" data-rfq-action="remove" data-rfq-id="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)}">Remove</button>
        </div>
        <div class="rfq-meta">${item.type !== "ffe-project" ? `<span>MOQ: ${escapeHtml(item.moq)}</span>` : ""}<span>${item.type === "ffe-project" ? "Requested delivery" : "Lead time"}: ${escapeHtml(item.leadTime)}</span></div>
        ${item.type !== "ffe-project" ? `<label class="rfq-field">Quantity
          <span class="rfq-quantity-control">
            <button type="button" data-rfq-action="decrease" data-rfq-id="${escapeHtml(item.id)}" aria-label="Decrease quantity">−</button>
            <input type="number" min="1" inputmode="numeric" value="${normalizeQuantity(item.quantity)}" data-rfq-quantity data-rfq-id="${escapeHtml(item.id)}" aria-label="Quantity for ${escapeHtml(item.name)}" />
            <button type="button" data-rfq-action="increase" data-rfq-id="${escapeHtml(item.id)}" aria-label="Increase quantity">+</button>
          </span>
        </label>` : ""}
        <label class="rfq-field">Notes
          <textarea rows="3" data-rfq-notes data-rfq-id="${escapeHtml(item.id)}" placeholder="Add sizes, logo, sampling or other requirements">${escapeHtml(item.notes)}</textarea>
        </label>
      </article>`).join("") : `<p class="rfq-empty">Your RFQ list is empty. Add items from Uniforms, OS&amp;E or FF&amp;E to get started.</p>`;
  }

  function createUi() {
    document.querySelectorAll(".site-header nav").forEach((nav) => {
      if (nav.querySelector(".rfq-nav-button")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rfq-nav-button";
      button.dataset.rfqAction = "open";
      button.innerHTML = `RFQ List <span data-rfq-count>0</span>`;
      nav.appendChild(button);
    });

    document.body.insertAdjacentHTML("beforeend", `
      <div id="rfq-overlay" class="rfq-overlay" data-rfq-action="close"></div>
      <aside id="rfq-drawer" class="rfq-drawer" aria-label="RFQ list" aria-live="polite">
        <div class="rfq-drawer-head"><div><p>Procurement inquiry</p><h2>RFQ List</h2></div><button type="button" data-rfq-action="close" aria-label="Close RFQ list">×</button></div>
        <div id="rfq-drawer-items" class="rfq-drawer-items"></div>
        <div class="rfq-drawer-footer"><p id="rfq-summary"></p><button id="rfq-email-button" class="rfq-email-button" type="button" data-rfq-action="email">Generate Inquiry Email</button></div>
      </aside>
      <button type="button" class="rfq-float-button" data-rfq-action="open" aria-label="Open RFQ list">RFQ <span data-rfq-count>0</span></button>
      <div id="custom-rfq-modal" class="modal custom-rfq-modal" hidden>
        <div class="modal-box custom-rfq-box">
          <button type="button" class="modal-close" data-rfq-action="close-custom" aria-label="Close custom uniform inquiry">×</button>
          <p class="rfq-modal-eyebrow">Customize Uniform</p><h2>Tell us what you need.</h2>
          <p class="rfq-modal-intro">Share your requirements and our team will prepare a tailored proposal.</p>
          <form id="custom-rfq-form" class="rfq-form">
            <label>Estimated quantity<input name="quantity" type="number" min="1" required /></label>
            <label>Role or use case<input name="useCase" type="text" placeholder="e.g. Front office team" /></label>
            <label>Design and color requirements<textarea name="design" rows="2" placeholder="Describe preferred styles, colors or fabrics"></textarea></label>
            <label>Logo, embroidery or print requirements<textarea name="branding" rows="2" placeholder="Describe branding requirements"></textarea></label>
            <label>Size breakdown<textarea name="sizes" rows="2" placeholder="e.g. S 20%, M 50%, L 30%"></textarea></label>
            <label>Additional notes<textarea name="additional" rows="2" placeholder="Add any other requirements"></textarea></label>
            <button class="rfq-form-submit" type="submit">Add Custom Inquiry to RFQ</button>
          </form>
        </div>
      </div>
      <div id="ffe-project-modal" class="modal custom-rfq-modal" hidden>
        <div class="modal-box custom-rfq-box">
          <button type="button" class="modal-close" data-rfq-action="close-ffe-project" aria-label="Close FF&E project inquiry">×</button>
          <p class="rfq-modal-eyebrow">FF&E Project Inquiry</p><h2>Tell us about your project.</h2>
          <p class="rfq-modal-intro">Share your project scope and required delivery timeline for a tailored FF&E proposal.</p>
          <form id="ffe-project-form" class="rfq-form">
            <label>Project name or reference<input name="projectName" type="text" placeholder="e.g. Coastal Resort Renovation" /></label>
            <label>Project introduction<textarea name="projectIntroduction" rows="4" required placeholder="Describe the property, spaces, furniture scope and key requirements"></textarea></label>
            <label>Required delivery timeline<input name="deliveryTimeline" type="text" required placeholder="e.g. Required by September 2026" /></label>
            <label>Additional requirements<textarea name="additionalRequirements" rows="3" placeholder="Add drawings, quantities, materials or other requirements"></textarea></label>
            <button class="rfq-form-submit" type="submit">Add FF&E Project to RFQ</button>
          </form>
        </div>
      </div>`);

    document.getElementById("custom-rfq-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const notes = [
        ["Role or use case", data.get("useCase")],
        ["Design and color requirements", data.get("design")],
        ["Logo, embroidery or print requirements", data.get("branding")],
        ["Size breakdown", data.get("sizes")],
        ["Additional notes", data.get("additional")],
      ].filter(([, value]) => String(value || "").trim()).map(([label, value]) => `${label}: ${String(value).trim()}`).join("\n");
      upsert({
        id: `customize-${Date.now()}`,
        type: "customize",
        name: "Customize Uniform",
        detail: "Custom uniform inquiry",
        quantity: normalizeQuantity(data.get("quantity")),
        moq: "To be confirmed",
        leadTime: "To be confirmed",
        notes,
      });
      closeCustomInquiry();
      openDrawer();
    });

    document.getElementById("ffe-project-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const introduction = String(data.get("projectIntroduction") || "").trim();
      const additionalRequirements = String(data.get("additionalRequirements") || "").trim();
      const projectName = String(data.get("projectName") || "").trim();
      const notes = [["Project introduction", introduction], ["Additional requirements", additionalRequirements]]
        .filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join("\n");
      upsert({
        id: "ffe-project",
        type: "ffe-project",
        name: "FF&E Project Inquiry",
        detail: projectName || "Custom Project",
        projectName,
        projectIntroduction: introduction,
        additionalRequirements,
        quantity: 1,
        moq: "",
        leadTime: String(data.get("deliveryTimeline") || "").trim(),
        notes,
      }, true);
      closeFfeProjectInquiry();
      openDrawer();
    });

    document.addEventListener("click", (event) => {
      const target = event.target.closest?.("[data-rfq-action], [data-rfq-add]");
      if (!target) return;
      if (target.matches("[data-rfq-add]")) {
        event.preventDefault();
        event.stopPropagation();
        if (target.disabled) return;
        if (target.dataset.rfqType === "readymade") addReadymade(target.dataset.rfqProduct);
        else addStandardItem({ id: target.dataset.rfqId, type: target.dataset.rfqType, name: target.dataset.rfqName, detail: target.dataset.rfqDetail || "" });
        return;
      }
      const action = target.dataset.rfqAction;
      if (action === "open") openDrawer();
      if (action === "close") closeDrawer();
      if (action === "custom-uniform") openCustomInquiry();
      if (action === "ffe-project") openFfeProjectInquiry();
      if (action === "close-custom") closeCustomInquiry();
      if (action === "close-ffe-project") closeFfeProjectInquiry();
      if (action === "remove") removeItem(target.dataset.rfqId);
      if (action === "increase" || action === "decrease") {
        const item = getCart().find((entry) => entry.id === target.dataset.rfqId);
        if (item) updateItem(item.id, { quantity: normalizeQuantity(item.quantity + (action === "increase" ? 1 : -1)) });
      }
      if (action === "email") buildEmail();
    }, true);

    document.addEventListener("change", (event) => {
      const target = event.target;
      if (target.matches?.("[data-rfq-quantity]")) updateItem(target.dataset.rfqId, { quantity: normalizeQuantity(target.value) });
      if (target.matches?.("[data-rfq-notes]")) updateItem(target.dataset.rfqId, { notes: target.value });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { closeDrawer(); closeCustomInquiry(); closeFfeProjectInquiry(); }
    });
  }

  function renderProductForm(product) {
    const slot = document.getElementById("m-rfq");
    if (!slot) return;
    const collection = collectionById.get(product.collection);
    if (collection?.series !== "readymade") { slot.innerHTML = ""; return; }
    slot.innerHTML = `
      <form class="rfq-product-form">
        <p class="rfq-modal-eyebrow">Readymade Uniform</p>
        <div class="rfq-product-fields">
          <label>Quantity<input name="quantity" type="number" min="1" value="50" required /></label>
          <label>Custom notes<textarea name="notes" rows="3" placeholder="e.g. Logo embroidery, size breakdown or sampling requirements"></textarea></label>
        </div>
        <p class="rfq-modal-meta">MOQ: 50 pcs <span>Lead time: To be confirmed</span></p>
        <button class="rfq-form-submit" type="submit">Add to RFQ</button>
      </form>`;
    slot.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      addReadymade(product.name, data.get("quantity"), String(data.get("notes") || ""), true);
      openDrawer();
    });
  }

  window.RFQ = { renderProductForm, openCustomInquiry, refresh: renderRfq };
  createUi();
  renderRfq();
})();
