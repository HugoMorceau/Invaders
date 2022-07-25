// const client = require('../database/client');
const { pool } = require("../database/db");

console.log(pool)

const mainController = {
    homePage(_req, res){
      // Rendu de la page d'accueil
      console.log(pool)
      console.log('render de l index par le main controller')
      res.render('index');
    }
  };
  
  module.exports = mainController;