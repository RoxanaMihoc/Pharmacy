exports.createPaymentIntent = async (req, res) => {
    const { amount } = req.body;  // Amount should be calculated or validated server-side
  
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd', // or any currency
      });
  
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).send({ error: error.message });
    }
  };