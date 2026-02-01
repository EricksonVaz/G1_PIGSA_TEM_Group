import { filterRegionContainer } from "../../components/cpanel/filterRegionContainer";
import { loaderElementContainer } from "../../components/cpanel/loaderElementContainer";
import { containerNoData } from "../../components/dashboard/containerNoData";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
import { mainHeader as componentMainHeader} from "../../components/main-header";

export let dashboard =`
    <div id="dashboard">
        ${componentMainHeader}
        <main class="main-content">
            <div class="container-pannel">
                ${loaderElementContainer()}
                ${filterRegionContainer()}
                <div class="bar-chart-container">
                    
                </div>
                <div class="container-pie-chart">
                    <div class="pie-chart chart-sexo">
                        
                    </div>
                    <div class="pie-chart chart-category">
                        
                    </div>
                    <div class="pie-chart chart-state">
                        
                    </div>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;