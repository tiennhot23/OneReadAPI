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
f.upload_single = (file, path, name) => {
    return new Promise((resolve, reject) => {
        const blob = firebase.bucket.file(path + name + getFileType(file))
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
            resolve(getDonwloadURL(path + name + getFileType(file), uuid))
        })

        blobWriter.end(file.buffer)
    })
}


f.upload_multi = (files, path) => {
    return new Promise((resolve, reject) => {
        var urls = []
        files.forEach((file, index, array) => {
            var blob = firebase.bucket.file(path + file.originalname)
            let uuid = uuidv4()

            var blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            })

            blobWriter.on('error', (ignored) => {})

            blobWriter.on('finish', () => {
                urls.push(getDonwloadURL(path + file.originalname, uuid))
                if (index == array.length - 1) resolve(urls)
            })

            blobWriter.end(file.buffer)
            
        })

    })
}

f.upload_multi_with_index = (files, path) => {
    return new Promise((resolve, reject) => {
        var urls = []
        var count = 0

        if (!files || files.length == 0) {
            resolve(urls)
            return
        }

        files.forEach((file, index, array) => {
            var blob = firebase.bucket.file(path + index + getFileType(file))
            let uuid = uuidv4()

            var blobWriter = blob.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        firebaseStorageDownloadTokens: uuid
                    }
                }
            })

            blobWriter.on('error', (ignored) => {
                count += 1
                if (count == array.length) {
                    resolve(urls)
                }
            })

            blobWriter.on('finish', () => {
                urls.push(getDonwloadURL(path + index + getFileType(file), uuid))
                count += 1
                if (count == array.length) {
                    resolve(urls)
                }
            })

            blobWriter.end(file.buffer)
            
        })

    })
}


f.delete = (path) => {
    return new Promise((resolve, reject) => {
        const bucket = firebase.bucket
        bucket.deleteFiles({
            prefix: path
        }, err => {
            if (err){
                reject(err)
            } else {resolve(true)}
        })
    })
}

function getDonwloadURL(path, uuid) {
    return `https://firebasestorage.googleapis.com/v0/b/oneread-7583c.appspot.com/o/${encodeURIComponent(path)}?alt=media&token=${uuid}`
}

function getFileType(file) {
    return '.' + file.originalname.split('.').pop()
}
module.exports = f;