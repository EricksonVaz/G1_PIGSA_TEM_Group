import { mainFooter as componentMainFooter} from "../../components/main-footer";

//const logoLogin = new URL("../../../img/logo-login.png?as=webp",import.meta.url);

export let notFound = `
    <div id="not-found">
        <main class="main-content">
            <div class="container-pannel">
                <h1 class="heading-1">
                    A página que procuras não foi encontrado
                </h1>
                <div class="panel-action">
                    <h1 class="heading-error-code">404</h1>
                    <button type="button" class="btn btn-back">Voltar a página inicial</button>
                </div>
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;