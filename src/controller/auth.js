const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const shortid = require("shortid");
const googleOAuth = require("../utils/googleOAuth");
const { OAuth2Client } = require("google-auth-library");
let nodemailer = require('nodemailer');
const registerValidator = require('../validators/registerValidator')
const loginValidator = require('../validators/loginValidator')
const validator = require('validator')


// create Nodemailer SES transporter
// let transporter = nodemailer.createTransport({
//     SES: new aws.SES({
//         apiVersion: '2010-12-01'
//     })
// });

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);



//------------------------------------------------------------------------------------------------------------------
exports.signup = (req, res) => {
  const { email, password, confirmPassword, accountType, userName } = req.body;

  const register = registerValidator(email, password, confirmPassword, accountType, userName)
  console.log(userName, accountType)
  if (!register.isError) {
    return res.status(404).json(error)
  }

  console.log(userName)

  User.findOne({ email })
    .then(user => {

      if (user) {
        return res.status(400).json({ error: 'User already registered with this email' })
      }

      User.findOne({ userName })
        .then(user2 => {
          if (user2) {
            return res.status(400).json({ error: 'Username already taken ! select another' })
          }

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash_password) => {
              const _user = new User({
                email,
                hash_password,
                userName,
                accountType,
                role: "user",
                resetPassToken: "",

              });

              _user.save()
                .then(usersaved => {
                  res.status(201).json({
                    success: true,
                    message: "User created Successfully..!",
                  })
                })
                .catch(err => {
                  return res.status(400).json({ error: 'Something went wrong' })
                })

            })
          })

        })


    })
    .catch(err => {
      return res.status(400).json({ error: 'Something went wrong' })
    }
    )
}
//------------------------------------------------------------------------------------------------------------------
exports.signin = (req, res) => {
  const { emailorusername, password } = req.body

  const login = loginValidator(emailorusername, password)

  if (!login.isError) {
    return res.status(404).json(error)
  }

  User.findOne({ $or: [{ email: emailorusername }, { userName: emailorusername }] }).exec((error, user) => {
    if (error) return res.status(400).json({ error });

    if (user) {
      bcrypt.compare(req.body.password, user.hash_password, (err, result) => {
        if (err) {
          return res
            .status(400)
            .json({ error: "something went wrong, try again" });
        }
        if (!result) {
          return res.status(400).json({ error: "invalid credentials" });
        }


        if (user.isSuspended === true) return res.status(400).json({ error: "You are suspended" });

        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        const { _id, firstName, lastName, email, role, profilePicture, resetPassToken } = user;
        //res.cookie("videoshare-token", token, { expiresIn: "1d" });
        res.status(200).json({
          success: true,
          token: "Bearer " + token,
          user: { _id, firstName, lastName, email, role, profilePicture, resetPassToken },
        });
      });
    } else {
      return res.status(400).json({ error: "User not found" });
    }
  });
};
//------------------------------------------------------------------------------------------------------------------
exports.verify = (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
      if (err) {
        return res.status(401).json({ error: "token expired or invalid" });
      }

      //if (user.approval.isApproved === false) return res.status(400).json({ error:"Your account is not approved yet" });
      User.findById(user._id)
        .select("-hash_password")
        .then((user) => {
          return res.status(200).json({ success: true, user });
        });
    });
  } else {
    return res.status(401).json({ error: "Authorization required" });
  }
};

//------------------------------------------------------------------------------------------------------------------
exports.editprofileimage = (req, res) => {
  const file = req.file

  if (file) {
    User.findByIdAndUpdate(
      req.user._id,
      { $set: { profilePicture: file.path } },
      { new: true }
    )
      .select("-hash_password")
      .then((user) => {
        return res.status(200).json({
          success: true,
          user: user,
          message: "Image updated successfully",
        });
      })
      .catch((err) => {
        res.status(400).json({ error: "Something went wrong" });
      });
  }
};
//------------------------------------------------------------------------------------------------------------------
exports.editPersonalInformation = (req, res) => {
  const { userName, mobile, paymentNumber, bankDetails } = req.body;
  if (!userName) {
    return res.status(400).json({ error: "Username is required" });
  }


  User.findById(req.user._id).then((user) => {
    if (user.userName === userName) {
      User.findByIdAndUpdate(user._id, { $set: { mobile: mobile || "", paymentNumber: paymentNumber || "", bankDetails: bankDetails || "" } }, { new: true })
        .select("-hash_password")
        .then((updated) => {
          res.status(200).json({ user: updated, success: true });
        });
    } else {
      User.findOne({ userName: userName }).then((user2) => {
        if (user2) {
          return res
            .status(400)
            .json({ error: "Username already taken, try another!" });
        } else {
          User.findByIdAndUpdate(
            user._id,
            { $set: { mobile: mobile || "", paymentNumber: paymentNumber || "", bankDetails: bankDetails || "", userName } },
            { new: true }
          )
            .select("-hash_password")
            .then((updated) => {
              res.status(200).json({ user: updated, success: true });
            })
            .catch((err) => {
              res.status(400).json({ error: "Something went wrong" });
            });
        }
      });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------
exports.editNID = (req, res) => {

  let front = req.files.front && req.files.front[0].path;
  let back = req.files.back && req.files.back[0].path;
  console.log(front, back)
  if (!front || !back) {
    return res.status(400).json({ error: "Both front and back end is required" })
  }

  let data = {
    front,
    back
  }

  User.findByIdAndUpdate(req.user._id, { $set: { NID: data } }, { new: true })
    .select("-hash_password")
    .then((updated) => {
      res.status(200).json({ user: updated, success: true });
    })
    .catch((err) => {
      res.status(400).json({ error: "Something went wrong" });
    });
}
//------------------------------------------------------------------------------------------------------------------

exports.editPassword = (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "please provide new password" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "Password should be minimum 6 character long" });
  }
  if (!confirmPassword) {
    return res.status(400).json({ error: "please provide confirm password" });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "Confirm password does not matched" });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newPassword, salt, (err, hash_password) =>{
        User.findByIdAndUpdate(req.user._id,{$set:{hash_password:hash_password}})
        .then(user=>{
          res.status(200).json({success:true, message:"Password updated successfully"})
        })
        .catch(err=>{
          res.status(400).json({ error: "Something went wrong" });
        })
    })
  })
}

//------------------------------------------------------------------------------------------------------------------
exports.editEmail=(req,res)=>{
  const {email} = req.body
  if(validator.isEmail(email) === false){
    return res.status(400).json({ error: "valid email is required" });
  }

  User.findById(req.user._id)
  .then(user=>{
    if (user.email === email) {
      return res.status(400).json({ error: "Nothing to update" });
    } else {
      User.findOne({ email: email }).then((user2) => {
        if (user2) {
          return res
            .status(400)
            .json({ error: "email already registered, try another!" });
        } else {
          User.findByIdAndUpdate(
            user._id,
            { $set: { email: email} },
            { new: true }
          )
            .select("-hash_password")
            .then((updated) => {
              res.status(200).json({ user: updated, success: true });
            })
            .catch((err) => {
              res.status(400).json({ error: "Something went wrong" });
            });
        }
      });
    }
  })
}


// exports.confirmpwd = (req, res) => {
//   User.findById(req.user._id).then((user) => {
//     if (user.hash_password) {
//       bcrypt.compare(req.body.password, user.hash_password, (err, result) => {
//         if (result) {
//           res.status(200).json({ success: true });
//         } else {
//           return res.status(400).json({ error: "invalid password" });
//         }
//       });
//     } else {
//       return res.status(400).json({ error: "invalid password" });
//     }
//   });
// };

// exports.editPassword = (req, res) => {
//   const { currentpassword, newpassword, confirmpassword } = req.body;

//   if (!currentpassword) {
//     return res.status(400).json({ error: "please provide current password" });
//   }

//   if (!newpassword) {
//     return res.status(400).json({ error: "please provide new password" });
//   } else if (newpassword.length < 6) {
//     return res
//       .status(400)
//       .json({ error: "password should not be less then six letter" });
//   }

//   if (!confirmpassword) {
//     return res.status(400).json({ error: "please provide confirm password" });
//   } else if (newpassword !== confirmpassword) {
//     return res.status(400).json({ error: "confirm password did not matched" });
//   }

//   User.findById(req.user._id).then((user) => {

//       bcrypt.compare(currentpassword, user.hash_password, (err, result) => {
//         if (err) {
//           return res.status(400).json({ error: "something went wrong, try again" });
//         }
//         if (!result) {
//           return res.status(400).json({ error: "Password invalid" });
//         }

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newpassword, salt, (err, hash) => {
//             User.findByIdAndUpdate(
//               user._id,
//               { $set: { hash_password: hash } },
//               { new: true }
//             ).then((newuser) => {
//               res.status(200).json({ message: "password changed successfuly" });
//             });
//           });
//         });
//       });
//   });
// };


// exports.googleAuth = (req, res) => {
//   let password = shortid.generate()
//   const brandingarray =  ['branding1', 'branding2','branding3','branding4']
//   client
//     .verifyIdToken({
//       idToken: req.body.tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     })
//     .then((response) => {
//       if (response.payload.email_verified) {
//         User.findOne({ email: response.payload.email }).then((user) => {         
//           console.log(user)
//           if (user) {
//             if (user.approval.isApproved === false) return res.status(400).json({ error:"Your account is not approved yet" });
//             const token = jwt.sign({ _id: user._id,role:user.role }, process.env.JWT_SECRET, {
//               expiresIn: "1d",
//             });
//             const {  _id, firstName, lastName, email, role, jobRole, videoGoal, profilePicture ,createdBy,approval,accessType,resetPassToken,branding } = user;
//             //res.cookie("videoshare-token", token, { expiresIn: "1d" });
//             res.status(200).json({
//               success: true,
//               token: "Bearer " + token,
//               user: {  _id, firstName, lastName, email, role, jobRole, videoGoal, profilePicture ,createdBy,approval,accessType,resetPassToken,branding },
//             });
//           } else {
//             const email = response.payload.email;

//             bcrypt.hash(password, 10, function(err, hash) {
//               const _user = new User({
//                 email,
//                 hash_password:hash,
//                 firstName: "",
//                 lastName: "",
//                 jobRole: "",
//                 role: "user",
//                 videoGoal: "",
//                 approval: {
//                   isApproved: true,
//                   trxId: ''
//                 },
//                 accessType: {
//                   branding1: true,
//                   branding2: true,
//                   branding3: true,
//                   branding4: true,
//                   script: true,
//                   template: true,
//                   fullAccess: true
//                 },
//                 resetPassToken:"",

//               });




//               _user.save((error, data) => {
//                 if (error) {
//                   console.log(error);
//                   return res.status(400).json({
//                     error: "Something went wrong",
//                   });
//                 }

//                 if (data) {

//                   brandingarray.map(b=>{
//                     let _branding = new Branding({
//                       brandingName:b,
//                       ownerId:data._id
//                     })
//                     _branding.save()
//                     .then(br=>{
//                       if(b === 'branding1'){
//                         data.updateOne({$set:{"branding.branding1":br._id}})
//                         .then((b1)=>{
//                             return
//                         })
//                       }
//                       if(b === 'branding2'){
//                         data.updateOne({$set:{"branding.branding2":br._id}})
//                         .then((b2)=>{
//                           return
//                       })

//                       }
//                       if(b === 'branding3'){
//                         data.updateOne({$set:{"branding.branding3":br._id}})
//                         .then((b3)=>{
//                           return
//                       })
//                       }
//                       if(b === 'branding4'){
//                         data.updateOne({$set:{"branding.branding4":br._id}})
//                         .then((b4)=>{
//                           return
//                       })
//                       }


//                     })

//                   })




//                   const token = jwt.sign({ _id: data._id, role: data.role },process.env.JWT_SECRET,{expiresIn: "1d",});
//                   const {  _id, firstName, lastName, email, role, jobRole, videoGoal, profilePicture ,createdBy,approval,accessType,resetPassToken,branding } = data;
//                   //res.cookie("videoshare-token", token, { expiresIn: "1d" });

//                   transporter.sendMail({
//                     from: 'info.videoshare@gmail.com',
//                     to: email,
//                     subject: 'Account created',
//                     html:` <p>Account created successfully.Your email : ${email}, password:${password}</p>`,
//                   }, (err, info) => {
//                     console.log(info);
//                     //console.log(err);
//                     if(err){
//                       return res.status(400).json({error:"something went wrong"})
//                     }
//                     res.status(200).json({
//                       token: "Bearer " + token,
//                       user: {  _id, firstName, lastName, email, role, jobRole, videoGoal, profilePicture ,createdBy,approval,accessType,resetPassToken,branding },
//                     });
//                   });                 
//                 }
//               })



//             });

//           }
//         });
//       }
//     });
// };


// exports.forgotPassword=(req,res)=>{
//   const {email} = req.body
//   User.findOne({email})
//   .then(user=>{
//     if(!user){
//       return res.status(404).json({error:"No user found with this email"})
//     }
//     jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET_RESET_PASSWORD, {expiresIn: "20m"},(err,token)=>{
//       if(err){
//         return res.status(400).json({error:"something went wrong"})
//       }
//       User.findByIdAndUpdate(user._id,{$set:{resetPassToken:token}})
//       .then(usernext=>{
//         transporter.sendMail({
//           from: 'info.videoshare@gmail.com',
//           to: usernext.email,
//           subject: 'Reset Password',
//           html:` <p>Click this <a href="${process.env.CLIENT_URL}/resetpassword?token=${token}">Link</a> and follow the instruction. Token validity 20 minute</p>`,
//         }, (err, info) => {
//           console.log(info);
//           //console.log(err);
//           if(err){
//             return res.status(400).json({error:"something went wrong"})
//           }
//           return res.status(200).json({
//               success: true,
//               message: "email send succesfully",
//             });
//         });
//       })
//     });



//   })
// }
