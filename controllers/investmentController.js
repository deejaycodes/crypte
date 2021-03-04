const Investment = require("../models/Investment");

class InvestmentController {
  async addNewInvestment(req, res) {
    try {
      const { plan } = req.body;
      if (plan === "starter_plan") {
        const investment_owner = req.user._id;
        const starter_investment = {
          plan: plan,
          owner: investment_owner,
          amount: 500,
          dailyEarning: 13,
          monthlyEarning: 390,
        };
        const investment = await new Investment(starter_investment);
        await investment.save();
        investment;
        res.status(201).send({ investment });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

const investmentController = new InvestmentController();
module.exports = investmentController;
