/** load model */
const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** create function for add new ticket */
exports.addTicket = async (request, response) => {
    /** prepare date for bookedDate */
    const today = new Date()
    const bookedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

    /** prepare data from request */
    const { eventID, userID, seats } = request.body;

    try {
        /** get event data first to know the ticket price */
        const eventData = await eventModel.findOne({ where: { eventID: eventID } })

        if (!eventData) {
            return response.status(404).json({
                success: false,
                message: `Event dengan ID ${eventID} tidak ditemukan`
            })
        }

        // Create seat records for the chosen seats
        const seatIDs = await Promise.all(seats.map(async seat => {
            const { rowNum, seatNum } = seat;
            const createdSeat = await seatModel.create({
                eventID,
                rowNum,
                seatNum,
                status: 'true'
            });
            return createdSeat.seatID;
        }));

        // Create ticket records associating the chosen seats
        const tickets = await ticketModel.bulkCreate(seatIDs.map(seatID => ({
            eventID,
            userID,
            seatID,
            bookedDate
        })));

        /** calculate total price to be paid: event price x number of seats booked */
        const totalPrice = eventData.price * seats.length

        response.status(201).json({
            success: true,
            data: tickets,
            totalPrice: totalPrice,
            message: `Ticket has been booked. Total payment: Rp${totalPrice}`
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** create function for read all data */
exports.getAllTicket = async (request, response) => {
    /** call findAll() to get all data */
    let tickets = await ticketModel.findAll(
        {
            include: [
                { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
                { model: userModel, attributes: ['firstName', 'lastName'] },
                { model: seatModel, attributes: ['rowNum', 'seatNum'] },
            ]
        }
    )
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })
}

/** create function for filter ticket by ID */
exports.ticketByID = async (request, response) => {
    /** define ticketID to find data */
    let ticketID = request.params.id

    /** call findAll() within where clause and operation
     * to find data based on ticketID  */
    let tickets = await ticketModel.findAll({
        where: {
            ticketID: { [Op.substring]: ticketID }
        },
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
            { model: userModel, attributes: ['firstName', 'lastName', 'email'] },
            { model: seatModel, attributes: ['rowNum', 'seatNum'] },
        ]
    })
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })
}

/** create function for user to see tickets by userID (with ownership validation) */
exports.getTicketsByUserID = async (request, response) => {
    /** id from URL parameter */
    let requestedID = request.params.id

    /** identity from decoded token (set by authorize middleware) */
    let loggedInID = request.user.userID
    let loggedInRole = request.user.role

    /** only allow if the requested id matches the logged-in user,
     * or if the logged-in user is an admin */
    if (requestedID != loggedInID && loggedInRole !== `admin`) {
        return response.status(403).json({
            success: false,
            message: `Forbidden! You can only see your own tickets`
        })
    }

    let tickets = await ticketModel.findAll({
        where: { userID: requestedID },
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
            { model: userModel, attributes: ['firstName', 'lastName'] },
            { model: seatModel, attributes: ['rowNum', 'seatNum'] },
        ]
    })

    return response.json({
        success: true,
        data: tickets,
        message: `Tickets have been loaded`
    })
}

/** create function for logged-in user to see their own tickets */
exports.getMyTickets = async (request, response) => {
    /** get userID directly from decoded token (set by authorize middleware) */
    let userID = request.user.userID

    let tickets = await ticketModel.findAll({
        where: { userID: userID },
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
            { model: userModel, attributes: ['firstName', 'lastName'] },
            { model: seatModel, attributes: ['rowNum', 'seatNum'] },
        ]
    })

    return response.json({
        success: true,
        data: tickets,
        message: `Your tickets have been loaded`
    })
}

/** create function to delete ticket by ticketID */
exports.deleteTicket = async (request, response) => {
    /** define id ticket that will be deleted */
    let ticketID = request.params.id

    const ticket = await ticketModel.findOne({ where: { ticketID: ticketID } })

    if (!ticket) {
        return response.status(404).json({
            success: false,
            message: `Ticket dengan ID ${ticketID} tidak ditemukan`
        })
    }

    /** execute delete data based on defined id ticket */
    ticketModel.destroy({ where: { ticketID: ticketID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Ticket has been deleted`
            })
        })
        .catch(error => {
            return response.status(500).json({ success: false, message: error.message })
        })
}

/** create function for user to cancel their own ticket purchase (admin can cancel any ticket) */
exports.cancelTicket = async (request, response) => {
    /** ticketID from URL parameter */
    let ticketID = request.params.id

    /** identity from decoded token (set by authorize middleware) */
    let loggedInID = request.user.userID
    let loggedInRole = request.user.role

    try {
        const ticket = await ticketModel.findOne({ where: { ticketID: ticketID } })

        if (!ticket) {
            return response.status(404).json({
                success: false,
                message: `Ticket dengan ID ${ticketID} tidak ditemukan`
            })
        }

        /** only allow if the ticket belongs to the logged-in user,
         * or if the logged-in user is an admin */
        if (ticket.userID != loggedInID && loggedInRole !== `admin`) {
            return response.status(403).json({
                success: false,
                message: `Forbidden! You can only cancel your own ticket`
            })
        }

        /** return the seat back to available (empty) status */
        await seatModel.update(
            { status: false },
            { where: { seatID: ticket.seatID } }
        )

        /** remove the ticket record */
        await ticketModel.destroy({ where: { ticketID: ticketID } })

        return response.json({
            success: true,
            message: `Ticket has been cancelled and the seat is now available again`
        })
    } catch (error) {
        return response.status(500).json({ success: false, message: error.message })
    }
}