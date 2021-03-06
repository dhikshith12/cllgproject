const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { assert } = require("console");
const { parse } = require("path");
const { bulkWrite } = require("../models/product");
const mysqlConnection = require("../dbconnection")

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found"
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    const {name, description, price, category, stock} = fields;

    if(!(name||description||price||category||stock)){
        return res.status(400).json({
            error: "All fields are required"
        })
    }

    //TODO: restrictions on field
    let product = new Product(fields);

    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving tshirt in DB failed"
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req,res)=>{
    req.product.photo = undefined
    return res.json(req.product);
}

exports.photo = (req,res,next)=>{
    if(req.product.photo.data){
        res.set("Content-Typte", req.product.photo.contentType)
        return res.send(req.product.photo.data);
    }
}

exports.deleteProduct = (req,res)=>{
    let product = req.product;
    product.remove((err, deletedProduct)=>{
      if(err){
        return res.status(400).json({
          error: "Failed to delete product"
        })
      }
      res.json({
        message: "Deleted Succesfully",
        deletedProduct
      })
    }) 
}

exports.updateProduct = (req,res)=>{
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      });
    }

    //TODO: restrictions on field
    let product = req.product;
    product = _.extend(product, fields)
    //handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size too big!"
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    //save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "failed to Update"
        });
      }
      res.json(product);
    });
  });

}

exports.getAllProducts = (req,res)=>{
  let limit = req.query.limit? parseInt(req.query.limit): 8;
  let sortBy = req.query.sortBy? req.query.sortBy: "_id";

  mysqlConnection.query('select * from products',(err,rows)=>{
    console.log('getting products....')
    console.log(rows)
    res.send('got products..')
  })
}

exports.updateStock = (req,res, next)=>{

  let myOperations = req.body.order.products.map(prod =>{
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {stock: -prod.count, sold: +prod.count}
      }
    }
  })

  Product.bulkWrite(myOperations, {}, (err, products)=>{
    if(err){
      return res.status(400).json({
        error: "Bulk Operation failed"
      })
    }
    next();
  });
}

