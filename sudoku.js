// auteur: Mégane Dandurand & Cyrille Lanctôt

var undefined = 0; //Doit commencer avec ça, sinon grilles disent que var undefined n'existe pas donc remplace undefined par 0

load("sudoku-hard.js");
load("sudoku-hard-c.js");

var possibleValues = [[],[],[],[],[],[],[],[],[]]; // On crée un tableau des valeurs possibles pour chaque case de la grille.

var initialValues = function (grille, possibleValues) { // On effectue une opération de départ qui assigne ces valeurs.
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (grille[i][j] === 0) {
                possibleValues[i].push([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Les 9 valeurs possibles à chaque case ouverte
            }
            else {
                possibleValues[i].push([grille[i][j]]); // La propre valeur à chaque case fermée
            }
        }
    }
};

initialValues (grille, possibleValues);

var display = function (grille) {
    var displayReturn = ""; // On crée la variable d'affichage sous forme de chaîne de caractères.
    var squareSplit = "  ---------   ---------   ---------  "; // On crée une ligne qui sépare les carrés 3x3.
    for (var i = 0; i < 9; i++) {
        if (i % 3 === 0) { // Avant chaque couple de 3 lignes, on ajoute la séparation ainsi qu'un saut de ligne.
            displayReturn += squareSplit+"\n";
        }
        for (var j = 0; j < 9; j++) {
            if (j % 3 === 0) { // Le segment précédant la valeur diffère selon les groupes de 3 colonnes.
                displayReturn += "|  ";
            }
            else {
                displayReturn += "+  ";
            }
            if (grille[i][j] === 0) {
                displayReturn += " ";
            }
            else {
                displayReturn += grille[i][j];
            }
        }
        displayReturn += "|\n"; // On insère un saut de ligne à chaque changement de i.
    }
    displayReturn += squareSplit; // On ajoute une dernière séparation selon les normes d'affichage demandées.
    print (displayReturn);
};

var solve = function (grille, possibleValues, display, debug) { // Utilise les grille, valeurs possibles et fonction d'affichage.
    var identified = 0; // On crée une variable déterminant le nombre total de valeurs identifiées au cours d'une itération.
    do { // On utilise une boucle do/while pour minimiser les itérations/maximiser les valeurs trouvées par itération.
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (possibleValues[i][j].length > 1) { // On n'affecte que les valeurs ouvertes, pas les valeurs fermées.
                    for (var y = 0; y < 9; y++) {
                        if (possibleValues[i][j].includes(grille[i][y])) { // La valeur possible correspond dans la ligne.
                            var index = possibleValues[i][j].indexOf(grille[i][y]); // On trouve cette valeur.
                            possibleValues[i][j].splice(index, 1); // On ôte la valeur en tant que possibilité.
                        }
                    }
                    for (var x = 0; x < 9; x++) {
                        if (possibleValues[i][j].includes(grille[x][j])) { // La valeur possible correspond dans la colonne.
                            var index = possibleValues[i][j].indexOf(grille[x][j]); // On trouve cette valeur.
                            possibleValues[i][j].splice(index, 1); // On ôte la valeur en tant que possibilité.
                        }
                    }
                    for (var x = 3*Math.floor(i/3); x < 3*Math.floor(i/3)+3; x++) {
                        for (var y = 3*Math.floor(j/3); y < 3*Math.floor(j/3)+3; y++) {
                            if (possibleValues[i][j].includes(grille[x][y])) { // La valeur possible correspond dans le carré.
                                var index = possibleValues[i][j].indexOf(grille[x][y]); // On trouve cette valeur.
                                possibleValues[i][j].splice(index, 1); // On ôte la valeur en tant que possibilité.
                            }
                        }
                    }
                }
            }
        }
        var toBeIdentified = 0; // On assume, pour l'instant, qu'il n'y a pas de valeurs à identifier.
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                if (possibleValues[i][j].length === 1 && possibleValues[i][j][0] !== grille[i][j]) { // Si on a un tableau de valeurs possibles ne contenant qu'une seule valeur et que celle-ci n'est pas déjà égale à la valeur correspondante dans la grille, cela veut dire qu'on vient de trouver une nouvelle valeur fermée.
                    identified++; // On ajoute au total des valeurs identifiées pour l'itération.
                    toBeIdentified++; // On ajoute au total des valeurs identifiées pour la boucle, ce qui veut dire que le do/while se répète.
                    grille[i][j] = possibleValues[i][j][0]; // On affecte à la grille la nouvelle valeur identifiée.
                }
            }
        }
    }
    while (toBeIdentified !== 0); // Tant et aussi longtemps qu'on trouve au moins une valeur à chaque do/while, l'itération continue.
    if(debug === true){print ("Nombre de valeurs identifiées: "+identified);}
    display (grille);
};

var stat = function (possibleValues, debug) {
    var statReturn = ""; // On crée la variable d'affichage sous forme de chaîne de caractères.
    var possibilitiesArray = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // On crée un tableau du nombre de valeurs ayant n possibilités.
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            possibilitiesArray[possibleValues[i][j].length-1] += 1; // On trouve ce nombre pour chaque n de 1 à 9.
        }
    }
    var possibilitiesN = String(possibilitiesArray); // On convertit le tableau en chaîne de caractères pour l'affichage.
    var possibilities = 0; // On crée une variable pour le nombre total de possibilités, soit n de 2 à 9.
    for (var i = 1; i < 9; i++) {
        possibilities += possibilitiesArray[i]*(i+1); // On trouve ce nombre.
    }
    statReturn += "#Possibilités: "+possibilities+" #Valeurs fermées: "+possibilitiesArray[0]+" #Nombre de cases ayant n possibilités (n de [1,9]): "+possibilitiesN;
    if(debug===true){
    print (statReturn);
    }
};

var play = function(l,c,val,solve){//fonction play
    if(grille[l][c] === 0){//si la case est vide, on associe la valeur a la case
        grille[l][c] = val;
        solve(grille);//applique solve a la grille
    }
};

var detail = function (possibleValues) {
    var detailReturn = ""; // On crée la variable d'affichage sous forme de chaîne de caractères.
    var squareSplit = "|+ ===   ===   === ++ ===   ===   === ++ ===   ===   === +|"; // Ligne de séparation des carrés 3x3.
    var cellSplit = "|| ---   ---   --- || ---   ---   --- || ---   ---   --- ||"; // Ligne de séparation des cellules de case.
    for (var i = 0; i < 9; i++) {
        if (i === 0) { // La séparation des carrés survient à chaque triplets de cellules.
            detailReturn += squareSplit+"\n";
        }
        else if (i % 3 === 0) { // Il y a cependant une séparation additionnelle entre les carrés, mais non au début ni à la fin.
            detailReturn += squareSplit+"\n\n"+squareSplit+"\n";
        }
        else {
            detailReturn += cellSplit+"\n"; // S'il ne s'agit pas d'une séparation de carrés, c'est une séparation de cellules.
        }
        for (var l = 0; l < 3; l++) { // Les cellules font 3 "lignes".
            for (var j = 0; j < 9; j++) {
                if (j % 3 === 0) { // Le segment précédant la valeur diffère selon les groupes de 3 colonnes.
                    detailReturn += "|| ";
                }
                else {
                    detailReturn += "| ";
                }
                for (var k = 3*l+1; k < 3*l+4; k++) {
                    if (possibleValues[i][j].includes(k)) { // Le chiffre de 1 à 9 est-il inclus dans les valeurs possibles de la case en question?
                        detailReturn += k; // Si oui, on affiche cette valeur à sa position respective.
                    }
                    else {
                        detailReturn += "."; // Si non, on affiche un point.
                    }
                }
                detailReturn += " ";
            }
            detailReturn += "||\n";
        }
    }
    detailReturn += squareSplit; // On ajoute une dernière séparation selon les normes d'affichage demandées.
    print(detailReturn);
};

print(grille);
print(commandes);