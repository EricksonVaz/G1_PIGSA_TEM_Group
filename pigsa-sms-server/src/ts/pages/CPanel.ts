import { ACPanel } from "./cpanel/ACPanel";
import { cPanel as template } from "./templates/cpanel";

export class CPanel extends ACPanel{
    static readonly PAGE_TITLE = "CSU - Painel de Controle";

    public static instance:CPanel;

    constructor(appDiv:HTMLDivElement){
        super(appDiv,template,CPanel.PAGE_TITLE);

        //this.addEvents(this.signupWithGoogle);

        CPanel.instance = this;

    }

    public override render(): void {
        super.render();

    }
}