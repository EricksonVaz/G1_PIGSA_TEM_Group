import { logout } from "./Auth";

export function autoLogoutIn(seconds:number){
    let newPastTime = +(localStorage.getItem("pastTime") ?? 0);

    let idContToLogout = setInterval(()=>{

        if(window.navigator.onLine){
            newPastTime++;
            localStorage.setItem("pastTime",newPastTime.toString());

            if(newPastTime>=seconds){
                logoutNow();
            }
        }

    },1000);

    contTimePastLastLoggedIteration();

    document.addEventListener('mouseup', onIterativiteDetect);

    document.addEventListener('keydown', onIterativiteDetect);

    document.addEventListener('touchstart', onIterativiteDetect);

    window.addEventListener('resize', onIterativiteDetect);

    document.addEventListener('mousemove', contTimePastLastLoggedIteration);

    function onIterativiteDetect(e:Event){
        let currentTimeStamp = (new Date()).getTime();
        localStorage.setItem("lastCurentTime",currentTimeStamp.toString())
        localStorage.setItem("pastTime","0");
        newPastTime = +(localStorage.getItem("pastTime") ?? 0)
    }

    function contTimePastLastLoggedIteration(){
        let lastCurentTime = +(localStorage.getItem("lastCurentTime") ?? 0);
        if(lastCurentTime>0){
            let currentTimeStamp = (new Date()).getTime();
            let calcTime = ((currentTimeStamp-lastCurentTime)/1000);
            if(calcTime>seconds){
                localStorage.removeItem("pastTime");
                localStorage.removeItem("lastCurentTime")
                logout()
            }
        }
    }

    function logoutNow(){
        if(idContToLogout)clearInterval(idContToLogout);
        localStorage.removeItem("pastTime");
        localStorage.removeItem("lastCurentTime")
        logout()
    }
}