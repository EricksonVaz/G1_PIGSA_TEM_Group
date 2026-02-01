import { Router } from "../utils/Router";
import { APage } from "./APage";
import { login as template } from "./templates/login";
import { getQueryString, getQueryString2 } from "../utils/functions/queryString";


export class Redirect extends APage{
    static readonly PAGE_TITLE = "PIGSA Server - Redirect";

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,Redirect.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

    }

    public override render(): void {
        //super.render();
        let url = getQueryString2??"/sms-server/login";

        Router.navigateTo(url);
    }
}