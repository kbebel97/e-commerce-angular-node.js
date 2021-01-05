const express = require("express");

const Item = require("../models/item");


const multer = require("multer");

const router = express.Router();

const MIMIE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // backend/images is relative towards server.js file. Not the current file.
    const isValid = MIMIE_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post("", (req, res, next) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    individualPrice: req.body.individualPrice,
    individualTax: req.body.individualTax,
    individualShipping : req.body.individualShipping,
    manufacturer: req.body.manufacturer,
    reviews: req.body.reviews,
    rating: req.body.rating
  });
  item.save().then(createdItem => {
    res.status(201).json({message: 'Item added successfully', cartItem: createdItem
  });
  });
  console.log(item);
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const itemQuery = Item.find();
  let fetchedItems;
  if(pageSize && currentPage){
    itemQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // Chaining multiple queries. 1st query counts amount of items in database, 2nd query retrieves them
  itemQuery
    .then(documents => {
      fetchedItems = documents;
      return Item.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Items fetched successfully',
        items: fetchedItems,
        maxItems: count
      });
    })
  // itemQuery.find().then(documents => {
  //   res.status(200).json({
  //     message: 'Items fetched successfully',
  //     items: documents
  //   });
  // });
})

router.get(":id", (req, res, next) => {
  Item.findById(req.params.id).then(item => {
    if(item){
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Item not found!"})
    }
  })
})






module.exports = router;
