export let backdropComponent = `
    <div class="backdrop d-none">
    </div>
`;

export function showBackDrop(){
    let backdropElement = document.querySelector(".backdrop") as HTMLDivElement;

    backdropElement.classList.remove("d-none");
}

export function hideBackdrop(){
    let backdropElement = document.querySelector(".backdrop") as HTMLDivElement;

    backdropElement.classList.add("d-none");
}