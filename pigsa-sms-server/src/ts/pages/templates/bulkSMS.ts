import { formSendBulkSMS } from "../../components/bulkSMS/formSendBulkSMS";
import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";


export let bulkSMS =`
    <div id="bulkSMS">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                <div class="tab-container">
                    <div class="tab-element" data-tab="reclamacoes">
                        <div class="container-form">
                            ${formSendBulkSMS()}
                        </div>
                    </div>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;