export default function loaderInContainer(containerEl:HTMLElement,status:"show"|"hide"){
    let loaderEl = containerEl.querySelector(".loader-container") as HTMLElement;


    if(status=="show"){
        loaderEl.classList.remove("d-none");
    }else if(status=="hide"){
        loaderEl.classList.add("d-none");
    }
}