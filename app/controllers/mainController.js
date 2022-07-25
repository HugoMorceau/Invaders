// const client = require('../database/client');
// const { pool } = require("../database/db");
const client = require("../database/db");

const mainController = {
    homePage(req, res){
      // test logs ip
      console.log(req.headers['x-forwarded-for'] ) // récupère l'ip
      console.log(client)
      // Test requete sql
      client.query("SELECT * FROM shark")
        .then(result => {
            console.log('resultat sql => ');
            console.log(result.rows);
            // Rendu de la page d'accueil
            console.log('render de l index par le main controller')
            res.render('index');
        })
        .catch(error => {
            res.status(500).send(error.message); // Si une erreur est affichée sur la home page, c'est qu'il faut compléter la Partie 4 ! 
        });
    }
  };
  
  module.exports = mainController;