export let btnHolderToggler = function(classRef:string="",initialState:number=2){
    let classActive = "";
    if(initialState==1) classActive="active";
    return `
        <div class="btn-holder-toggler ${classRef}" data-access-can="[1]">
            <div class="btn-circle-toggler ${classRef} ${classActive}"></div>
            <input type="checkbox" class="checkbox" ${(function(){
                if(initialState==2)return'checked';
                return'';
            })()}>
        </div>
    `;
} 

export function addEventHolderToggler(elementClicked:HTMLElement){
    if(elementClicked.classList.contains("btn-circle-toggler")){
        elementClicked = elementClicked.closest(".btn-holder-toggler")!
        console.log("toggler")
    }

    if(elementClicked.classList.contains('btn-holder-toggler')){
        console.log("toggler")
        var allNodes = elementClicked.children;

        // find all childern and check them for add class and change checkbox state
        for (let j = 0; j < allNodes.length; j++) {
            var node = allNodes[j];
            var isActive;

            // check for btn circle and change it's css class
            if (node.classList.contains('btn-circle-toggler')) {
                if (!node.classList.contains('active')) {
                    node.classList.add('active');
                    isActive = true;
                } else {
                    node.classList.remove('active');
                    isActive = false;
                }
            }

            // check for check box and change it's state
            if (node.classList.contains('checkbox')) {
                let inputCheckbox = node as HTMLInputElement;
                if (isActive) {
                    inputCheckbox.checked = true;
                } else {
                    inputCheckbox.checked = false;
                }
            }
        }
    }
    // let allBtns = document.querySelectorAll('.btn-holder-toggler') ;

    // for (let i = 0; i < allBtns.length; i++) {
    //     var btn = allBtns[i];

    //     btn.addEventListener('click', function () {
    //         var allNodes = btn.children;

    //         // find all childern and check them for add class and change checkbox state
    //         for (let j = 0; j < allNodes.length; j++) {
    //             var node = allNodes[j];
    //             var isActive;

    //             // check for btn circle and change it's css class
    //             if (node.classList.contains('btn-circle-toggler')) {
    //                 if (!node.classList.contains('active')) {
    //                     node.classList.add('active');
    //                     isActive = true;
    //                 } else {
    //                     node.classList.remove('active');
    //                     isActive = false;
    //                 }
    //             }

    //             // check for check box and change it's state
    //             if (node.classList.contains('checkbox')) {
    //                 let inputCheckbox = node as HTMLInputElement;
    //                 if (isActive) {
    //                     inputCheckbox.checked = true;
    //                 } else {
    //                     inputCheckbox.checked = false;
    //                 }
    //             }
    //         }
    //     })
    // }
}