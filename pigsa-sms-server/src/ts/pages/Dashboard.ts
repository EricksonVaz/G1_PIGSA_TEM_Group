import swal from "sweetalert";
import { onNavigationPageItem, paginationItem } from "../components/pagination-item";
import { httpRequest } from "../utils/functions/HttpRequest";
import { TLoaderInContainer, loaderInContainer } from "../utils/functions/loaderInContainer";
import { ACPanel } from "./cpanel/ACPanel";
import { dashboard as template } from "./templates/dashboard";
import { Router } from "../utils/Router";
import Chart from 'chart.js/auto'
import { ActionsFilterRegionContainer } from "../components/cpanel/filterRegionContainer";
import { IDashboardData, ITotalClaimsByCategory, ITotalClaimsByConcelho, ITotalClaimsByGender, ITotalClaimsByState } from "../utils/interfaces/IDashboardData";
import { containerNoData } from "../components/dashboard/containerNoData";

export class Dashboard extends ACPanel{
    static readonly PAGE_TITLE = "PIGSA Server - Dashboard";

    private actionsFilterRegionContainer = ActionsFilterRegionContainer;

    private barChartContainer?:HTMLDivElement;
    private charSexoContainer?:HTMLDivElement;
    private chartCategoryContainer?:HTMLDivElement;
    private chartEstadoContainer?:HTMLDivElement;
    private tabContainerLoader?:TLoaderInContainer;

    private barChartTotalClaimByConcelho:any;
    private pieChartTotalClaimBySexo:any;
    private totalClaimByCategory:any;
    private pieChartTotalClaimByState:any;

    public static instance:Dashboard;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,Dashboard.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        Dashboard.instance = this;

    }

    public override render(): void {
        super.render();

        this.barChartContainer = this.appDiv.querySelector(".bar-chart-container") as HTMLDivElement;
        this.charSexoContainer = this.appDiv.querySelector(".chart-sexo") as HTMLDivElement;
        this.chartCategoryContainer = this.appDiv.querySelector(".chart-category") as HTMLDivElement;
        this.chartEstadoContainer = this.appDiv.querySelector(".chart-state") as HTMLDivElement;
        this.tabContainerLoader = loaderInContainer(".container-pannel>.loader");

        this.actionsFilterRegionContainer = ActionsFilterRegionContainer.setRootElement(this.appDiv)

        this.actionsFilterRegionContainer.hideShowFilterRegionElements(()=>{
            this.loadReclamacoesStats();
        });

        this.actionsFilterRegionContainer.onFilterItemCliked(()=>{
            this.loadReclamacoesStats();
        });

    }

    private async drawBarChartTotalClaimByConcelho(data:ITotalClaimsByConcelho[]){

        this.barChartTotalClaimByConcelho = new Chart(
            //@ts-expect-error
            document.getElementById<HTMLElement>('bar-chart'),
            {
                type: 'bar',
                data: {
                    labels: data.map(row => row.concelho),
                    datasets: [
                    {
                        label: 'total',
                        data: data.map(row => row.total)
                    }
                    ]
                },
                options:{
                    plugins:{
                        title:{
                            display:true,
                            text:"Reclamações por concelho"
                        }
                    }
                }
            }
        );
    }

    private async drawPieChartTotalClaimBySexo(data:ITotalClaimsByGender[]){
        let dataValues = data.map(val=>val.total);
        let dataLabels = data.map(val=>val.Sexo);
        
        this.pieChartTotalClaimBySexo = new Chart(
            //@ts-expect-error
            document.getElementById<HTMLElement>('pie-chart-1'),
            {
                type: 'pie',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'total',
                        data: dataValues,
                        backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)'
                        ],
                        hoverOffset: 4
                    }]
                },
                options:{
                    plugins:{
                        title:{
                            display:true,
                            text:"Reclamações por sexo"
                        }
                    }
                }
            }
        );
    }

    private async drawTotalClaimByCategory(data:ITotalClaimsByCategory[]){
        let dataValues = data.map(val=>val.total);
        let dataLabels = data.map(val=>val.categoria);

        this.totalClaimByCategory = new Chart(
            //@ts-expect-error
            document.getElementById<HTMLElement>('pie-chart-2'),
            {
                type: 'pie',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'total',
                        data: dataValues,
                        backgroundColor: [
                            '#541388',
                            '#D90368',
                            '#2E294E',
                            '#FFD400',
                            '#02A9EA'
                        ],
                        hoverOffset: 4
                    }]
                },
                options:{
                    plugins:{
                        title:{
                            display:true,
                            text:"Reclamações por categoria"
                        }
                    }
                }
            }
        );
    }

    private async drawPieChartTotalClaimByState(data:ITotalClaimsByState[]){
        let dataValues = Object.values(data[0]);
        let dataLabels = Object.keys(data[0]);
        
        this.pieChartTotalClaimByState = new Chart(
            //@ts-expect-error
            document.getElementById<HTMLElement>('pie-chart-3'),
            {
                type: 'pie',
                data: {
                    labels: dataLabels,
                    datasets: [{
                        label: 'total',
                        data: dataValues,
                        backgroundColor: [
                        'rgb(241, 162, 8)',
                        'rgb(6, 167, 125)'
                        ],
                        hoverOffset: 4
                    }]
                },
                options:{
                    plugins:{
                        title:{
                            display:true,
                            text:"Reclamações por estado"
                        }
                    }
                }
            }
        );
    }

    private loadReclamacoesStats(
        endPoint = `/claims/dashboard`,
        queryString=""
    ){
        // this.clearContainerRecadestramentoItems();
        // this.hideContainerTotalRecadastramentoFind();
        this.tabContainerLoader?.show();

        if(this.barChartTotalClaimByConcelho)this.barChartTotalClaimByConcelho.destroy();
        if(this.pieChartTotalClaimBySexo)this.pieChartTotalClaimBySexo.destroy();
        if(this.pieChartTotalClaimByState)this.pieChartTotalClaimByState.destroy();
        if(this.totalClaimByCategory)this.totalClaimByCategory.destroy();

        httpRequest<IDashboardData>(endPoint,"GET",true)
        .then(data=>{
            let {
                totalClaimsByCategories,
                totalClaimsByGender,
                totalClaimsByConcelho,
                totalClaimsByState
            } = data.result![0]
            this.tabContainerLoader?.hide();
            this.barChartContainer?.classList.add("d-none");
            if(this.actionsFilterRegionContainer.currentConcelhoFilter=="Nacional"){
                this.barChartContainer?.classList.remove("d-none");
                if(totalClaimsByConcelho.length){
                    this.barChartContainer!.innerHTML = `<canvas id="bar-chart"></canvas>`;
                    this.drawBarChartTotalClaimByConcelho(totalClaimsByConcelho);
                }else{
                    this.barChartContainer!.innerHTML = containerNoData("Reclamações por concelho");
                }
            }

            if(totalClaimsByGender.length){
                this.charSexoContainer!.innerHTML = `<canvas id="pie-chart-1"></canvas>`;
                this.drawPieChartTotalClaimBySexo(totalClaimsByGender);
            }else{
                this.charSexoContainer!.innerHTML = containerNoData("Reclamações por sexo");
            }

            if(totalClaimsByCategories.length){
                this.chartCategoryContainer!.innerHTML = `<canvas id="pie-chart-2"></canvas>`;
                this.drawTotalClaimByCategory(totalClaimsByCategories);
            }else{
                this.chartCategoryContainer!.innerHTML = containerNoData("Reclamações por categoria");
            }

            if(
                totalClaimsByState.length && 
                (totalClaimsByState[0]["Em andamento"] || totalClaimsByState[0]["Encerrado"])
            ){
                this.chartEstadoContainer!.innerHTML = `<canvas id="pie-chart-3"></canvas>`;
                this.drawPieChartTotalClaimByState(totalClaimsByState);
            }else{
                this.chartEstadoContainer!.innerHTML = containerNoData("Reclamações por estado");
            }

            
            
           

        }).catch(err=>{
            console.error(err);
            this.tabContainerLoader?.hide();
        });
    }

}