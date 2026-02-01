export let containerSearch = function(){
    return `
        <div class="container-filter">
             <div class="form form-search">
                <div class="form-group">
                    <input class="form-control input-search-benef-text" type="text" name="search" placeholder="Procurar reclamações...">
                    <small class="feedback-error d-none" data-error-feedback="search"></small>
                </div>
                <button type="button" class="btn btn-search btn-search-text-benef">
                    <i class="fa-solid fa-magnifying-glass btn-search-text-benef"></i>
                </button>
            </div>
            <div class="container-filter-date">
                <div class="date-group">
                    <label for="from">De: </label>
                    <input type="date" class="form-control input-date-from">
                </div>
                <div class="date-group">
                    <label for="to">Até: </label>
                    <input type="date" class="form-control input-date-to">
                </div>
                <button type="button" class="btn btn-search btn-search-date">
                    <i class="fa-solid fa-magnifying-glass btn-search-date"></i>
                </button>
                <button type="button" class="btn btn-reset-search">
                    Limpar filtros
                </button>
            </div>
        </div>
    `;
}

export class ActionsSearchReclamacoesContainer{

    private static _rootElement?:HTMLElement;
    static formSearchContainer:HTMLDivElement;
    static inputSearchClaims:HTMLInputElement;
    static btnSearchClaims:HTMLButtonElement;
    static btnSearchClaimsByDate:HTMLButtonElement;
    static inputDateFromSearch:HTMLInputElement;
    static inputDateToSearch:HTMLInputElement;
    static btnListAll:HTMLButtonElement;

    static setRootElement(element:HTMLElement){
        this._rootElement = element;
        this.formSearchContainer = this._rootElement?.querySelector<HTMLDivElement>(".container-filter")!;

        if(this.formSearchContainer){
            this.inputSearchClaims = this.formSearchContainer.querySelector<HTMLInputElement>(".input-search-benef-text")!;
            this.btnSearchClaims = this.formSearchContainer.querySelector<HTMLButtonElement>(".btn-search-text-benef")!;
            this.btnSearchClaimsByDate = this.formSearchContainer.querySelector<HTMLButtonElement>(".btn-search-date")!;
            this.inputDateFromSearch = this.formSearchContainer.querySelector<HTMLInputElement>(".input-date-from")!;
            this.inputDateToSearch = this.formSearchContainer.querySelector<HTMLInputElement>(".input-date-to")!;
            this.btnListAll = this.formSearchContainer.querySelector<HTMLButtonElement>(".btn-reset-search")!;
        }
        return this;
    }

    static onFilterLoadAllRecords(callbackDefault:Function){
        this.btnListAll.addEventListener("click",()=>{
            callbackDefault();
        });
    }

    static searchBeneficiaryByText(
        callbackData:(searchValue:string)=>void,
        callbackDefault:Function
    ){
        this.inputSearchClaims?.addEventListener("keyup",(e)=>{
            if(e.keyCode == 13){
                this.onSearchText(callbackData,callbackDefault);
            }
        });

        this.btnSearchClaims?.addEventListener("click",()=>{
            this.onSearchText(callbackData,callbackDefault)
        });
    }

    static searchBeneficiaryByDate(
        callbackData:(dateFrom:string,dateTo:string)=>void,
        callbackDefault:Function
    ){
        this.btnSearchClaimsByDate?.addEventListener("click",()=>{
            this.onSearchByDate(callbackData,callbackDefault)
        });
    }

    private static onSearchText(callbackData:(searchValue:string)=>void,callbackDefault:Function){
        let searchValue = (this.inputSearchClaims?.value ?? "").trim();

        if(searchValue){
            this.inputDateFromSearch!.value = "";
            this.inputDateToSearch!.value = "";

            // this.loadBeneficiaryList(
            //     `/feedbackloop/organization/programs/search-beneficiary/${beneficioType}?s=${searchValue}&page=1&perpage=6`,
            //     `s=${searchValue}`
            // )
            callbackData(searchValue)
        }else{
            // this.loadBeneficiaryList();
            callbackDefault()
        }
    }

    private static onSearchByDate(
        callbackData:(dateFrom:string,dateTo:string)=>void,
        callbackDefault:Function
    ){
        let dateFrom = this.inputDateFromSearch?.value ?? "";
        let dateTo = this.inputDateToSearch?.value ?? "";

        // this.inputSearchClaims!.value = "";
        // this.inputDateFromSearch!.value = "";
        // this.inputDateToSearch!.value = "";


        if(dateFrom && dateTo){

            let dateToConverted = new Date(dateTo);
            dateToConverted.setDate(dateToConverted.getDate()+2);
            const newDate = new Date(dateToConverted);

            dateTo = `${newDate.getFullYear()}-${newDate.getMonth()+1}-${newDate.getDate()}`;

            callbackData(dateFrom,dateTo)

            // this.loadBeneficiaryList(`/feedbackloop/organization/programs/search-by-date/${beneficioType}?from=${dateFrom}&to=${dateTo}&page=1&perpage=6`,`from=${dateFrom}&to=${dateTo}`);
        }else{
            // this.loadBeneficiaryList();

            callbackDefault()
        }
    }

    static resetFilterContainer(queryString:string){
        console.log("querystring",queryString);
        if(queryString.indexOf("s=")>-1){
            if(ActionsSearchReclamacoesContainer.inputDateFromSearch)this.inputDateFromSearch.value = "";
            if(ActionsSearchReclamacoesContainer.inputDateToSearch)this.inputDateToSearch.value = "";
            console.log("clear date search")
        }else if(queryString.indexOf("&to=")>-1){
            if(ActionsSearchReclamacoesContainer.inputSearchClaims)this.inputSearchClaims.value = "";
            console.log("clear text search")
        }else{
            if(ActionsSearchReclamacoesContainer.inputDateFromSearch)this.inputDateFromSearch.value = "";
            if(ActionsSearchReclamacoesContainer.inputDateToSearch)this.inputDateToSearch.value = "";
            if(ActionsSearchReclamacoesContainer.inputSearchClaims)this.inputSearchClaims.value = "";
            console.log("clear all search")
        }
        
    }
}