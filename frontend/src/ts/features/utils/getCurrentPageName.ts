export default function getCurrentPageName(){
    return window.location.href.split("//")[1].split("/")[1].split(".")[0];
}