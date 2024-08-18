const express = require("express");
const router = express.Router();
const SignIn = require("../schema/logInSchema");
const Contact = require("../schema/contactSchema");
const Food = require("../schema/foodSchema");
const bcrypt = require("bcrypt");

// Registration LogIn API
// its for / page routing
router.post("/registration", async (req, res) => {
  try {
    const { name, phone, email, password, cpassword } = req.body;
    console.log(req.body);

    if (!name || !phone || !email || !password || !cpassword) {
      return res.status(422).json({ err: "Please fill in all fields" });
    }
    const userExist = await SignIn.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ err: "Email already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ err: "Password are not Matching" });
    } else {
      const user = new SignIn({ name, phone, email, password, cpassword });
      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to register" });
  }
});

// its for Login page routing
router.post("/LogIn", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ err: "Fill in all fields" });
    }

    const userLogin = await SignIn.findOne({ email: email });
    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),

        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ message: "Invalid Credentials (Password)" });
      } else {
        console.log(userLogin);
        res.status(201).json({ message: "User logged in successfully" });
      }
    } else {
      res.status(400).json({ message: "Invalid Credentials (Email)" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to log in" });
  }
});
// End of Registrtion Login API

// Contact API
// post api
router.post("/contact", async (req, res) => {
  try {
    const newItem = new Contact(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create item" });
  }
});
// end of post api
// start of get all messages api
router.get("/getMessage", async (req, res) => {
  try {
    const message = await Contact.find();
    if (!message) {
      return res.status(404).json({ msg: "message not available" });
    } else {
      res.status(200).json(message);
    }
  } catch (err) {
    res.status(400).json({ msg: "Server Error" });
  }
});
// start of get all messages api
// open the message to get api
router.get("/getOneMessage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const oneMessage = await Contact.findById(id);
    if (!oneMessage) {
      return res.status(400).json({ msg: "Message not found" });
    } else {
      res.status(200).json(oneMessage);
    }
  } catch (error) {
    res.status(400).json({ msg: "Server Error" });
  }
});
// end of the open the message to get api
// delete message api in contact
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteOne = await Contact.findByIdAndDelete(id);
    if (!deleteOne) {
      return res.status(400).json({ msg: "Message not found" });
    } else {
      res.status(200).json({ msg: "user deleted successfully" });
    }
  } catch (error) {
    res.status(400).json({ msg: "Server Error" });
  }
});
//end of  delete message api in contact
// end of Contact api's

// Starting the food contact api's
// first post api in food contact
router.post("/food", async (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      name,
      phoneNumber,
      foodKG,
      collectOrDeliver,
      deliveryAddress,
    } = req.body;

    if (
      !organizationName ||
      !organizationType ||
      !name ||
      !phoneNumber ||
      !foodKG
    ) {
      return res.status(422).json({ err: "Please fill in all fields" });
    } else {
      const food = new Food({
        organizationName,
        organizationType,
        name,
        phoneNumber,
        foodKG,
        collectOrDeliver,
        deliveryAddress,
      });
      console.log(food);

      await food.save();
      res.status(201).json({ message: "Send Succesfully" });
    }
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: "Failed to Send" });
  }
});
// end of food post data
// get data of food contact api
router.get("/getfood", async (req, res) => {
  try {
    const getFood = await Food.find();
    if (!getFood) {
      res.status(400).json({ msg: "data not found" });
    } else {
      res.status(200).json(getFood);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// end of all data get request api
router.get("/FoodOneMessage/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getOne = await Food.findById(id);

    if (!getOne) {
      return res.status(400).json({ msg: "data not found" });
    } else {
      res.status(200).json(getOne);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// end of one message api
// delete api for food contact
router.delete("/deleteFood/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteMessage = await Food.findByIdAndDelete(id);
    if (!deleteMessage) {
      res.status(400).json({ msg: "message not found" });
    } else {
      res.status(200).json({ msg: "deleted succesfully" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// delete api for food message complete

module.exports = router;
