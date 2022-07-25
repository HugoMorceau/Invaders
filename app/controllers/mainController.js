// const client = require('../database/client');
// const { pool } = require("../database/db");
const { pool } = require("../database/db");

console.log(pool);

const mainController = {
    homePage(req, res){
      // Rendu de la page d'accueil
      console.log('render de l index par le main controller')
      // test logs ip
      console.log('logs ip debut ')
      console.log(req.headers['x-forwarded-for'] )
      console.log(req.socket.remoteAddress)
      console.log('logs ip fin ')
      res.render('index');
    }
  };
  
  module.exports = mainController;