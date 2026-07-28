(() => {
  "use strict";

  const elements = {
    title: document.querySelector("#page-title"),
    label: document.querySelector("#page-label"),
    metaDescription: document.querySelector("#meta-description"),
    list: document.querySelector("#bank-list"),
    status: document.querySelector("#page-status"),
    emptyState: document.querySelector("#empty-state"),
    errorState: document.querySelector("#error-state"),
    template: document.querySelector("#bank-template"),
  };

  loadConfig();

  async function loadConfig() {
    try {
      const response = await fetch("config.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      renderPage(await response.json());
    } catch {
      showError();
    }
  }

  function renderPage(config) {
    const page = isRecord(config.page) ? config.page : {};
    const title = displayText(page.title, "选择开户银行");

    document.title = title;
    elements.title.textContent = title;
    elements.label.textContent = displayText(page.label, "开启投资账户");
    elements.metaDescription.content = title;
    applyTheme(config.theme);

    const banks = Array.isArray(config.links)
      ? config.links.map(normalizeBank).filter(Boolean)
      : [];

    elements.list.replaceChildren();
    banks.forEach(renderBank);
    elements.list.setAttribute("aria-busy", "false");
    elements.status.hidden = true;
    elements.emptyState.hidden = banks.length > 0;
  }

  function renderBank(bank, index) {
    const listItem = elements.template.content.firstElementChild.cloneNode(true);
    const link = listItem.querySelector(".bank-link");

    listItem.style.setProperty("--order", String(index));
    link.href = bank.url;
    link.querySelector(".bank-name").textContent = bank.name;

    if (bank.newTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.querySelector(".new-tab-label").hidden = false;
    }

    elements.list.append(listItem);
  }

  function normalizeBank(value) {
    if (!isRecord(value)) return null;

    const name = displayText(value.name, "");
    const url = toSafeHttpUrl(value.url);
    if (!name || !url) return null;

    return { name, url, newTab: value.newTab === true };
  }

  function applyTheme(themeValue) {
    const theme = isRecord(themeValue) ? themeValue : {};
    if (typeof theme.accent === "string" && /^#[0-9a-f]{6}$/i.test(theme.accent)) {
      document.documentElement.style.setProperty("--brand", theme.accent);
    }
  }

  function showError() {
    elements.list.replaceChildren();
    elements.list.setAttribute("aria-busy", "false");
    elements.status.hidden = true;
    elements.emptyState.hidden = true;
    elements.errorState.hidden = false;
  }

  function displayText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback;
  }

  function isRecord(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function toSafeHttpUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
    } catch {
      return null;
    }
  }
})();
