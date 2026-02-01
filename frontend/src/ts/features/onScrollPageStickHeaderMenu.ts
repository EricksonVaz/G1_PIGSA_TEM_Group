const mainHeader = document.querySelector(".main-header") as HTMLElement | null;

export function onScrollPageStickHeaderMenu() {
  if (!mainHeader) return;

  let isStuck = false;   // estado atual
  let ticking = false;   // se já há rAF agendado

  const update = () => {
    const shouldStick = window.scrollY > 0;

    // só mexe na classe se realmente mudou (evita trabalho desnecessário)
    if (shouldStick !== isStuck) {
      isStuck = shouldStick;
      if (isStuck) {
        mainHeader.classList.add("is-stick");
      } else {
        mainHeader.classList.remove("is-stick");
      }
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    },
    { passive: true } // não bloqueia o scroll
  );
}
