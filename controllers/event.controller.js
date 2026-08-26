/** load model for `events` table */
const eventModel = require(`../models/index`).event

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** load library 'path' and 'filestream' */
const path = require(`path`)
const fs = require(`fs`)

/** load function from `upload-image` */
const upload = require(`./upload-image`).single(`image`)

/** create function for read all data */
exports.getAllEvent = async (request, response) => {
  try {
    let events = await eventModel.findAll()
    return response.json({
      success: true,
      data: events,
      message: `All Events have been loaded`
    })
  } catch (error) {
    return response.status(500).json({ success: false, message: error.message })
  }
}

/** create function for filter */
exports.findEvent = async (request, response) => {
  let keyword = request.params.key
  let events = await eventModel.findAll({
    where: {
      [Op.or]: [
        { eventName: { [Op.substring]: keyword } },
        { eventDate: { [Op.substring]: keyword } },
        { venue: { [Op.substring]: keyword } },
        { price: { [Op.substring]: keyword } }
      ]
    }
  })
  return response.json({
    success: true,
    data: events,
    message: `All Events have been loaded`
  })
}

/** create function to add new event */
exports.addEvent = (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.status(400).json({ success: false, message: error })
    }

    if (!request.file) {
      return response.json({ message: `Nothing to Upload` })
    }

    let newEvent = {
      eventName: request.body.eventName,
      eventDate: request.body.eventDate,
      venue: request.body.venue,
      price: request.body.price,
      image: request.file.filename
    }

    eventModel.create(newEvent)
      .then(result => {
        return response.json({
          success: true,
          data: result,
          message: `New event has been inserted`
        })
      })
      .catch(error => {
        return response.status(500).json({ success: false, message: error.message })
      })
  })
}

/** create function to update event */
exports.updateEvent = async (request, response) => {
  upload(request, response, async error => {
    if (error) {
      return response.status(400).json({ success: false, message: error })
    }

    let eventID = request.params.id
    let dataEvent = {
      eventName: request.body.eventName,
      eventDate: request.body.eventDate,
      venue: request.body.venue,
      price: request.body.price,
    }

    const selectedEvent = await eventModel.findOne({ where: { eventID: eventID } })

    if (!selectedEvent) {
      return response.status(404).json({ success: false, message: `Event dengan ID ${eventID} tidak ditemukan` })
    }

    if (request.file) {
      const oldImage = selectedEvent.image

      if (oldImage) {
        const pathImage = path.join(__dirname, `../image`, oldImage)
        if (fs.existsSync(pathImage)) {
          fs.unlink(pathImage, error => console.log(error))
        }
      }

      dataEvent.image = request.file.filename
    }

    eventModel.update(dataEvent, { where: { eventID: eventID } })
      .then(result => {
        return response.json({ success: true, message: `Data event has been updated` })
      })
      .catch(error => {
        return response.status(500).json({ success: false, message: error.message })
      })
  })
}

/** create function to delete event */
exports.deleteEvent = async (request, response) => {
  const eventID = request.params.id
  const event = await eventModel.findOne({ where: { eventID: eventID } })

  if (!event) {
    return response.status(404).json({ success: false, message: `Event dengan ID ${eventID} tidak ditemukan` })
  }

  const oldImage = event.image
  if (oldImage) {
    const pathImage = path.join(__dirname, `../image`, oldImage)
    if (fs.existsSync(pathImage)) {
      fs.unlink(pathImage, error => console.log(error))
    }
  }

  eventModel.destroy({ where: { eventID: eventID } })
    .then(result => {
      return response.json({ success: true, message: `Data event has been deleted` })
    })
    .catch(error => {
      return response.status(500).json({ success: false, message: error.message })
    })
}