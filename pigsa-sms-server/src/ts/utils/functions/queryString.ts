let getQueryString = (function(a:string[]|string) {
    if (a == "" || a.length==0) return {}

    if(Array.isArray(a)){
        let b:any = {};
        a.forEach(el=>{
            let arr = el.split("=");
            b[arr[0]]=arr[1]
        });

        return b;
    }
    // for (var i = 0; i < a.length; ++i)
    // {
    //     var p=a[i].split('=', 2);
    //     if (p.length == 1)
    //         b[p[0]] = "";
    //     else
    //         b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    // }
    //return b;
})(window.location.search.substr(1).split('&'));

let getQueryString2 = (function() {
    return window.location.search.split("?url=")[1];
})();

export {getQueryString,getQueryString2};