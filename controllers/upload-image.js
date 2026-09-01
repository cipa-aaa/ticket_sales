/** load library 'multer' and 'path' */
const multer = require(`multer`)
const path = require(`path`)

/** storage configuration */
const storage = multer.diskStorage({
  /** define storage folder */
  destination: (req, file, cb) => {
    cb(null, `./image`)
  },
  /** define filename for upload file */
  filename: (req, file, cb) => {
    cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  /** storage configuration */
  storage: storage,
  /** filter uploaded file */
  fileFilter: (req, file, cb) => {
    /** filter type of file berdasarkan extension DAN mimetype */
    const acceptedExt = /\.(jpg|jpeg|png)$/i
    const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]

    const extValid = acceptedExt.test(path.extname(file.originalname))
    const mimeValid = acceptedType.includes(file.mimetype)

    /** terima file jika ekstensi ATAU mimetype-nya valid */
    if (!extValid && !mimeValid) {
      cb(null, false) /** refuse upload */
      return cb(`Invalid file type (${file.mimetype})`)
    }

    /** filter size of file */
    const fileSize = req.headers[`content-length`]
    const maxSize = (1 * 1024 * 1024) /** max: 1MB */
    if (fileSize > maxSize) {
      cb(null, false) /** refuse upload */
      return cb(`File size is too large`)
    }

    cb(null, true) /** accept upload */
  }
})

module.exports = upload