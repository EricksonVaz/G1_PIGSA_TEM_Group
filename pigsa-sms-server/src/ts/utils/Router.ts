import swal from "sweetalert";
import { APage } from "../pages/APage";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { jwtDecoded, jwtDelete, manageProctedFeatures } from "./functions/Auth";
import { IRoutes } from "./interfaces/IRoutes";
import { CPanel } from "../pages/CPanel";
import { Redirect } from "../pages/Redirect";
import { httpRequestcontroller } from "./functions/HttpRequest";
import { Dashboard } from "../pages/Dashboard";
import { SendSMS } from "../pages/SendSMS";
import { BulkSMS } from "../pages/BulkSMS";
import { AdsSMS } from "../pages/AdsSMS";
import { TrackSMS } from "../pages/TrackSMS";

export class Router{
    private routes:IRoutes = {};
    private protectedRouters:string[] = [];
    private onlyAdminUsers:string[] = [];
    private onlyCreatorUsers:string[] = [];
    private onlyGuestUsers:string[] = [];
    private initialPath:string = "";
    private static routerInstance:Router;

    constructor(private appDiv:HTMLDivElement){
        let loginOrganizationPageRefObj = new Login(this.appDiv);
        let redirectPageRefObj = new Redirect(this.appDiv);
        let sendSMSPageRefObj = new SendSMS(this.appDiv);
        let bulkSMSPageRefObj = new BulkSMS(this.appDiv);
        let adsSMSPageRefObj = new AdsSMS(this.appDiv);
        let trackSMSPageRefObj = new TrackSMS(this.appDiv);
        let dashboardPageRefObj = new Dashboard(this.appDiv);
        let notFoundPageRefObj = new NotFound(this.appDiv);

        this.routes['/sms-server'] = redirectPageRefObj;
        this.routes['/sms-server/'] = redirectPageRefObj;
        this.routes['/sms-server/index.html'] = redirectPageRefObj;

        this.routes['/'] = loginOrganizationPageRefObj;
        this.routes['/sms-server/login'] = loginOrganizationPageRefObj;

        this.routes['/sms-server/send'] = sendSMSPageRefObj;
        this.routes['/sms-server/bulk'] = bulkSMSPageRefObj;
        this.routes['/sms-server/ads'] = adsSMSPageRefObj;
        this.routes['/sms-server/rastrear'] = trackSMSPageRefObj;
        this.routes['/sms-server/estatisticas'] = dashboardPageRefObj;

        this.routes['/send'] = sendSMSPageRefObj;
        this.routes['/bulk'] = bulkSMSPageRefObj;
        this.routes['/ads'] = adsSMSPageRefObj;
        this.routes['/rastrear'] = trackSMSPageRefObj;
        this.routes['/estatisticas'] = dashboardPageRefObj;

        this.routes['/not-found'] = notFoundPageRefObj;
        this.routes['/sms-server/not-found'] = notFoundPageRefObj;

        this.protectedRouters = [
            '/sms-server/send',
            '/send',
            '/sms-server/estatisticas',
            '/estatisticas',
            '/sms-server/rastrear',
            '/rastrear',
            '/sms-server/bulk',
            '/bulk',
            '/sms-server/ads',
            '/ads',
        ];

        this.onlyGuestUsers = [
            '/sms-server',
            '/sms-server/',
            '/sms-server/login',
            '/',
            '/login',
        ]

        this.onlyAdminUsers = [
            '/sms-server/send',
            '/send',
            '/sms-server/estatisticas',
            '/estatisticas',
            '/sms-server/bulk',
            '/bulk',
            '/sms-server/ads',
            '/ads',
        ]

        this.onlyCreatorUsers = [
        ]
        

        Router.routerInstance = this;
    }

    public init(pathname:string){
        this.renderPage(pathname);
        this.listenChangeURL();
    }

    private listenChangeURL(){
        window.onpopstate = () => {
            this.renderPage(window.location.pathname);
        }
    }

    private renderPage(pathName:string){
        let {jwtHeader,jwtBody} = jwtDecoded();

        this.initialPath = pathName;

        if(!(this.routes[pathName] instanceof APage)) pathName = "/sms-server/not-found";

        pathName = this.beforeRender(pathName);

        if(this.initialPath!=pathName){
            this.updateBrowserPathName(pathName);
        }

        if(
            ((jwtBody?.data.id??"").includes("cs_")|| (jwtBody?.data.access??"").includes("tecnico.csu")) 
            && 
            pathName.includes("csu-dr/")
        ){
            pathName = "/sms-server/not-found"
        }

        this.routes[pathName].render();

        document.querySelectorAll(`[data-href="${pathName}"]`)?.forEach(linkEl=>{
            linkEl.parentElement?.querySelector(".active")?.classList.remove("active");
            linkEl.classList.add("active");
            linkEl.removeAttribute("data-href");
        });
        this.addNavigationActions();

        this.afterRender();


        console.log("render page", pathName)
    }

    private afterRender(){
        manageProctedFeatures()
    }
    
    private beforeRender(pathName:string){
        let {jwtHeader,jwtBody} = jwtDecoded();
        if(this.protectedRouters.includes(pathName)){
            if(typeof jwtBody === "undefined" || typeof jwtHeader === "undefined"){
                this.msgRequestLogin();

                pathName = "/sms-server/login";
            }else{
                if(jwtHeader.site!="app.csu.cv"){
                    this.msgRequestLogin();

                    pathName = "/sms-server/login";
                }else if(
                    this.onlyAdminUsers.includes(pathName) && 
                    !([1,2].includes(jwtBody.data?.level??0))
                ){
                    pathName = "/sms-server/not-found";
                }else if(
                    this.onlyCreatorUsers.includes(pathName) && 
                    !([1,2,3,4].includes(jwtBody.data?.level??0))
                ){
                    pathName = "/sms-server/not-found";
                }
            }
        }else if(this.onlyGuestUsers.includes(pathName)){
            if(
                (typeof jwtBody !== "undefined" && typeof jwtHeader !== "undefined") && 
                jwtHeader.site=="app.csu.cv"
            ){

                //if(jwtBody.data.typeLogin=="send"){
                //    pathName = "/sms-server/send";
                //}else{
                //    pathName = "/feedback-history";
                //}

                if([1,2].includes(jwtBody.data?.level??0)){
                    pathName = "/sms-server/send";
                }else{
                   pathName = "/sms-server/not-found";
                }
            }
        }

        return pathName;
    }

    private msgRequestLogin(){
        swal("Code: 401","Tens de realizar o Login primeiro","warning");
        jwtDelete();
    }

    private addNavigationActions(){
        document.querySelectorAll(`[data-href]`).forEach(el=>{
            let elNav:HTMLElement = (el as HTMLElement);

            elNav.addEventListener("click",()=>{
                let pathName = (elNav as HTMLElement).dataset.href ?? '/sms-server/not-found';

                Router.navigateTo(pathName);
            });
            
        });
    }

    public static navigateTo(pathName:string,dataHref=""){

        let newPath = pathName.split("?")[0];

        console.log("newPath",newPath);
        console.log("pathName",pathName);

        console.log(Router.routerInstance.initialPath);

        // if(Router.routerInstance.initialPath.includes("qc-monitor")){
        //     if(QCMonitor.instance.queryStringNIA){
        //         Recadastramentos.instance.niaLoaded = "";
        //     }
        //     console.log("abortado");
        //     httpRequestcontroller.abort();
        // }

        httpRequestcontroller?.abort();

        Router.routerInstance.updateBrowserPathName(pathName);
        
        Router.routerInstance.renderPage(newPath);

    }

    public static redirectByUrl(url:string){
        window.location.href = url;
    }

    private updateBrowserPathName(pathName:string){
        window.history.pushState(
            {}, 
            pathName,
            window.location.origin + pathName
        );
    }
}