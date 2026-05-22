// ==============================
// Header active state
// ==============================
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const sections = Array.from(document.querySelectorAll("[data-section]"));

if (navLinks.length && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") === "#" + visible.target.id
        );
      });
    },
    {
      threshold: [0.28, 0.45, 0.62],
    }
  );

  sections.forEach((section) => observer.observe(section));
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