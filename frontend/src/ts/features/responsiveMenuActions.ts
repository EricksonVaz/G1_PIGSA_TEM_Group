let superHeaderEl = document.querySelector(".super-header") as HTMLDivElement;
let btnSiteSetingsHeader = superHeaderEl?.querySelector(".btn-settings-page") as HTMLButtonElement;
let responsiveMenuSetings = document.querySelector(".responsive-menu") as HTMLDivElement;
let btnShowNavMenuResponsive = document.querySelector(".btn-responsive-menu") as HTMLButtonElement;
let mainNavigation = document.querySelector(".main-navigation") as HTMLElement;

export function superHeadMenuConfig(){
    
    btnSiteSetingsHeader?.addEventListener("click", () => {
        // Alterna visibilidade do menu
        responsiveMenuSetings?.classList.toggle("show");
        // Garante foco no botão (para o focusout funcionar depois)
        btnSiteSetingsHeader?.focus();
    });

    btnSiteSetingsHeader?.addEventListener("focusout", (e) => {
        // Só fecha se o novo foco não estiver dentro do menu
        const newFocus = e.relatedTarget as HTMLElement | null;
        if (!newFocus || !responsiveMenuSetings?.contains(newFocus)) {
            responsiveMenuSetings?.classList.remove("show");
        }
    });

    // Impede que o clique dentro do menu remova o foco do botão
    responsiveMenuSetings?.addEventListener("mousedown", (e) => {
        e.preventDefault();
    });
}

export function navigationMenu(){
    btnShowNavMenuResponsive?.addEventListener("click", () => {
        // Alterna visibilidade do menu
        mainNavigation.classList?.toggle("show");
        // Garante foco no botão (para o focusout funcionar depois)
        btnShowNavMenuResponsive?.focus();
    });

    btnShowNavMenuResponsive?.addEventListener("focusout", (e) => {
        // Só fecha se o novo foco não estiver dentro do menu
        const newFocus = e.relatedTarget as HTMLElement | null;
        if (!newFocus || !mainNavigation?.contains(newFocus)) {
            mainNavigation?.classList.remove("show");
        }
    });

    // Impede que o clique dentro do menu remova o foco do botão
    mainNavigation?.addEventListener("mousedown", (e) => {
        e.preventDefault();
    });
}