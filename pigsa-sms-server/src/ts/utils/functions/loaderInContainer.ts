export function loaderInContainer(loaderRef:string){
    let loaderElement = document.querySelector(loaderRef) as HTMLDivElement;

    function show(){
        loaderElement.classList.remove("d-none");
    }

    function hide(){
        loaderElement.classList.add("d-none");
    }

    return {show,hide};
}

export type TLoaderInContainer = {
    show: () => void;
    hide: () => void;
}