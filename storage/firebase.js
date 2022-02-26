const admin = require('firebase-admin')
const firebaseServiceKey = require('../firebaseServiceKey.json')

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceKey),
  storageBucket: 'oneread-7583c.appspot.com'
})
// Cloud storage
const bucket = admin.storage().bucket()

module.exports = {
  bucket
}
