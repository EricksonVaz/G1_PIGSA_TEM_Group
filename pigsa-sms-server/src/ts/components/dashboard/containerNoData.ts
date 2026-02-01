export function containerNoData(title:string){
    return `
        <div class="container-no-data">
            <span class="label-data-title">
                ${title}
            </span>
            <div class="no-data-place">
                <span class="label">
                    Nenhum dado para mostrar
                </span>
            </div>
        </div>
    `;
}