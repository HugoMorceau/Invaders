const { Router } = require("express");
const mainController = require("./controllers/mainController");

const router = new Router();

router.get('/', mainController.homePage);

router.get('/test', (req,res)=> {
  req.session.admino = 'test'
  console.log(req.session.admino)
  res.render('index');
});

module.exports = router;
