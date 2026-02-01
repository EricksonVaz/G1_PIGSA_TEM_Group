import { Router } from "../utils/Router";
import { APage } from "./APage";
import { notFound as template } from "./templates/not-found";

export class NotFound extends APage{
    static readonly PAGE_TITLE = "PIGSA Server - 404";
    
    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,NotFound.PAGE_TITLE);

        this.addEvents(this.backPreviusPage);
    }

    private backPreviusPage(elementClicked:HTMLElement){
        if(elementClicked.classList.contains("btn-back")){
            //window.history.back();
            Router.navigateTo("/sms-server/login");
        }
    }
}