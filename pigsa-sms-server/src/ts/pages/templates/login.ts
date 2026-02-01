import { loginForm as componentLoginForm } from "../../components/login-form";
import { mainFooter as componentMainFooter} from "../../components/main-footer";
const logoCSU = new URL("../../../img/logo.png?as=webp&width=70px",import.meta.url);


export let login = `
    <div id="login">
        <main class="main-content">
            <div class="container-pannel">
                <div class="panel-header-container">
                    <img src="${logoCSU}" alt="csu logo">
                    <h1 class="heading-1">
                        Gestão de SMS
                    </h1>
                </div>
                ${componentLoginForm}
            </div>
        </main>
        ${componentMainFooter}
    </div>
`;