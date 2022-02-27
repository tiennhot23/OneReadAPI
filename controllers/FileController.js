const multer = require('multer')

/**
 * use to generate accesstoken to get permisstion
 * it need when security rules of bucket is set auth like:
 *      ....
 *      match /b/{bucket}/o {
            match /{allPaths=**} {
            allow read, write, delete: if request.auth != null
            }
        }
        ....
    but this bucket set rule allow for all so i generate token for fun :D
 */
const { v4: uuidv4 } = require('uuid')
const firebase = require('../storage/firebase')

const f = {}

/**
 * 
 * @param {file} file 
 * @param {string} path : example 'avatar/'
 * @returns 
 */
f.upload_single = (file, path) => {
    return new Promise((resolve, reject) => {
        const blob = firebase.bucket.file(path + file.originalname)
        let uuid = uuidv4()

        const blobWriter = blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: uuid
                }
            }
        })

        blobWriter.on('error', (err) => {
            reject(err)
        })

        blobWriter.on('finish', () => {
            resolve(getDonwloadURL(path + file.originalname, uuid))
        })

        blobWriter.end(file.buffer)
    })
}



function getDonwloadURL(path, uuid) {
    return `https://firebasestorage.googleapis.com/v0/b/oneread-7583c.appspot.com/o/${encodeURIComponent(path)}?alt=media&token=${uuid}`
}
module.exports = f;