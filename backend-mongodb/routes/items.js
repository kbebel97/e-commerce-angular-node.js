const express = require("express");

const Item = require("../models/item");
const CartItem = require("../models/cartItem");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  const item = new Item({
    name: req.body.name,
    description: req.body.description,
    individualPrice: req.body.individualPrice,
    individualTax: req.body.individualTax,
    individualShipping : req.body.individualShipping,
    manufacturer: req.body.manufacturer,
    rating: req.body.rating,
    imagePaths: req.body.imagePaths
  });
  item.save().then(createdItem => {
    res.status(201).json({message: 'Item added successfully', item: createdItem
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
})

router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  Item.findOne({_id: req.params.id}).then(item => {
    if(item){
      res.status(200).json({message: "Item found!", item : item});
    } else {
      res.status(404).json({ message: "Item not found!", item: null})
    }
  })
})

router.delete("/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id);
  Item.deleteOne({_id: req.params.id}).then(item => {
    CartItem.deleteMany({itemId: req.params.id}).then((result => {
      res.status(200).json({message: "Item deleted!"});
    }))
  })
})






module.exports = router;
