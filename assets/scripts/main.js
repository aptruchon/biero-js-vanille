/**
 * @todo Complétez l'affichage de la page d'accueil : les 5 meilleures bières, avec les informations de base [image, nom, brasserie, moyenne, nombre de note].
 * @todo Complétez la page /liste : faire fonctionner tous les tris (nom, brasserie et note [ASC et DESC]).
 * @todo Complétez la page détail d'une bière (route /liste/:id_biere) pour l'affichage du bloc commentaire (chaque commentaire et le courriel de l'auteur). Assurez-vous de faire la gestion du titre 'Aucune commentaire', 'Commentaire' ou 'Commentaires' selon le nombre de commentaire de la bière. 
 * @todo Gestion d'une page 404 avec un lien menant à la page d'accueil.
 * 
 * @todo (Bonus mais juste pour des points virtuels) Faire une gestion singulière de la grille de la page d'accueil.
 * @todo (Bonus mais juste pour des points virtuels) Transition entre les routes (événement 'transitionend').
 * @todo (Bonus mais juste pour des points virtuels) Remplacer mustache.js par handlebar.js
 */

import Router from "./Router.js";
import SortBiere from "./SortBiere.js";

window.addEventListener("DOMContentLoaded", () => {
    new Router();
    new SortBiere();
})