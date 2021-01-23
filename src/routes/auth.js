const express = require("express");
const {
  signup,
  signin,
  verify,
  editprofileimage,
  editPersonalInformation,
  editNID,
  editPassword,
  editEmail
} = require("../controller/auth");
const { requireSignin } = require("../common-middleware");

const upload = require("../common-middleware/imageUpload");
const router = express.Router();

router.post("/register", signup);
router.post("/login", signin);
router.post("/verify", verify);
router.patch(
  "/editpersonalinformation",
  requireSignin,
  editPersonalInformation
);
// router.post("/confirmpwd", requireSignin, confirmpwd);
router.patch("/editpassword", requireSignin, editPassword);
router.patch("/editemail", requireSignin, editEmail);
router.put(
  "/editprofileimage",
  requireSignin,
  upload.single("profilePicture"),
  editprofileimage
);

router.put("/editnid",
  requireSignin,
  upload.fields([
    {
      name: "front",
      maxCount: 1,
    },
    {
      name: "back",
      maxCount: 1,
    },
  ]),
  editNID
);

// router.post("/auth/google", googleAuth);
// router.post("/forgotpassword",validateEditEmailRequest,isRequestValidated,forgotPassword)



// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router;
