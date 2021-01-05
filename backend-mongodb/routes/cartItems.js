const express = require("express");

const CartItem = require("../models/cartItem");

const router = express.Router();

router.use('', (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});


// router.get(":id", (req, res, next) => {
//   Item.findById(req.params.id).then(item => {
//     if(item){
//       res.status(200).json(item);
//     } else {
//       res.status(404).json({ message: "Item not found!"})
//     }
//   })
// })

router.post("", (req, res, next) => {
  const cartitemQuery = CartItem.findOne({itemId : req.body.id})
  let fetchedItem;
  // Chaining multiple queries. 1st query retrieves cartitem need to be updated, 2nd query increases cartitem quantity by one if it exists in db
  cartitemQuery
    .then(document => {
      console.log(document);
      fetchedItem = document;
      return CartItem.count();
    })
    .then((count) => {
      if(fetchedItem!=null){
        const cartItem = new CartItem({
          _id: fetchedItem._id,
          itemId: req.body.id,
          qty: parseInt(fetchedItem.qty) + 1,
          item: req.body
        });
        CartItem.updateOne({ itemId: req.body.id }, cartItem).then(result => {
          console.log(result);
          res.status(200).json({message: "Update successful!", cartItem : null, count : count});
        });
      } else {
        const cartItem = new CartItem({
          itemId: req.body.id,
          qty: 1,
          item: req.body
        });
        cartItem.save().then((result) => {
          res.status(201).json({message: 'Item added successfully!', cartItem: result, count : count});
        })
      }
    })
});

router.put("", (req, res, next) => {
  const cartItem = new CartItem({
    _id: req.body.cartItemId,
    itemId: req.body.itemId,
    qty: req.body.qty,
    item: req.body.item
  });
  console.log(cartItem);
  CartItem.updateOne({ _id: req.body.cartItemId }, cartItem).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful!"});
  });
});


router.get("", (req, res, next) => {
  let fetchedItem;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const cIQuery = CartItem.find();
  if(pageSize && currentPage){
  cIQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  cIQuery.then(result => {
    fetchedItem = result;
    return CartItem.count();
  })
  .then((count) => {
    res.status(200).json({
      message: 'Items fetched successfully',
      cartitems: fetchedItem,
      ciCount: count
    });
  });
})

router.get("/:id", (req, res, next) => {
  CartItem.findOne({itemId : req.params.id}).then(cartItem => {
    if(cartItem){
      res.status(200).json(cartItem);
    } else {
      res.status(404).json({ message: "Item not found!"})
    }
  })
})

// router.put("", (req, res, next) => {
//   const cartItem = new CartItem({
//     _id: req.body.id,
//     itemId: req.body.id,
//     qty: req.body.qty,
//     item: req.body.item
//   });
//   CartItem.updateOne({ _id: req.body.id }, cartItem).then(result => {
//     res.status(200).json({message: "Update successful!"});
//   });
// });

router.delete("/:id", (req, res, next) => {
  CartItem.deleteOne({_id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({message: "Item removed from cart!" });
  });
});

module.exports = router;
