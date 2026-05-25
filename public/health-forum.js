// ==============================
// Header active state + Mobile nav auto scroll
// ==============================
const nav = document.querySelector(".nav");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = Array.from(document.querySelectorAll("[data-section]"));
const brandLink = document.querySelector(".brand");

let isManualScrolling = false;
let manualScrollTimer = null;

function centerMobileNav(activeLink) {
  if (!nav || !activeLink || window.innerWidth > 760) return;

  const navRect = nav.getBoundingClientRect();
  const linkRect = activeLink.getBoundingClientRect();

  const targetLeft =
    nav.scrollLeft +
    (linkRect.left - navRect.left) -
    navRect.width / 2 +
    linkRect.width / 2;

  nav.scrollTo({
    left: targetLeft,
    behavior: "smooth",
  });
}

function setActiveNav(targetId, shouldCenterNav = true) {
  const activeHref = "#" + targetId;

  navLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === activeHref;

    link.classList.toggle("is-active", isCurrent);

    if (!isCurrent) {
      link.blur();
    }
  });

  const activeLink = navLinks.find((link) => {
    return link.getAttribute("href") === activeHref;
  });

  if (shouldCenterNav) {
    centerMobileNav(activeLink);
  }
}

function getHeaderOffset() {
  const header = document.querySelector(".site-header");

  if (!header) return 100;

  return header.offsetHeight - 4;
}

function getCurrentSectionId() {
  const offset = getHeaderOffset();
  const checkPoint = offset + window.innerHeight * 0.38;

  let currentSectionId = sections[0]?.id;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= checkPoint) {
      currentSectionId = section.id;
    }
  });

  return currentSectionId;
}

function updateActiveByScroll() {
  if (isManualScrolling) return;

  const currentSectionId = getCurrentSectionId();

  if (!currentSectionId) return;

  setActiveNav(currentSectionId, true);
}

function scrollToTarget(targetId) {
  const target = document.getElementById(targetId);

  if (!target) return;

  isManualScrolling = true;

  const offset = getHeaderOffset();
  const targetTop =
    target.getBoundingClientRect().top + window.pageYOffset - offset;

  window.scrollTo({
    top: targetTop,
    behavior: "smooth",
  });

  setActiveNav(targetId, false);

  setTimeout(() => {
    const activeLink = navLinks.find((link) => {
      return link.getAttribute("href") === "#" + targetId;
    });

    centerMobileNav(activeLink);
  }, 280);

  clearTimeout(manualScrollTimer);

  manualScrollTimer = setTimeout(() => {
    isManualScrolling = false;
    updateActiveByScroll();
  }, 1300);
}

if (navLinks.length && sections.length) {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) return;

      const targetId = href.replace("#", "");

      event.preventDefault();

      link.blur();

      scrollToTarget(targetId);
    });
  });

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveByScroll);
  });

  updateActiveByScroll();
}

if (brandLink) {
  brandLink.addEventListener("click", (event) => {
    const href = brandLink.getAttribute("href");

    if (!href || !href.startsWith("#")) return;

    const targetId = href.replace("#", "");

    event.preventDefault();

    brandLink.blur();

    scrollToTarget(targetId);
  });
}

// ==============================
// Story tabs：如果頁面沒有 story-tab，就不執行
// ==============================
const stories = {
  signal: {
    title: "身體先說話",
    copy: "從睡眠、疲倦、心悸與消化不適開始，讓觀眾理解身體訊號不是小題大作，而是值得被照顧的提醒。",
  },
  stress: {
    title: "壓力不只在心裡",
    copy: "以日常工作節奏切入，呈現情緒壓力如何影響專注、代謝與恢復能力，將抽象感受轉為可討論的健康議題。",
  },
  balance: {
    title: "失衡之前的提醒",
    copy: "聚焦內分泌節律與生活習慣，提醒觀眾在明顯症狀之前，就有機會從身體變化中看見調整窗口。",
  },
};

const storyTabs = document.querySelectorAll(".story-tab");
const storyTitle = document.getElementById("storyTitle");
const storyCopy = document.getElementById("storyCopy");

if (storyTabs.length && storyTitle && storyCopy) {
  storyTabs.forEach((button) => {
    button.addEventListener("click", () => {
      const data = stories[button.dataset.story];

      if (!data) return;

      storyTabs.forEach((tab) => {
        tab.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      storyTitle.textContent = data.title;
      storyCopy.textContent = data.copy;
    });
  });
}


// ==============================
// Lineup filter：第 05 區分類切換
// ==============================
const filterButtons = document.querySelectorAll(".filter-btn");
const speakerCards = document.querySelectorAll(".speaker");

if (filterButtons.length && speakerCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.remove("is-selected");
      });

      button.classList.add("is-selected");

      speakerCards.forEach((card) => {
        const role = card.dataset.role;
        const shouldShow = filter === "all" || role === filter;

        card.classList.toggle("hidden", !shouldShow);
      });
    });
  });
}