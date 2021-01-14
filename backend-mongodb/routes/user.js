const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user")
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
    console.log(req.body);
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
        shipping: fetchedUser.shipping,
        imagePath: url + "/images/" + req.file.filename
      });
      User.updateOne({_id: fetchedUser._id}, user).then(()=>{
        res.status(200).json({message: "Update successful! Image uploaded", imagePath: user.imagePath});
      })
    } else if(fetchedUser && !req.file){
      const user = new User({
        _id: fetchedUser._id,
        email: fetchedUser.email,
        password: fetchedUser.password,
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        paymentMethods: fetchedUser.paymentMethods,
        shipping: fetchedUser.shipping,
        imagePath: fetchedUser.imagePath
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

router.put("/logindata", checkAuth, (req, res, next) => {
  let user1;
  let hash2;
  User.findOne({_id: req.userData.userId})
  .then(fetchedUser => {
    user1 = fetchedUser;
    return fetchedUser;
  })
  .then((fetchedUser) => {
    if(fetchedUser){
      bcrypt.compare( req.body.oldpassword, req.body.oldhashedpassword)
      .then(equal => {
        if(equal){
          bcrypt.hash(req.body.newpassword, 10)
            .then(hash => {
              hash2 = hash;
              const user = new User({
                _id: req.userData.userId,
                email: req.body.email,
                password: hash,
                userName: req.body.userName,
                firstName: user1.firstName,
                lastName: user1.lastName,
                paymentMethods: user1.paymentMethods,
                shippingAddresses: user1.shippingAddresses,
                imagePath: user1.imagePath
              });
              User.updateOne({_id: req.userData.userId}, user).then(() => {
                res.status(200).json({message: "Login Update successful!", boolean: true, hash: hash2})
              })
            })
        } else {
            res.status(401).json({ message: "Password does not match!"})
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
    console.log(req.body.shippingAddresses);
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


router.post("/signup", (req, res,next) => {
  //we install npm install --save bcrypt so that we can hash our password so it is secure
  // console.log(req.body);
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
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

module.exports = router;
