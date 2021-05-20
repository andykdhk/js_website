/*nodemailer.js */
//purpose: send email when change pw

/* structs */
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "mail.YOURDOMAIN.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "YOUREMAIL", // generated ethereal user
    pass: "YOURPASSWORD", // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// setup email data with unicode symbols
let mailOptions = {
  from: '"Nodemailer Contact" <your@email.com>', // sender address
  to: "RECEIVEREMAILS", // list of receivers
  subject: "Node Contact Request", // Subject line
  text: "Hello world?", // plain text body
  html: output, // html body
};

/* function */
// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render("contact", { msg: "Email has been sent" });
});
