const express = require('express');
const router = express();
const productSchema = require('../Models/Product-model');
const isloggedin = require('../middlewares/isLoggedIn');
const userModel = require("../Models/User-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  let message = req.flash("message");
  res.render("index", { message, error, loggedin: false });
});

router.get('/addtocart/:productid', isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/shop");
    }

    if (!user.cart) {
      user.cart = [];
    }

    let product = await productSchema.findById(req.params.productid);
    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/shop");
    }

    user.cart.push(req.params.productid);
    await user.save();

    // Set success message after adding to cart
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (error) {
    console.error("Error adding to cart:", error);
    req.flash("error", "There was an error adding the item to your cart.");
    res.redirect("/shop");
  }
});

router.get('/shop', isloggedin, async function (req, res) {
  try {
    let products = await productSchema.find();

    // Get flash messages for success and error
    let success = req.flash("success");
    let error = req.flash("error");

    res.render('shop', { products, success, error });
  } catch (error) {
    console.error("Error fetching products:", error);
    req.flash("error", "There was an error loading the products.");
    res.redirect("/shop");
  }
});

router.get('/cart', isloggedin, async function (req, res) {
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");

    if (!user || !user.cart || user.cart.length === 0) {
      req.flash("error", "No items in the cart.");
      return res.redirect("/shop");
    }

    // Calculate bill based on cart
    const bill = Number(user.cart[0].price) + 20 - Number(user.cart[0].discount);

    // Pass user and bill, as well as flash messages
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("cart", { user, bill, success, error });
  } catch (error) {
    console.error("Error fetching cart:", error);
    req.flash("error", "There was an error loading your cart.");
    res.redirect("/shop");
  }
});

router.get("/logout", isloggedin, async function (req, res) {
  req.logout(function(err) {
    if (err) {
      req.flash("error", "Error logging out.");
      return res.redirect("/shop");
    }
    res.redirect("/");
  });
});

module.exports = router;

