export default class SortBiere {
    constructor(){
        this._elBiero = document.querySelector("[data-js-biero]");
        

        this.init();
    }

    init(){
        // Event listener sur parent du select alors mm une page sans select ne causera pas de problème.
        // data-js-biero est dans toutes les pages
        this._elBiero.addEventListener("change", (e) => {
            // Validation
            if(e.target.hasAttribute("data-js-filtre") && e.target.value != 0){
                page.redirect(`/liste/${e.target.value}`);
            }
        })
    }
}