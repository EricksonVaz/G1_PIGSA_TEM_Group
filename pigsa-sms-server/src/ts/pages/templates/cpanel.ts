import { cardReclamacoes } from "../../components/cardReclamacoes";
import { containerSearch } from "../../components/cpanel/containerSearch";
import { filterRegionContainer } from "../../components/cpanel/filterRegionContainer";
import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";
import { paginationItem } from "../../components/pagination-item";


export let cPanel =`
    <div id="cpanel">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                ${filterRegionContainer()}
                <div class="organization-navigation" data-can="[1,2,5]">
                    <button type="button" class="btn btn-nav-org" data-tab-target="reclamacoes">
                        Reclamações
                    </button>
                    <button type="button" class="btn btn-nav-org" data-tab-target="denuncias">
                        Denúncias
                    </button>
                </div>
                <div class="tab-container">
                    <div class="tab-element" data-tab="reclamacoes">
                        ${containerSearch()}
                        <div class="container-total-find">
                            <span class="label-title">
                                Total reclamações: 
                            </span>
                            <span class="label-total-find">
                                200 reclamações
                            </span>
                        </div>
                        <div class="container-list claims-list">
                            
                        </div>
                        <div class="pagination-control pagination-container pagination-reclamacoes">
                            
                        </div>
                    </div>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;