const { usersRoutes } = require('../services/users');
const { adminRoutes } = require('../services/admin');
const { termsOfUseRoutes } = require('../services/terms_and_conditions');
const { privacyPolicyRoutes } = require('../services/privacy_policy');
const { faqRoutes } = require('../services/faq');
const { rulesRegulationsRoutes } = require('../services/rules_regulations');
const { productRoutes } = require('../services/product');

const initialize = (app) => {
  app.use("/api/users", usersRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/term-conditions", termsOfUseRoutes);
  app.use("/api/privacy-policy", privacyPolicyRoutes);
  app.use("/api/faq", faqRoutes);
  app.use("/api/rules-ragulations", rulesRegulationsRoutes);
  app.use("/api/product", productRoutes);


  app.use("/authError", (req, res, next) => {
    return next(new Error("DEFAULT_AUTH"));
  });

  app.get("/ping", (req, res) => {
    res.status(200).send({
      success: true,
      statusCode: 200,
    });
  });
};

module.exports = { initialize };
