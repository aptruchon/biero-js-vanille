import { get } from "./Async.js";

export default class Router {
    constructor(){
        // Récupération de la balise main où on injecte le template
        this._elBiero = document.querySelector("[data-js-biero]");

        // API biero
        this._webService = "http://127.0.0.1:8000/webservice/php/biere/";

        // Base de l'url pour le router de page()
        page.base("/ONGOING/TAPW/biero-js-vanille/biero-js-vanille");

        // Routes et fonctions à chainer
        page("/", this.getMeilleuresBieres, this.getTemplate, this.showTemplate);
        page("/liste", this.getBieres, this.getTemplate, this.showTemplate);
        page("/liste/:cle", this.getBieres, this.getTemplate, this.showTemplate);
        page("/biere/:id", this.getBiere, this.getNote, this.getCommentaire, this.getTemplate, this.showTemplate);
        page("*", this.getTemplate, this.showTemplate);

        // Réaffectation de la valeur window à window pour la fonction page
        page({ window : window });
    }

    sortBieres = (data, cle, ordre = "ASC") => {
        data.sort((a, b) => {
            if ( a[cle] < b[cle] ) return -1;
            if ( a[cle] > b[cle] ) return 1;
            return 0;
        });

        if(ordre == "DESC") data.reverse();
        
        // console.log(data);
        return data;
        
    }

    getBiere = (ctx, next) => {
        let id  = ctx.params.id;

        // Appel au serveur (en GET par défault)
        /* fetch(`${this._webService}/${id}`)
        .then((res) => {
            return res.json();
        }) */
        
        // On a opté pour ceci au lieu de la solution d'en haut car des fois on a une réponse en json,
        // d'autre fois en text. get s'occupe de nous retourner la bonne chose au bon moment au lieu de faire l'ajustement pour chacune des requêtes.
        get(`${this._webService}/${id}`)
        .then((data) => {
            if(data.data){
                let biere = data.data;
                ctx.data = biere;
                
                if(!biere.image) ctx.data.image = "assets/images/no-image.jpeg";
                
                ctx.template = "biere";
            }
            else {
                ctx.data = {};
                ctx.template = "404";
            }

            next();
        })
    }

    getBieres = (ctx, next) => {
        get(this._webService)
        .then((data) => {
            let bieres = data.data;

            if(ctx.params.cle){
                let ordre = ctx.params.cle.split("|")[1];
                if(ordre){
                    ctx.params.cle = ctx.params.cle.split("|")[0];
                    bieres = this.sortBieres(bieres, ctx.params.cle, ordre);
                }
                else {
                    bieres = this.sortBieres(bieres, ctx.params.cle);
                }
            }

            for(let i = 0, l = bieres.length; i < l; i++){
                bieres[i].note_moyenne = parseFloat(bieres[i].note_moyenne).toFixed(1);
                
                if(!bieres[i].image) bieres[i].image = "assets/images/no-image.jpeg";
            };
            
            ctx.data = bieres;
            ctx.data.filtre = true;
            ctx.template = "liste";
            
            // Appel de la méthode chainé (getTemplate) Voir ligne 5
            next();
        })
    }


    getMeilleuresBieres = (ctx, next) => {
        
        get(this._webService)
        .then((data) => {
            let bieres = data.data;
            bieres = this.sortBieres(bieres, "note_moyenne", "DESC");
            let meilleuresBieres = bieres.slice(0, 5);

            for(let i = 0, l = meilleuresBieres.length; i < l; i++){
                meilleuresBieres[i].note_moyenne = parseFloat(meilleuresBieres[i].note_moyenne).toFixed(1);

                if(!meilleuresBieres[i].image) meilleuresBieres[i].image = "assets/images/no-image.jpeg";
            };

            ctx.data = meilleuresBieres;
            ctx.template = "accueil";

            // Appel de la méthode chainé (getTemplate) Voir ligne 5
            next();
        })
    }

    getNote = (ctx, next) => {
        let id  = ctx.params.id;

        get(`${this._webService}/${id}/note`)
        .then((data) => {
            ctx.data.note = parseFloat(data.data.note).toFixed(1);
            ctx.data.nombre = data.data.nombre;

            next();
        })
    }

    getCommentaire = (ctx, next) => {
        let id  = ctx.params.id;

        get(`${this._webService}/${id}/commentaire`)
        .then((data) => {
            if(data.data.length == 1){
                ctx.data.commentaires = (data.data);
                ctx.data.commentairesTitre = "Commentaire";
            }
            else if (data.data.length > 1){
                ctx.data.commentaires = (data.data);
                ctx.data.commentairesTitre = "Commentaires";
            }
            else {
                ctx.data.commentairesTitre = "Aucun commentaire";
            }

            next();
        })
    }

    getTemplate = (ctx, next) => {
        if(ctx.template === undefined){
            ctx.template = "404";
            ctx.data = {};
        }

        fetch(`vues/${ctx.template}.html`)
        .then((res) => {
            return res.text();
        })
        .then((template) => {
            ctx.data.template = template;
            
            next();
        })
    }

    showTemplate = (ctx) => {
        let rendered = Mustache.render(ctx.data.template, {data: ctx.data});
        this._elBiero.innerHTML = rendered;

        if(ctx.params.cle) {
            let selectedOption = document.querySelector(`option[value="${ctx.params.cle}"]`);
            selectedOption.selected = "selected";
        };
    }
}