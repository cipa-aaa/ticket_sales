/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()
app.use(express.json())

/** load ticket's controller */
const ticketController = require(`../controllers/ticket.controller`)

/** create route to add new ticket using method "POST" */
app.post("/", ticketController.addTicket)

/** create route to get data with method "GET" */
app.get("/", ticketController.getAllTicket)

/** create route to get data by id with method "GET" */
app.get("/:id", ticketController.ticketByID)

/** export app in order to load in another file */
module.exports = app