/*
============================================================
GALERIES — LE SEUL FICHIER À MODIFIER
============================================================

POUR AJOUTER UNE CRÉATION :
1. Mets la photo dans le bon dossier /assets
2. Copie une ligne ci-dessous
3. Change le nom du fichier et la catégorie

Exemple :
{ image: "piece-25.jpg", category: "piece-montee" },
{ image: "gateau-32.jpg", category: "gateau" },

POUR CHANGER L'ORDRE :
Déplace simplement les lignes. La 1re ligne = 1re photo du site.

POUR AJOUTER UN AUTRE ANGLE DE LA MÊME CRÉATION :
Ajoute "angles" sur LA MÊME ligne :
{ image: "piece-01.jpg", category: "piece-montee", angles: ["piece-01-angle-1.jpg"] },

Plusieurs angles :
{ image: "piece-01.jpg", category: "piece-montee", angles: ["piece-01-angle-1.jpg", "piece-01-angle-2.jpg"] },

IMPORTANT :
- category: "piece-montee" = page Pièces montées
- category: "gateau" = page Gâteaux
============================================================
*/



// ========================================================
// OFFRES & ACTUALITÉS — PAGE D’ACCUEIL
// ========================================================
// C’EST LA SEULE PARTIE À MODIFIER POUR LES CARTES D’OFFRES.
//
// 1 ligne = 1 carte sur le site.
// L’ordre des lignes = l’ordre des cartes sur le site.
// Pour supprimer une carte : supprime sa ligne.
// Pour changer l’ordre : déplace simplement la ligne.
// Pour ajouter une carte : copie une ligne et modifie les infos.
// Mets tes affiches dans le dossier : assets/flyers/
//
// image     = nom exact de l’affiche dans assets/flyers
// categorie = petit texte jaune au-dessus du titre
// titre     = gros titre de la carte
// texte     = texte affiché sous le titre
// texte2    = deuxième ligne facultative (mets "" si tu n’en veux pas)
// telephone = mets le numéro uniquement si tu veux afficher un bouton d’appel
//
// EXEMPLE :
// { image: "mon-affiche.jpg", categorie: "Nouveauté", titre: "Mon offre", texte: "Mon texte", texte2: "", telephone: "" },

const flyerItems = [

  { image: "formule-sandwich-1.jpg", categorie: "Formule", titre: "Formule classique", texte: "Une formule pratique et gourmande pour la pause du midi.", texte2: "", telephone: "" },
  { image: "formule-sandwich-2.jpg", categorie: "Formule", titre: "Formule XL", texte: "Découvrez notre seconde formule et ses différentes possibilités.", texte2: "", telephone: "" },
  { image: "flyer-noel.jpg", categorie: "Saisonnier", titre: "Les fêtes à L’Ami du Pain", texte: "Bûches et créations de Noël seront présentées ici pendant la période des fêtes.", texte2: "", telephone: "" },
];

const galerieItems = [

  // ========================================================
  // PIÈCES MONTÉES
  // ========================================================
  { image: "piece-01.jpg", category: "piece-montee", angles: ["piece-01-angle-1.jpg"] },
  { image: "piece-34.jpeg", category: "piece-montee", angles: ["piece-34-angle-1.jpeg","piece-34-angle-2.jpeg"]},
  { image: "piece-02.jpg", category: "piece-montee" },
  { image: "piece-03.jpg", category: "piece-montee" },
  { image: "piece-04.jpg", category: "piece-montee" },
  { image: "piece-05.jpg", category: "piece-montee" },
  { image: "piece-06.jpg", category: "piece-montee" },
  { image: "piece-07.jpg", category: "piece-montee" },
  { image: "piece-08.jpg", category: "piece-montee" },
  { image: "piece-09.jpg", category: "piece-montee" },
  { image: "piece-10.jpg", category: "piece-montee" },
  { image: "piece-11.jpg", category: "piece-montee" },
  { image: "piece-12.jpg", category: "piece-montee" },
  { image: "piece-13.jpg", category: "piece-montee" },
  { image: "piece-14.jpg", category: "piece-montee" },
  { image: "piece-15.jpg", category: "piece-montee" },
  { image: "piece-16.jpg", category: "piece-montee" },
  { image: "piece-17.jpg", category: "piece-montee" },
  { image: "piece-18.jpg", category: "piece-montee" },
  { image: "piece-19.jpg", category: "piece-montee" },
  { image: "piece-20.jpg", category: "piece-montee" },
  { image: "piece-21.jpg", category: "piece-montee" },
  { image: "piece-22.jpg", category: "piece-montee" },
  { image: "piece-23.jpg", category: "piece-montee" },
  { image: "piece-24.jpg", category: "piece-montee", angles: ["piece-24-angle-1.jpg"] },
  { image: "piece-25.jpg", category: "piece-montee", angles: ["piece-25-angle-1.jpg"] },
  { image: "piece-26.jpg", category: "piece-montee", angles: ["piece-26-angle-1.jpg"] },
  { image: "piece-27.jpg", category: "piece-montee" },
  { image: "piece-28.jpg", category: "piece-montee" },
  { image: "piece-31.jpg", category: "piece-montee" },
  { image: "piece-32.jpg", category: "piece-montee" },
  { image: "piece-33.jpg", category: "piece-montee" },

  // ========================================================
  // GÂTEAUX
  // ========================================================
  { image: "gateau-01.jpg", category: "gateau" },
  { image: "gateau-02.jpg", category: "gateau" },
  { image: "gateau-03.jpg", category: "gateau" },
  { image: "gateau-04.jpg", category: "gateau" },
  { image: "gateau-05.jpg", category: "gateau" },
  { image: "gateau-06.jpg", category: "gateau" },
  { image: "gateau-07.jpg", category: "gateau" },
  { image: "gateau-08.jpg", category: "gateau", angles: ["gateau-08-angle-1.jpg"] },
  { image: "gateau-09.jpg", category: "gateau" },
  { image: "gateau-10.jpg", category: "gateau" },
  { image: "gateau-11.jpg", category: "gateau" },
  { image: "gateau-12.jpg", category: "gateau" },
  { image: "gateau-13.jpg", category: "gateau" },
  { image: "gateau-14.jpg", category: "gateau" },
  { image: "gateau-15.jpg", category: "gateau" },
  { image: "gateau-16.jpg", category: "gateau" },
  { image: "gateau-17.jpg", category: "gateau" },
  { image: "gateau-18.jpg", category: "gateau" },
  { image: "gateau-19.jpg", category: "gateau" },
  { image: "gateau-20.jpg", category: "gateau" },
  { image: "gateau-21.jpg", category: "gateau" },
  { image: "gateau-22.jpg", category: "gateau" },
  { image: "gateau-23.jpg", category: "gateau" },
  { image: "gateau-24.jpg", category: "gateau" },
  { image: "gateau-25.jpg", category: "gateau" },
  { image: "gateau-26.jpg", category: "gateau" },
  { image: "gateau-27.jpg", category: "gateau" },
  { image: "gateau-28.jpg", category: "gateau" },
  { image: "gateau-29.jpg", category: "gateau" },
  { image: "gateau-30.jpg", category: "gateau" },
  { image: "gateau-31.jpg", category: "gateau" },

  // ========================================================
  // PÂTISSERIES
  // ========================================================
  { image: "patisserie-01.jpg", category: "patisserie" },
  { image: "patisserie-02.jpg", category: "patisserie" },
  { image: "patisserie-03.jpg", category: "patisserie" },
  { image: "patisserie-04.jpg", category: "patisserie" },
  { image: "patisserie-05.jpg", category: "patisserie" },
  { image: "patisserie-06.jpg", category: "patisserie" },
  { image: "patisserie-07.jpg", category: "patisserie" },
  { image: "patisserie-08.jpg", category: "patisserie" },
  { image: "patisserie-09.jpg", category: "patisserie" },
  { image: "patisserie-10.jpg", category: "patisserie" },
  { image: "patisserie-11.jpg", category: "patisserie" },
  { image: "patisserie-12.jpg", category: "patisserie" },
  { image: "patisserie-13.jpg", category: "patisserie" },
  { image: "patisserie-14.jpg", category: "patisserie" },
  { image: "patisserie-15.jpg", category: "patisserie" },
  { image: "patisserie-16.jpg", category: "patisserie" },
  { image: "patisserie-17.jpg", category: "patisserie" },
  { image: "patisserie-18.jpg", category: "patisserie" },
  { image: "patisserie-19.jpg", category: "patisserie" },
  { image: "patisserie-20.jpg", category: "patisserie" },
  { image: "patisserie-21.jpg", category: "patisserie" },
  { image: "patisserie-22.jpg", category: "patisserie" },
  { image: "patisserie-23.jpg", category: "patisserie" },
  { image: "patisserie-24.jpg", category: "patisserie" },

  // ========================================================
  // TRAITEUR
  // ========================================================
  { image: "traiteur 1.jpg", category: "traiteur" },
  { image: "traiteur 2.jpg", category: "traiteur" },
  { image: "traiteur 3.jpg", category: "traiteur" },
  { image: "traiteur 4.jpg", category: "traiteur" },
  { image: "traiteur 5.jpg", category: "traiteur" },
  { image: "traiteur 6.jpg", category: "traiteur" },
  { image: "traiteur 7.jpg", category: "traiteur" },
  { image: "traiteur 8.jpg", category: "traiteur" },
  { image: "traiteur 9.jpg", category: "traiteur" },
  { image: "traiteur 10.jpg", category: "traiteur" },
  { image: "traiteur 11.jpg", category: "traiteur" },
  { image: "traiteur 12.jpg", category: "traiteur" },
  { image: "traiteur 13.jpg", category: "traiteur" },
  { image: "traiteur 14.jpg", category: "traiteur" },
  { image: "traiteur 15.jpg", category: "traiteur" },
  { image: "traiteur 16.jpg", category: "traiteur" },
  { image: "traiteur 17.jpg", category: "traiteur" },

];

// ========================================================
// PHOTO — UNE BOULANGERIE FAMILIALE
// ========================================================
// Pour changer la photo :
// 1. Mets la nouvelle image dans le dossier assets/
// 2. Remplace uniquement le nom du fichier ci-dessous.
const photoBoulangerieFamiliale = "photo-famille-boutique.jpg";
