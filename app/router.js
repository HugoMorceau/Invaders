const { Router } = require("express");
const mainController = require("./controllers/mainController");

const router = new Router();

router.get('/', mainController.homePage);

module.exports = router;
