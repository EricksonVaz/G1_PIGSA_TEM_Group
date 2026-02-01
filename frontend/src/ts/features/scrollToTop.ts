export function scrollToTopFeature() {
  const scrollToTopBtn = document.querySelector(".scroll-to-top") as HTMLElement | null;

  scrollToTopBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

export function onWindowScroll() {
  const scrollToTopBtn = document.querySelector(".scroll-to-top") as HTMLElement | null;
  if (!scrollToTopBtn) return;

  let visible = false;
  let ticking = false;

  const updateVisibility = () => {
    const shouldShow = window.scrollY > 0;

    if (shouldShow !== visible) {
      visible = shouldShow;

      if (visible) scrollToTopBtn.classList.remove("d-none");
      else scrollToTopBtn.classList.add("d-none");
    }
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateVisibility);
      }
    },
    { passive: true }
  );
}
