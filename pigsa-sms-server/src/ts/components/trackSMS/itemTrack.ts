export function itemTrack(origin:string,phone:string,dateTime:string,sms:string,status:string){
    return `
        <div class="sms-item">
            <div class="sms-info sms-origin">
                <span class="label-desc">Tipo de SMS</span>
                <span class="label-info">${origin}</span>
            </div>
            <div class="sms-info">
                <span class="label-desc">Destinatario</span>
                <span class="label-info">${phone}</span>
            </div>
            <div class="sms-info">
                <span class="label-desc">Executado em</span>
                <span class="label-info">${dateTime}</span>
            </div>
            <div class="sms-info sms-type">
                <span class="label-desc">Estado</span>
                <span class="label-info">${status}</span>
            </div>
            <div class="sms-text">
                <span class="label-desc">SMS Enviado</span>
                <span class="label-info">${sms}</span>
            </div>
        </div>
    `;
}