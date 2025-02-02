const express = require("express");
const cloudinary = require("../utils/cloudinary");
const { Product } = require("../models/product");
const router = express.Router();

const multer = require("multer");
const { isAdmin } = require("../middleware/auth");

//CREATE

// Increase the request size limit for multer
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// router.post("/", upload.single("file"), async (req, res) => {
router.post("/", isAdmin, async (req, res) => {
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

router.get("/find/:id", async (req, res) => {
  try {
    const products = await Product.findById(req.params.id);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );

      if (destroyResponse) {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);
        res.status(200).send(deleteProduct);
      }
    } else {
      console.log("Action terminated. Failed to delete product image...");
    }
  } catch (err) {
    res.status(500).send(error);
  }
});

//EDIT PRODUCT

router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.image.public_id
      );

      if (destroyResponse) {
        const uploadedResponse = await cloudinary.uploader.upload(
          req.body.productImg,
          {
            upload_preset: "online-shop",
          }
        );

        if (uploadedResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadedResponse,
              },
            },
            { new: true }
          );

          res.status(200).send(updatedProduct);
        }
      }
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    try {
      // console.log("TGSunday");
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

module.exports = router;
