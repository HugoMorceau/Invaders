// const client = require('../database/client');
// const { pool } = require("../database/db");
const client = require("../database/client");

const mainController = {
    homePage(req, res){
      try{
        // cookies
        console.log(req)
        console.log('req.session.admino = ' + req.session.admino);
        if(req.session.admino === 'test'){
          console.log('req.session.admino valorise "test" ');  
        }else {
          req.session.admino = 'index'
          console.log(req.session.admino);
        }
        // Rendu de la page d'accueil
        console.log('render de l index par le main controller');
        res.render('index');
    
      }  
    catch(error) {
        res.status(500).send(error.message); // Si une erreur est affichée sur la home page, c'est qu'il faut compléter la Partie 4 ! 
    };
  }
};
  
  module.exports = mainController;