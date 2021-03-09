const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const CartItem = require("../models/cartItem");
const Invoice = require("../models/invoice");
const Review = require("../models/review");

const router = express.Router();
const jwt = require("jsonwebtoken");

const multer = require("multer");
const checkAuth = require("../middleware/check-auth");


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // backend/images is relative towards server.js file. Not the current file.
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(null, "backend-mongodb/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.put("/generaldata", checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser && req.file){
      const url = req.protocol + '://' + req.get("host");
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shippingAddresses: fetchedUser.shippingAddresses,
        imagePath: url + "/images/" + req.file.filename
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Update successful! Image uploaded", imagePath: user.imagePath});
      })
    } else if(!req.body.image){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shippingAddresses: fetchedUser.shippingAddresses,
        imagePath: null
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Update successful! No image uploaded", imagePath: null});
      })
    } else if(fetchedUser && !req.file){
      console.log(req.body.image);
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shippingAddresses: fetchedUser.shippingAddresses,
        imagePath: req.body.image
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Update successful! No image uploaded", imagePath: null});
      })
    }
    else {
        res.status(200).json({message: "Update failed. User was not found!"});
    }
  }
  )
});

router.put("/updatepassword", checkAuth, (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser) => {
    if(fetchedUser){
      bcrypt.compare( req.body.oldpassword, req.body.oldhashedpassword)
      .then(equal => {
        if(equal){
          bcrypt.hash(req.body.newpassword, 10)
            .then(encryptedPassword => {
              const user = new User({
                _id: req.userData.userId,
                email: fetchedUser.email,
                password: encryptedPassword,
                userName: fetchedUser.userName,
                firstName: fetchedUser.firstName,
                lastName: fetchedUser.lastName,
                paymentMethods: fetchedUser.paymentMethods,
                shippingAddresses: fetchedUser.shippingAddresses,
                imagePath: fetchedUser.imagePath
              });
              User.updateOne({_id: req.userData.userId}, user).then(() => {
                res.status(200).json({message: "password update successful!", passwordUpdated: true, encryptedPassword: encryptedPassword})
              })
            })
        } else {
            res.status(401).json({message: "password does not match!", passwordUpdated: false, encryptedPassword: null})
          }
        });
      }
    })
  }
)

router.put("/updateusername", checkAuth, (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser) => {
    if(fetchedUser){
      bcrypt.compare(req.body.unencryptedPassword, req.body.password)
      .then(equal => {
        if(equal){
          console.log(req.body.userName);
          const updatedUser = new User({
            _id: req.userData.userId,
            email: fetchedUser.email,
            password: fetchedUser.password,
            userName: req.body.userName,
            firstName: fetchedUser.firstName,
            lastName: fetchedUser.lastName,
            paymentMethods: fetchedUser.paymentMethods,
            shippingAddresses: fetchedUser.shippingAddresses,
            imagePath: fetchedUser.imagePath
          });
          User.updateOne({_id: req.userData.userId}, updatedUser).then(() => {
            res.status(200).json({message: "username update successful!", usernameUpdated: true, username: req.body.userName})
          })
        } else {
            res.status(401).json({ message: "password does not match!", usernameUpdated: false, username: false })
          }
        });
      }
    })
  }
)

router.put("/selectpayment", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: req.body.paymentMethods,
        shippingAddresses: fetchedUser.shipping,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Default payment has been selected"});
      })
    } else {
        res.status(200).json({message: "Default payment failed to be selected"});
    }
  }
  )
});

router.put("/updatepayment", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      console.log(fetchedUser);
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: req.body.paymentMethods,
        shippingAddresses: fetchedUser.shipping,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Default payment has been updated"});
      })
    } else {
        res.status(200).json({message: "Default payment failed to be updated"});
    }
  }
  )
});

router.put("/addpayment", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: req.body.paymentMethods,
        shippingAddresses: fetchedUser.shipping,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Payment method has been added"});
      })
    } else {
        res.status(200).json({message: "Payment method failed to be added"});
    }
  }
  )
});

router.put("/updateaddress", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      console.log(fetchedUser);
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shippingAddresses: req.body.shippingAddresses,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Default payment has been updated"});
      })
    } else {
        res.status(200).json({message: "Default payment failed to be updated"});
    }
  }
  )
});

router.put("/addaddress", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shippingAddresses: req.body.shippingAddresses,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Shipping address has been added"});
      })
    } else {
        res.status(200).json({message: "Shipping address failed to load"});
    }
  }
  )
});

router.put("/selectaddress", checkAuth,
  (req, res, next) => {
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    return fetchedUser;
  })
  .then((fetchedUser)=>{
    if(fetchedUser){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: fetchedUser.userName,
        firstName: fetchedUser.firstName,
        lastName: fetchedUser.lastName,
        paymentMethods: req.body.paymentMethods,
        shippingAddresses: req.body.shippingAddresses,
        imagePath: fetchedUser.imagePath
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Default shipping address selected"});
      })
    } else {
        res.status(200).json({message: "Failed to select default shipping address"});
    }
  }
  )
});

router.get("", checkAuth, (req, res, next ) => {
  User.findOne({_id: req.userData.userId }).then(user => {
    if(user){
      res.status(200).json({message: "User found!", user: user});
    } else {
      res.status(404).json({ message: "User not found!", user : user})
    }
  })
})

// router.get("/users", checkAuth, (req, res, next ) => {
//   let count;
//   let users1;
//   User.find({isAdmin: false }).then(users => {
//     users1 = users;
//     return User.count({isAdmin: false});
//   })
//   .then((count)=> {
//     if(users1){
//       res.status(200).json({message: "Users found!", userCount: count, users: users1});
//     } else {
//       res.status(404).json({ message: "Users not found!", userCount: 0, users : null})
//     }
//   })
// })

router.get("/users", checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find({isAdmin: false});
  let fetchedUsers;
  if(pageSize && currentPage){
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // Chaining multiple queries. 1st query counts amount of items in database, 2nd query retrieves them
  userQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count({isAdmin: false});
    })
    .then(count => {
      res.status(200).json({ message: 'Users fetched successfully', userCount: count, users: fetchedUsers });
    })
})

router.post("/signup", (req, res,next) => {
  //we install npm install --save bcrypt so that we can hash our password so it is secure
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        isAdmin: false
      });
      console.log(user);
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});

router.post("/adminsignup", (req, res,next) => {
  //we install npm install --save bcrypt so that we can hash our password so it is secure
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        isAdmin: true
      });
      console.log(user);
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })
    });
});


router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if(!user){
        throw new Error('Auth failed')
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if(!result){
        console.log(result);
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      console.log(result);
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id },
        'secret_this_should_be_longer',
        {expiresIn: "1h"});
      // npm install --save jsonwebtoken
      res.status(200).json({
        token: token, fetchedUser: fetchedUser, expiresIn: 3600
      })
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    })
})

router.delete("/:id", checkAuth, (req, res, next) => {
  User.deleteOne({_id: req.params.id})
  .then(result => {
    CartItem.deleteMany({creator: req.params.id})
    .then(result => {
      console.log("Deleted all cart items related to user")
    })
    Invoice.deleteMany({creator: req.params.id})
    .then(result => {
      console.log("Deleted all invoices related to user")
    })
    Review.deleteMany({creator: req.params.id})
    .then(result => {
      console.log("Deleted all reviews related to user");
    })
    res.status(200).json({message: "User deleted!" });
  })
})

module.exports = router;
