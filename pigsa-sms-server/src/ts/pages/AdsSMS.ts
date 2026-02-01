import { ACPanel } from "./cpanel/ACPanel";
import { adsSMS as template } from "./templates/adsSMS";

export class AdsSMS extends ACPanel{
    static readonly PAGE_TITLE = "PIGSA Server - Enviar SMS em massa";

    public static instance:AdsSMS;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,AdsSMS.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        AdsSMS.instance = this;

    }

    public override render(): void {
        super.render();

    }
}