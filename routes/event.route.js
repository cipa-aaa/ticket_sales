/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load event's controller */
const eventController = require(`../controllers/event.controller`)

/** create route to get data with method "GET" */
app.get("/", eventController.getAllEvent)

/** create route to get best selling events based on total tickets sold
 * this route must be placed BEFORE "/:key" route,
 * otherwise Express will treat "best-selling" as the ":key" parameter */
app.get("/best-selling", authorize, eventController.getBestSellingEvents)

/** create route to find event
 * using method "GET" and define parameter key for "keyword" */
app.get("/:key", eventController.findEvent)

/** create route to add new event using method "POST" */
app.post("/", eventController.addEvent)

/** create route to update event
 * using method "PUT" and define parameter for "id" */
app.put("/:id", eventController.updateEvent)

/** create route to delete event
 * using method "DELETE" and define parameter for "id" */
app.delete("/:id", eventController.deleteEvent)

/** export app in order to load in another file */
module.exports = app