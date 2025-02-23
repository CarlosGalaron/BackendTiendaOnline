const Payment = require("../models/paymentModel");

exports.createPayment = async (req, res) => {
  try {
    const {
      total_books,
      total_amount,
      account_number,
      cvc,
      card_expiry,
      email,
      delivery_address
    } = req.body;

    // Validación opcional: comprobar que total_amount == total_books * 10
    const expectedAmount = total_books * 10;
    if (parseFloat(total_amount) !== expectedAmount) {
      return res.status(400).json({
        message: "El monto total no coincide con el precio fijo de $10 por libro."
      });
    }

    const payment = await Payment.create({
      total_books,
      total_amount,
      account_number,
      cvc,
      card_expiry,
      email,
      delivery_address
    });

    res.status(201).json({ message: "Pago simulado procesado", payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
