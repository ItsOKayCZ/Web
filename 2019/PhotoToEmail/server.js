// Node.js modules
const express = require("express");
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const mailer = require("nodemailer");
const fs = require("fs");

// Server settings
const PORT = 8080
const cookie = "defaultValue"
const smtpServer = "smtp.gmail.com"
const smtpServerPort = 465

app.use(bodyParser.urlencoded({ limit: "3gb", extended: true }));
app.use(bodyParser.json({ limit: "3gb", extended: true }));
app.use(cookieParser());

const router = express.Router()
router.use(function(req, res, next){

  if(req.url == "/" + cookie){

    res.cookie("auth", cookie, {maxAge: 50 * 365 * 24 * 60 * 60 * 1000});
    console.log("[#] Cookie set {" + req.ip + "}");
    res.redirect("/");
    return;

  } else if(req.cookies.auth != cookie){
    console.log("[!!] Unauthorized access {" + req.ip + "}");
    res.send("Unauthorized");
    return;
  }

  next();
});

app.use("/", router);

app.use(express.static("static"))

app.use("/sendEmail", function(req, res){
  console.log("Got request to /sendEmail {" + req.ip + "}");

  var details = fs.readFileSync("credentials.txt").toString().split(",");

  var email = details[0];
  var password = details[1];

  var targetEmail = details[2];

  var image = req.body.image.split(" ").join("+");

  var server = mailer.createTransport({
    host: smtpServer,
    port: smtpServerPort,
    secure: true,
    auth: {
      user: email,
      pass: password
    }
  });

  var mailOptions = {
    from: email,
    to: targetEmail,
    subject: "Subject text",
    text: "Text text",
    attachments: [
      {
        filename: "image.png",
        content: image,
        encoding: "base64",
        contentType: "image/png"
      }
    ]
  };

  console.log("Sending email {" + req.ip + "}");
  server.sendMail(mailOptions, function(error, info){
    if(error){
      res.send("An error occured");
      throw error;
    }

    console.log("Email sent {" + req.ip + "}");
    res.send("Photo sent");
  });
});

// Starting server
app.listen(PORT, function(){
  console.log("Listening on port 127.0.0.1:" + PORT);
});
