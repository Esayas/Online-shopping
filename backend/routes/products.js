const express = require("express");
const cloudinary = require("../utils/cloudinary");
const { Product } = require("../models/product");

const router = express.Router();

const multer = require("multer");

//CREATE

// Increase the request size limit for multer
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// router.post("/", upload.single("file"), async (req, res) => {
router.post("/", async (req, res) => {
  const { name, brand, desc, price, image } = req.body;
  // console.log("TG", req.body);
  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-shop",
      });
      if (uploadRes) {
        const products = new Product({
          name,
          brand,
          desc,
          price,
          image: uploadRes,
        });
        const saveProduct = await products.save();

        res.status(200).send(saveProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
