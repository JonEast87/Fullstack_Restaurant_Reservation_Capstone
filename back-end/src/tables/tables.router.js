const router = require('express').Router()
const controller = require('./tables.controller')

/**
 * Defines the router for table resources.
 *
 * @type {Router}
 */
router.route('/').get(controller.list).post(controller.create)

router
	.route('/:table_id/seat')
	.put(controller.update)
	.delete(controller.destroy)

module.exports = router
