const controller = require('./faq.controller');
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
 *  Update 
 */
router.put(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.update
);

/*
 *  Delete Product Category
 */
router.delete(
    "/:id",
    guard.isAuthorized(['admin']),
    controller.delete
);

module.exports = router