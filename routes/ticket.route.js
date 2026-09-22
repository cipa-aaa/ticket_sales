/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()
app.use(express.json())

/** load function from auth-controller */
const { authorize } = require('../controllers/auth.controller')

/** load ticket's controller */
const ticketController = require(`../controllers/ticket.controller`)

/** create route to add new ticket using method "POST" */
app.post("/", ticketController.addTicket)

/** create route to get data with method "GET" */
app.get("/", ticketController.getAllTicket)

/** create route to get tickets by user id (with ownership validation)
 * must be placed BEFORE "/:id" route, otherwise Express will treat
 * "user" as the ":id" parameter */
app.get("/user/:id", authorize, ticketController.getTicketsByUserID)

/** create route for logged-in user to see their own tickets
 * must be placed BEFORE "/:id" route, otherwise Express will treat
 * "my-tickets" as the ":id" parameter */
app.get("/my-tickets", authorize, ticketController.getMyTickets)

/** create route to get data by id with method "GET" */
app.get("/:id", ticketController.ticketByID)

/** create route to delete ticket by id */
app.delete("/:id", authorize, ticketController.deleteTicket)

/** create route to cancel a ticket purchase (with ownership validation) */
app.put("/cancel/:id", authorize, ticketController.cancelTicket)

/** export app in order to load in another file */
module.exports = app