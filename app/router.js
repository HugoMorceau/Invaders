const { Router } = require("express");
const mainController = require("./controllers/mainController");

const router = new Router();

// Pas forcément un controller, car très simple
router.get('/', (_req, res)=>{
    res.render('index');
  });

module.exports = router;
