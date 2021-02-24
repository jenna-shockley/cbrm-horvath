const express = require(`express`)
const router = express.Router()
const controller = require(`../controllers/mappingController`)

// Create new mapping
router.get(`/new`, controller.mappingNew)
// Post date from new mapping
router.post(`/`, controller.mappingPost)
// Show mapping
router.get(`/:id`, controller.mappingShow)

module.exports = router
