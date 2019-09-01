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

var cred = fs.readFileSync("credentials.txt").toString().split("\n");

const sendEmailOnError = false;
const adminEmail = ""


app.use(bodyParser.urlencoded({ limit: "3gb", extended: false }));
app.use(bodyParser.json({ limit: "3gb", extended: false }));
app.use(cookieParser());

const router = express.Router()
router.use(function(req, res, next){

  if(req.url.split("?")[0] == "/" + cookie){

    var clientId = req.query.id;
    if(clientId >= cred.length){
      res.send("<h1>Wrong url. Please try again</h1>");
      console.log("Bad url. Doesnt have id");
      return;
    }

    res.cookie("auth", cookie, {maxAge: 50 * 365 * 24 * 60 * 60 * 1000});
    console.log("[#] Cookie set {" + req.ip + "}");

    res.cookie("id", clientId, {maxAge: 50 * 365 * 24 * 60 * 60 * 1000});
    console.log("[#] Client id set: " + clientId + " {" + req.ip + "}");

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

  var id = req.cookies.id;

  var details = cred[id].split(",");

  var email = details[0];
  var password = details[1];
  var name = details[3];

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
    subject: "Phototoemail - From: " + name,
    attachments: [
      {
        filename: "image.png",
        content: image,
        encoding: "base64",
        contentType: "image/png"
      }
    ]
  };

  console.log("Sending email from " + email + " to " + targetEmail + " {" + req.ip + "}");
  server.sendMail(mailOptions, function(error, info){
    if(error){
      res.send("An error occured");
      console.log(error);

      if(sendEmailOnError == true){
        sendEmailToAdmin(error, id);
      }

      return;
    }

    console.log(info);
    console.log("Email sent {" + req.ip + "}");
    res.send("Photo sent");
  });
});

// Starting server
app.listen(PORT, function(){
  console.log("Listening on port 127.0.0.1:" + PORT);
});

function sendEmailToAdmin(error, id){

  var details = cred[id].split(",");

  var email = details[0];
  var password = details[1];

  var name = details[3]

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
    to: adminEmail,
    subject: "Phototoemail - Error",
    text: error + "\n" + name
  };

  server.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }

    console.log("Email sent to admin");
  });
}