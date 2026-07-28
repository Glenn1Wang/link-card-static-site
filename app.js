(() => {
  "use strict";

  const SKELETON_COUNT = 10;
  const DEFAULT_TITLE = "选择开户银行";
  const DEFAULT_LABEL = "广发证券开户服务";
  const DEFAULT_DESCRIPTION = "选择银行后，将进入广发证券开户注册页面";

  const elements = {
    title: document.querySelector("#page-title"),
    label: document.querySelector("#page-label-text"),
    description: document.querySelector("#page-description"),
    metaDescription: document.querySelector("#meta-description"),
    list: document.querySelector("#bank-list"),
    status: document.querySelector("#page-status"),
    emptyState: document.querySelector("#empty-state"),
    errorState: document.querySelector("#error-state"),
    retryButton: document.querySelector("#retry-button"),
    template: document.querySelector("#bank-template"),
  };

  let activeRequest = 0;

  elements.retryButton.addEventListener("click", loadConfig);
  window.addEventListener("pageshow", clearNavigationState);
  loadConfig();

  async function loadConfig() {
    const requestId = ++activeRequest;
    showLoading();

    try {
      const response = await fetch("config.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const config = await response.json();
      if (requestId !== activeRequest) return;

      renderPage(config);
    } catch {
      if (requestId === activeRequest) showError();
    }
  }

  function renderPage(config) {
    const page = isRecord(config.page) ? config.page : {};
    const title = displayText(page.title, DEFAULT_TITLE);
    const label = displayText(page.label, DEFAULT_LABEL);
    const description = displayText(page.description, DEFAULT_DESCRIPTION);

    document.title = title;
    elements.title.textContent = title;
    elements.label.textContent = label;
    elements.description.textContent = description;
    elements.metaDescription.content = `${title}：${description}`;
    applyTheme(config.theme);

    const banks = Array.isArray(config.links)
      ? config.links.map(normalizeBank).filter(Boolean)
      : [];

    elements.list.replaceChildren();
    banks.forEach((bank) => renderBank(bank, description));
    elements.list.setAttribute("aria-busy", "false");
    elements.list.hidden = banks.length === 0;
    elements.status.hidden = true;
    elements.emptyState.hidden = banks.length > 0;
    elements.errorState.hidden = true;
  }

  function renderBank(bank, description) {
    const listItem = elements.template.content.firstElementChild.cloneNode(true);
    const link = listItem.querySelector(".bank-link");

    link.href = bank.url;
    link.setAttribute("aria-label", `${bank.name}，${destinationText(description)}`);
    link.querySelector(".bank-name").textContent = bank.name;
    link.addEventListener("click", () => link.classList.add("is-navigating"), {
      once: true,
    });

    if (bank.newTab) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.querySelector(".new-tab-label").hidden = false;
    }

    elements.list.append(listItem);
  }

  function showLoading() {
    elements.status.hidden = false;
    elements.status.textContent = "正在加载银行…";
    elements.emptyState.hidden = true;
    elements.errorState.hidden = true;
    elements.list.hidden = false;
    elements.list.setAttribute("aria-busy", "true");
    elements.list.replaceChildren(
      ...Array.from({ length: SKELETON_COUNT }, createSkeleton),
    );
  }

  function createSkeleton() {
    const item = document.createElement("li");
    item.className = "skeleton";
    item.setAttribute("aria-hidden", "true");
    return item;
  }

  function showError() {
    elements.list.replaceChildren();
    elements.list.setAttribute("aria-busy", "false");
    elements.list.hidden = true;
    elements.status.hidden = true;
    elements.emptyState.hidden = true;
    elements.errorState.hidden = false;
  }

  function clearNavigationState() {
    document.querySelectorAll(".bank-link.is-navigating").forEach((link) => {
      link.classList.remove("is-navigating");
    });
  }

  function destinationText(description) {
    return description.replace(/^选择银行后，?/, "").replace(/^将/, "");
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
