const { Router } = require("express");
const mainController = require("./controllers/mainController");

const router = new Router();

// Pas forcément un controller, car très simple
/* router.get('/', (_req, res)=>{
    console.log('render de l index')
    res.render('index');
  }); */

router.get('/', mainController.homePage);

module.exports = router;
