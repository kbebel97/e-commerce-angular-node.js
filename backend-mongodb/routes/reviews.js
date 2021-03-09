const express = require("express");

const Review = require("../models/review");
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.post("", checkAuth, (req, res, next) => {
  // let fetchedUser;
  // User.find({_id: req.userDate.userId})
  // .then((user) => {
  //   if(!user){
  //     throw new Error('Auth failed')
  //   } else {
  //     fetchedUser = user;
  //     return user;
  //   }
  // })
  // .then((user) => {
    Review.findOne({userId: req.userData.userId, itemId: req.body.itemId})
    .then((result)=> {
          return result;
      })
      .then((result)=> {
        if(result){
          throw new Error('Review already exists')
          // res.status(400).json({
          //   message: 'Review already exists!',
          //   review: null,
          // });
        } else {
          const review = new Review({
            itemId: req.body.itemId,
            creator: req.userData.userId,
            email: req.body.email,
            userName: req.body.userName,
            rating: req.body.rating,
            comment: req.body.comment
          });
          review.save().then(review => {
            res.status(200).json({message: 'review added!', review: review
          });
          });
        }
      })
      .catch(err => {
        res.status(400).json({
          error: err
        })
      })
});

router.put("", checkAuth, (req, res, next) => {
  console.log(req.body);
  const review = new Review({
    _id: req.body.reviewId,
    itemId: req.body.itemId,
    creator: req.body.userId,
    email: req.body.email,
    userName: req.body.userName,
    rating: req.body.rating,
    comment: req.body.comment,
  })
  Review.updateOne({_id: req.body.reviewId, itemId: req.body.itemId}, review)
    .then( res.status(200).json({message: 'Successfully updated'}))
    .catch(err => {
      res.status(404).json({
        error: err
      })
    })
})

router.get("/:id", checkAuth, (req, res, next) => {
  Review.find({itemId: req.params.id})
    .then( reviews => {
      if(reviews)
        res.status(200).json({message: 'fetched reviews!', reviews: reviews});
      else throw new Error('Reviews not found!')
    })
    .catch(err => {
      res.status(404).json({
        error: err
      })
    })
})


router.get("/myreview/:id", checkAuth, (req, res, next) => {
  console.log(req.params.id)
  Review.findOne({itemId: req.params.id,
                  creator: req.userData.userId})
    .then( review => {
      if(review)
      res.status(200).json({message: 'fetched review!', review: review});
      else throw new Error('Review not found!')
    })
    .catch(err => {
      res.status(404).json({
        error: err
      })
    })
})

module.exports = router;
