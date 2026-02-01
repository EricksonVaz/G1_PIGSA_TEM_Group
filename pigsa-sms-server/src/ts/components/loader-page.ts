import { hideBackdrop, showBackDrop } from "./backdrop";

export let loaderPageComponent = `
    <div class="loader-page d-none">
        <div class="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </div>
`;

export function showLoaderPage(){
    let loaderPage = document.querySelector(".loader-page") as HTMLDivElement;

    showBackDrop();

    loaderPage.classList.remove("d-none");
}

export function hideLoaderPage(){
    let loaderPage = document.querySelector(".loader-page") as HTMLDivElement;

    hideBackdrop();

    loaderPage.classList.add("d-none");
}