const router = require('express').Router()
const controller = require('./reservations.controller')

/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
router.route('/').get(controller.list).post(controller.create)

router.route('/:reservationId').get(controller.read)

router.route('/:reservationId/status').put(controller.update)

module.exports = router
