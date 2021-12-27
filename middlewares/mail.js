var nodemailer = require('nodemailer')

const mail = {}

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testmail24681357@gmail.com',
    pass: 'testmail2468'
  }
})

mail.sendVerification = (email, link)=>{
  var options = {
      from: 'OneRead',
      to: email,
      subject: 'Verification',
      text: 'Vui lòng click vào link dưới để tiếp tục\n' + link,
  }
  transporter.sendMail(options)
}

module.exports = mail