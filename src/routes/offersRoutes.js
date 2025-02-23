// routes/offersRoutes.js
const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offersController");

router.get("/", offerController.getOffers);
router.get("/:id", offerController.getOfferById);
router.post("/", offerController.createOffer);
router.put("/:id", offerController.updateOffer);
router.delete("/:id", offerController.deleteOffer);

module.exports = router;
