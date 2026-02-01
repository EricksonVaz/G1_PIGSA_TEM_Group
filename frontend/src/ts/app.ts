// import AOS from 'aos';
import "aos/dist/aos.css";
import { onWindowScroll, scrollToTopFeature } from './features/scrollToTop';
import { navigationMenu, superHeadMenuConfig } from './features/responsiveMenuActions';
import { onScrollPageStickHeaderMenu } from './features/onScrollPageStickHeaderMenu';
import { AddGlobalOnClose } from './features/modals/modalCtrl';
import { loadAllModalCartFeatures } from './features/modals/modal-cart';
import "../scss/style.scss";
import { actionsOnBackofficiePage } from "./features/backoffice/backoffice";
import { actionOnPageLoggin } from "./features/loginAluno";
import { actionAlunosPage } from "./features/alunosPage";

function main(){
    // AOS.init();

    scrollToTopFeature();
    onWindowScroll();

    superHeadMenuConfig();
    navigationMenu();
    onScrollPageStickHeaderMenu();

    AddGlobalOnClose();

    actionsOnBackofficiePage();

    actionOnPageLoggin();

    actionAlunosPage();
}

main();