/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load function from role-validation */
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

/** load function from simple-middleware */
const { midOne } = require("../middlewares/simple-middleware")

/** load function from user-validation */
const { validateUser } = require("../middlewares/user-validation")

/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load user's controller */
const userController = require(`../controllers/user.controller`)

/** create route to get data with method "GET" */
app.get("/", [midOne], authorize, IsAdmin, userController.getAllUser)

/** create route for user to see their own profile
 * this route must be placed BEFORE "/:key" route,
 * otherwise Express will treat "profile" as the ":key" parameter */
app.get("/profile", authorize, userController.getProfile)

/** create route to find user
 * using method "GET" and define parameter "key" for keyword */
app.get("/:key", authorize, IsAdmin, userController.findUser)

/** create route to add new user using method "POST" */
app.post("/", authorize, IsAdmin, validateUser, userController.addUser)

/** create route to update user 
 * using method "PUT" and define parameter for "id" */
app.put("/:id", authorize, IsUser, validateUser, userController.updateUser)

/** create route to delete user 
 * using method "DELETE" and define parameter for "id" */
app.delete("/:id", authorize, IsAdmin, userController.deleteUser)

/** create route to reset password user */
app.put("/:id/reset-password", authorize, userController.resetPassword)

/** export app in order to load in another file */
module.exports = app