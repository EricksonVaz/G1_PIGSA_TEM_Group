import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";
import { formSendSMS } from "../../components/sendSMS/formSendSMS";


export let sendSMS =`
    <div id="sendSMS">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                <div class="tab-container">
                    <div class="tab-element" data-tab="reclamacoes">
                        <div class="container-form">
                            ${formSendSMS()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;