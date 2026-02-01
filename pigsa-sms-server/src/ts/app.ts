import { backdropComponent } from './components/backdrop';
import { loaderPageComponent } from './components/loader-page';
import { Router } from './utils/Router';

(function(app:HTMLDivElement){
    window.document.body.insertAdjacentHTML("beforeend",backdropComponent);
    window.document.body.insertAdjacentHTML("beforeend",loaderPageComponent);
    new Router(app).init(window.location.pathname);
})(document.querySelector("#app") as HTMLDivElement);