const auth = require(`./routes/auth.route`)

const express = require(`express`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 8000

/** load library cors */
const cors = require(`cors`)

app.use(`/auth`, auth)

/** open CORS policy */
app.use(cors())

/** parse incoming JSON request body */
app.use(express.json())

/** define all routes */
const userRoute = require(`./routes/user.route`)
const diskonRoute = require(`./routes/diskon.route`)
const eventRoute = require(`./routes/event.route`)
const seatRoute = require(`./routes/seat.route`)
const ticketRoute = require(`./routes/ticket.route`) 

/** define prefix for each route */
app.use(`/user`, userRoute)
app.use(`/diskon`, diskonRoute)
app.use(`/event`, eventRoute)
app.use(`/seat`, seatRoute)
app.use(`/ticket`, ticketRoute)

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})