const controller = require('./rules_regulations.controller');
const router = require("express").Router();
const { guard } = require('../../helper');

/*
 *  Add 
 */
router.post(
    "/",
    guard.isAuthorized(['admin']),
    controller.create
);

/*
 *  Get
 */
router.get(
    "/",
    controller.get
);

/*
 *  Get by id
 */
router.get(
    "/:id",
    controller.getById
);


/*
 *  Update 
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.update
);

/*
 *  Delete  
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.delete
);

module.exports = router