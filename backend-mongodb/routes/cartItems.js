const express = require("express");

const CartItem = require("../models/cartItem");
const Item = require("../models/item");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res, next) => {
  const cartitemQuery = CartItem.findOne({itemId : req.body.id, creator: req.userData.userId})
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
          item: req.body,
          creator: req.userData.userId
        });
        CartItem.updateOne({ _id: fetchedItem._id, creator: req.userData.userId }, cartItem).then(result => {
          console.log(result);
          res.status(200).json({message: "Update successful!", cartItem : null, count : count});
        });
      } else {
        const cartItem = new CartItem({
          itemId: req.body.id,
          qty: 1,
          item: req.body,
          creator: req.userData.userId
        });
        cartItem.save().then((result) => {
          res.status(201).json({message: 'Item added successfully!', cartItem: result, count : count});
        })
      }
    })
});

router.post("/itemId", checkAuth, (req, res, next) => {
  console.log(req.body.itemId);
  const itemQuery = Item.findOne({_id : req.body.itemId});
  const cartitemQuery = CartItem.findOne({itemId : req.body.itemId, creator: req.userData.userId})
  let fetchedCartItem;
  // Chaining multiple queries. 1st query retrieves cartitem need to be updated, 2nd query increases cartitem quantity by one if it exists in db
  itemQuery.then((fetchedItem) => {
    fetchedItem = fetchedItem;
    return fetchedItem;
  })
  .then((fetchedItem)=> {
    cartitemQuery
    .then(document => {
      console.log(document);
      fetchedCartItem = document;
      return CartItem.count();
    })
    .then((count) => {
      if(fetchedCartItem!=null){
        const cartItem = new CartItem({
          _id: fetchedCartItem._id,
          itemId: req.body.itemId,
          qty: parseInt(fetchedCartItem.qty) + 1,
          item: fetchedItem,
          creator: req.userData.userId
        });
        CartItem.updateOne({ _id: fetchedCartItem._id, creator: req.userData.userId }, cartItem).then(result => {
          console.log(result);
          res.status(200).json({message: "Update successful!", cartItem : null, count : count});
        });
      } else {
        const cartItem = new CartItem({
          itemId: req.body.itemId,
          qty: 1,
          item: fetchedItem,
          creator: req.userData.userId
        });
        cartItem.save().then((result) => {
          res.status(201).json({message: 'Item added successfully!', cartItem: result, count : count});
        })
      }
    })
  })
});

router.put("", checkAuth, (req, res, next) => {
  const cartItem = new CartItem({
    _id: req.body.cartItemId,
    qty: req.body.qty,
    item: req.body.item,
    creator: req.userData.userId
  });
  console.log(cartItem);
  CartItem.updateOne({ _id: req.body.cartItemId, creator: req.userData.userId}, cartItem).then(result => {
    console.log(result);
    res.status(200).json({message: "Update successful!"});
  });
});


router.get("", checkAuth, (req, res, next) => {
  let fetchedItem;
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const cIQuery = CartItem.find({creator : req.userData.userId});
  if(pageSize && currentPage){
  cIQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  cIQuery.then(result => {
    fetchedItem = result;
    return CartItem.count({creator: req.userData.userId});
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

router.delete("", checkAuth, (req, res, next) => {
  CartItem.remove({creator: req.userData.userId}).then(result => {
    console.log(result);
    res.status(200).json({message: "All items removed from cart!" });

  })
})

router.delete("/:id", checkAuth, (req, res, next) => {
  CartItem.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    res.status(200).json({message: "Item removed from cart!" });
  });
});

module.exports = router;
