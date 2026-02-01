import { Capacitor } from "@capacitor/core";

const logoCSU = new URL("../../img/logo.png?as=webp&width=70px",import.meta.url);

export let mainHeader=`
    <header id="main-header">
        <div class="menu-ctrl-container">
            <i class="fa-solid fa-bars nav-icon-bar"></i>
            <img data-href="/sms-server/send" src="${logoCSU}" class="nav-icon" alt="icon-csu">
        </div>
        <div class="drop-nav drop-event">
            <i class="fas fa-user-circle drop-event" aria-hidden="true"></i>
            <nav class="nav-group">
                <span class="label-user">Erickson</span>
                <a href="javascript:void(0)" class="nav-link manage-my-account-link">Alterar password</a>
                <a href="javascript:void(0)" class="nav-link logout-link logout">Log out</a>
            </nav>
        </div>
    </header>
    <nav class="navigation">
        <div class="menu-ctrl-container">
            <img data-href="/sms-server/send" src="${logoCSU}" class="nav-icon" alt="icon-csu">
            <i class="fa-solid fa-xmark nav-icon-bar"></i>
        </div>
        <div class="link-container">
            <a href="javascript:void(0)" data-href="/sms-server/send" data-can="[1,2,3,5,6]" class="nav-link">
                <i class="fa-solid fa-paper-plane"></i>
                <span class="link-label">
                    Enviar SMS
                </span>
            </a>
            <a href="javascript:void(0)" data-href="/sms-server/bulk" data-can="[1,2,3,4]" class="nav-link">
                <i class="fa-solid fa-comments"></i>
                <span class="link-label">
                    Bulk SMS
                </span>
            </a>
            <a href="javascript:void(0)" data-href="/sms-server/ads" data-can="[1,2,3,4]" class="nav-link d-none">
                <i class="fa-solid fa-bullhorn"></i>
                <span class="link-label">
                    Ads SMS
                </span>
            </a>
            <a href="javascript:void(0)" data-href="/sms-server/rastrear" class="nav-link">
                <i class="fa-solid fa-gauge-high"></i>
                <span class="link-label">
                    Rastrear SMS
                </span>
            </a>
            ${(function(){
                if(["web"].includes(Capacitor.getPlatform())){
                    return `
                        <a href="javascript:void(0)" data-href="/sms-server/estatisticas" data-can="[1,2,3]" class="nav-link d-none">
                            <i class="fa-solid fa-chart-pie"></i>
                            <span class="link-label">
                                Dashboard
                            </span>
                        </a>
                    `   
                }
                return "";
            })()}
        </div>
    </nav>
`;