const controller = require('./termsOfUse.controller');
const router = require("express").Router();
const { guard } = require('../../helper');

/*
 *  Add 
 */
router.post(
    "/create",
    guard.isAuthorized(['admin']),
    controller.create
);

/*
 *  Get
 */
router.get(
    "/get",
    controller.get
);

/*
 *  Update 
 */
router.put(
    "/update/:id",
    guard.isAuthorized(['admin']),
    controller.update
);

module.exports = router