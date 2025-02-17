const express = require("express");
const router = express.Router();
const { createPayment, getPayments } = require("../controllers/paymentController");

router.post("/payment", createPayment);
router.get("/payments", getPayments);

module.exports = router;
