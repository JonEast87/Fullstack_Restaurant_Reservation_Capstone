const router = require('express').Router()
const controller = require('./tables.controller')

/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */
router.route('/').get(controller.list).post(controller.create)

router.route('/:table_id').get(controller.read)

module.exports = router
