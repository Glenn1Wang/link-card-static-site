(() => {
  "use strict";

  const elements = {
    title: document.querySelector("#page-title"),
    eyebrow: document.querySelector("#page-eyebrow"),
    description: document.querySelector("#page-description"),
    metaDescription: document.querySelector("#meta-description"),
    sectionTitle: document.querySelector("#section-title"),
    adviserCard: document.querySelector("#adviser-card"),
    adviserLabel: document.querySelector("#adviser-label"),
    adviserName: document.querySelector("#adviser-name"),
    adviserTitle: document.querySelector("#adviser-title"),
    list: document.querySelector("#bank-list"),
    count: document.querySelector("#link-count"),
    status: document.querySelector("#page-status"),
    emptyState: document.querySelector("#empty-state"),
    errorState: document.querySelector("#error-state"),
    notice: document.querySelector("#notice"),
    noticeTitle: document.querySelector("#notice-title"),
    noticeCopy: document.querySelector("#notice-copy"),
    footer: document.querySelector("#site-footer"),
    template: document.querySelector("#bank-template"),
  };

  loadConfig();

  async function loadConfig() {
    try {
      const response = await fetch("config.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const config = await response.json();
      renderPage(config);
    } catch {
      showError();
    }
  }

  function renderPage(config) {
    const page = isRecord(config.page) ? config.page : {};
    const title = displayText(page.title, "银行开户链接");
    const description = displayText(page.description, "");

    document.title = title;
    elements.title.textContent = title;
    elements.eyebrow.textContent = displayText(page.eyebrow, "BANK ACCESS");
    elements.description.textContent = description;
    elements.description.hidden = description.length === 0;
    elements.metaDescription.content = description || title;
    elements.sectionTitle.textContent = displayText(page.sectionTitle, "选择开户银行");

    renderAdviser(page.adviser);
    renderNotice(page);
    elements.footer.textContent = displayText(page.footer, "");
    elements.footer.hidden = elements.footer.textContent.length === 0;
    applyTheme(config.theme);

    const banks = Array.isArray(config.links)
      ? config.links.filter((bank) => isRecord(bank) && displayText(bank.name, ""))
      : [];

    elements.list.replaceChildren();
    banks.forEach((bank, index) => renderBank(bank, index));
    elements.list.setAttribute("aria-busy", "false");
    elements.status.hidden = true;
    elements.count.textContent = banks.length > 0 ? `${banks.length} 家银行` : "";
    elements.emptyState.hidden = banks.length > 0;
  }

  function renderBank(bank, index) {
    const listItem = elements.template.content.firstElementChild.cloneNode(true);
    let card = listItem.querySelector(".bank-card");
    const name = displayText(bank.name, "未命名银行");
    const description = displayText(bank.description, "点击进入专属开户链接");
    const badge = displayText(bank.badge, "");
    const safeUrl = toSafeHttpUrl(bank.url);
    const isEnabled = bank.enabled !== false && safeUrl !== null;

    listItem.style.setProperty("--order", String(index));
    card.querySelector(".bank-number").textContent = String(index + 1).padStart(2, "0");
    card.querySelector(".bank-name").textContent = name;
    card.querySelector(".bank-description").textContent = description;

    const badgeElement = card.querySelector(".bank-badge");
    badgeElement.textContent = badge || (isEnabled ? "" : "链接待配置");
    badgeElement.hidden = badgeElement.textContent.length === 0;

    if (isEnabled) {
      card.href = safeUrl;
      if (bank.newTab !== false) {
        card.target = "_blank";
        card.rel = "noopener noreferrer";
        card.querySelector(".new-tab-label").hidden = false;
      }
    } else {
      const disabledCard = document.createElement("div");
      disabledCard.className = `${card.className} is-disabled`;
      disabledCard.setAttribute("aria-disabled", "true");
      disabledCard.append(...card.childNodes);
      card.replaceWith(disabledCard);
      card = disabledCard;
      card.querySelector(".bank-arrow").textContent = "—";
    }

    elements.list.append(listItem);
  }

  function renderAdviser(adviserValue) {
    const adviser = isRecord(adviserValue) ? adviserValue : {};
    const name = displayText(adviser.name, "");

    elements.adviserCard.hidden = name.length === 0;
    elements.adviserLabel.textContent = displayText(adviser.label, "服务顾问");
    elements.adviserName.textContent = name;
    elements.adviserTitle.textContent = displayText(adviser.title, "");
    elements.adviserTitle.hidden = elements.adviserTitle.textContent.length === 0;
  }

  function renderNotice(page) {
    const title = displayText(page.noticeTitle, "");
    const copy = displayText(page.notice, "");

    elements.notice.hidden = title.length === 0 && copy.length === 0;
    elements.noticeTitle.textContent = title;
    elements.noticeTitle.hidden = title.length === 0;
    elements.noticeCopy.textContent = copy;
    elements.noticeCopy.hidden = copy.length === 0;
  }

  function applyTheme(themeValue) {
    const theme = isRecord(themeValue) ? themeValue : {};
    if (typeof theme.accent === "string" && /^#[0-9a-f]{6}$/i.test(theme.accent)) {
      document.documentElement.style.setProperty("--accent", theme.accent);
    }
  }

  function showError() {
    elements.list.replaceChildren();
    elements.list.setAttribute("aria-busy", "false");
    elements.status.hidden = true;
    elements.count.textContent = "";
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
