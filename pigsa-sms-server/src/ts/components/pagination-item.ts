import { IPaginationInfo } from "../utils/interfaces/IPaginationInfo";

type cbOnNavigation = (container:HTMLElement,paginationContainer:HTMLElement,newFullLInk:string,queryStings:string)=>void;

export function paginationItem(paginationInfo:IPaginationInfo,queryStings:string=""){
    let {page,totalPage,perPage,total,navigationLink} = paginationInfo;
    let templatePageItem = "";

    if(totalPage>1){

        if(totalPage>=7){
            if(page<3){
               for (let i = 1; i <= 3; i++) {
                    if(i==page){
                        templatePageItem += `<span class="page-item active" data-page="${i}">${i}</span>`;
                    }else{
                        templatePageItem += `<span class="page-item" data-page="${i}">${i}</span>`;
                    }
                }
                templatePageItem += `
                    <span class="ellipse-page-item">...</span>
                    <span class="page-item" data-page="${totalPage-1}">${totalPage-1}</span>
                    <span class="page-item" data-page="${totalPage}">${totalPage}</span>
                `;
            }else if(page==3){
                templatePageItem += `
                    <span class="page-item" data-page="1">1</span>
                    <span class="ellipse-page-item">...</span>
                `;
                for (let i = 3; i <= 5; i++) {
                    if(i==page){
                        templatePageItem += `<span class="page-item active" data-page="${i}">${i}</span>`;
                    }else{
                        templatePageItem += `<span class="page-item" data-page="${i}">${i}</span>`;
                    }
                }
                templatePageItem += `
                    <span class="ellipse-page-item">...</span>
                    <span class="page-item" data-page="${totalPage-1}">${totalPage-1}</span>
                    <span class="page-item" data-page="${totalPage}">${totalPage}</span>
                `;
            }else if(page>=4 && page<(totalPage-4)){
                templatePageItem += `
                    <span class="page-item" data-page="1">1</span>
                    <span class="ellipse-page-item">...</span>
                    <span class="page-item" data-page="${page-1}">${page-1}</span>
                `;
                for (let i = page; i <= page+2; i++) {
                    if(i==page){
                        templatePageItem += `<span class="page-item active" data-page="${i}">${i}</span>`;
                    }else{
                        templatePageItem += `<span class="page-item" data-page="${i}">${i}</span>`;
                    }
                }
                templatePageItem += `
                    <span class="ellipse-page-item">...</span>
                    <span class="page-item" data-page="${totalPage-1}">${totalPage-1}</span>
                    <span class="page-item" data-page="${totalPage}">${totalPage}</span>
                `;
            }else{
                templatePageItem += `
                    <span class="page-item" data-page="1">1</span>
                    <span class="ellipse-page-item">...</span>
                    <span class="page-item" data-page="${page-2}">${page-2}</span>
                    <span class="page-item" data-page="${page-1}">${page-1}</span>
                `;
                for (let i = page; i <= totalPage; i++) {
                    if(i==page){
                        templatePageItem += `<span class="page-item active" data-page="${i}">${i}</span>`;
                    }else{
                        templatePageItem += `<span class="page-item" data-page="${i}">${i}</span>`;
                    }
                }
            }
        }else{
            for (let i = 1; i <= totalPage; i++) {
                if(i==page){
                    templatePageItem += `<span class="page-item active" data-page="${i}">${i}</span>`;
                }else{
                    templatePageItem += `<span class="page-item" data-page="${i}">${i}</span>`;
                }
            }
        }
        
        return `
            <div class="pagination" 
                data-navigation-link="${navigationLink}" 
                data-per-page="${perPage}" 
                data-query-strings="${queryStings}"
            >
                ${templatePageItem}
                <!--<span>Total Registos: <b>${total}</b></span>-->
            </div>
        `;
    }

    return templatePageItem;
}

export function onNavigationPageItem(
    elementClicked:HTMLElement,
    cb:cbOnNavigation|undefined=undefined
){
    let paginationEl = elementClicked.closest(".pagination") as HTMLDivElement;
    let paginationContainer = paginationEl.parentElement as HTMLDivElement;
    let containerShowData = null;
    if(
        paginationContainer.classList.contains("pagination-container") &&
        !paginationContainer.classList.contains("pagination-control")
    ){
        containerShowData = paginationContainer.previousElementSibling as HTMLElement;
    }else if(
        paginationContainer.classList.contains("pagination-control") && 
        paginationContainer.classList.contains("pagination-container")
    ){
        containerShowData = paginationContainer.previousElementSibling?.lastElementChild as HTMLElement;
    }
    let {navigationLink,perPage,queryStrings} = paginationEl.dataset;
    let page = elementClicked.dataset.page ?? "";

    if(typeof cb !== "undefined"){
        let fullNewNavLink = "";
        if(queryStrings)fullNewNavLink = `${navigationLink}?${queryStrings}&page=${page}&perpage=${perPage}`;
        else fullNewNavLink=`${navigationLink}?page=${page}&perpage=${perPage}`;

        cb(containerShowData!,paginationContainer,fullNewNavLink,(queryStrings??""));
    }
}