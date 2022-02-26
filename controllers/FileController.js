const multer = require('multer')
const firebase = require('../storage/firebase')

const f = {}

/**
 * 
 * @param {file} file 
 * @param {string} path : example 'avatar/'
 * @returns 
 */
f.upload = (file, path) => {
    return new Promise((resolve, reject) => {
        const blob = firebase.bucket.file(path + file.originalname)

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        })

        blobWriter.on('error', (err) => {
            reject(err)
        })

        blobWriter.on('finish', () => {
            resolve(getDonwloadURL(path + file.originalname))
        })

        blobWriter.end(file.buffer)
    })
}


function getDonwloadURL(path) {
    return `https://firebasestorage.googleapis.com/v0/b/oneread-7583c.appspot.com/o/${encodeURIComponent(path)}?alt=media`
}
module.exports = f;