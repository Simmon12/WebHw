var http = require('http');
var url = require('url');
var querystring = require('querystring');
var validator = require('./validator');
var users = {};
var pug = require('pug');
var fs = require('fs');

// 创建web服务器
http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    console.log("pathname ", pathname, " <br/>");
    console.log("url ", req.url);
    switch(req.url) {
        case '/validator.js':
          sendFile(res, 'validator.js' , 'text/javascript');
          break;
        case '/signup.js':
          sendFile(res, 'signup.js', 'text/javascript');
          break;
        case '/style.css':
          sendFile(res, 'style.css', 'text/css');
          break;
        default:
         req.method === 'POST' ? registerUser(req, res) : sendHTML(req, res);
    }
}).listen(8124);

console.log("Signup server is listening at 8124");

function sendFile(res, file, mine) {
   res.writeHead(200, "Content-Type:"+ mine);
   res.end(fs.readFileSync(file));
}

function registerUser(req, res) {
   var message = "";
   req.on('data', function(chunk) {
     message += chunk;
   })
   req.on('end', function() {
    try {
      var user = querystring.parse(message);
      check(user);
      users[user.username] = user;
      res.writeHead(301, {Location: '?username='+user.username});
      console.log("user ", user);
      res.end();
    } catch (error){
      console.warn("regist error: ", error);
      showSignup(res, user, error.message);
    }

   })
}

function check(user) {
  var errorMessages = [];
  for(var key in user) {
     // 格式校验
     if(!validator.isFieldValid(key, user[key])) {
         errorMessages.push(validator.form[key].errorMessage);
     }
     // 唯一性校验
     if(!validator.isAttrValueUnique(users, user, key)) {
       errorMessages.push("keys:" + key + " is not unique by value: " + user[key]);
     }
  }
  if(errorMessages.length > 0) {
    throw new Error(errorMessages.join("<br/>"));
  }
}

// 第一步 服务器向客户端发送HTML
function sendHTML(req, res) {
   var username = parseUsername(req);
   if(!username || !isRegistedUsername(username)) {
      showSignup(res, {username: username}, null);
   } else {
      showDetail(res, users[username]);
   }
}

function parseUsername(req) {
   return querystring.parse(url.parse(req.url).query).username;
}

function isRegistedUsername(username) {
    if(users[username])
        return true;
    else
        return false;

}

function showSignup(res, user, error) {
   showHtml(res, 'signup.pug', {user: user, error: error});
}

function showDetail(res, user)
{
   showHtml(res, 'detail.pug', user);
   console.log("detail");
}

// 减少代码冗余
function showHtml(res, template, data)
{
   res.writeHead(200, {"Content-Type": "text/html"});
   res.end(pug.renderFile(template, data));
}
