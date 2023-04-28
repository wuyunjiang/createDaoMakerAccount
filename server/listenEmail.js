const imap = require("imap");
const http = require("http");
const url = require("url");
const qqEmail = ""; // 你的QQ邮箱账号
const qqKey = ""; // 你的QQ邮箱授权码

const MailParser = require("mailparser").MailParser;
const needVerifyUsers = {};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (req.method === "GET") {
    if (parsedUrl.pathname === "/getVerifyUrl") {
      res.statusCode = 200;
      console.log("needVerifyUsers", needVerifyUsers);
      const firstUser = Object.entries(needVerifyUsers)[0];
      if (firstUser) {
        delete needVerifyUsers[firstUser[0]];
        res.end(JSON.stringify({ verifyUrl: firstUser[1] }));
      } else {
        res.end("{}");
      }
    }
  }
});
const port = 3265;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

const client = new imap({
  user: qqEmail,
  password: qqKey,
  host: "imap.qq.com",
  port: 993,
  tls: true,
});

function openInbox(cb) {
  client.openBox("INBOX", false, cb);
}
function getNewEmail() {
  client.search(
    ["UNSEEN", ["FROM", "no-reply@daomaker.com"]],
    (err, results) => {
      if (err) return;
      if (results.length === 0) return;
      const fetchOptions = {
        bodies: "",
        struct: true,
        markSeen: true,
      };
      const fetch = client.fetch(results, fetchOptions);
      client.setFlags(results, ["\\SEEN"], () => {});
      fetch.on("message", function (msg) {
        var mailparser = new MailParser();
        msg.on("body", function (stream) {
          stream.pipe(mailparser);
          mailparser.on("data", function (data) {
            if (data.type === "text") {
              if (!data.text) return;
              let user = data.text.substring(0, data.text.indexOf(",\n\n"));
              user = user.substring(user.indexOf("Hi ") + 3);
              let verifyUrl = data.text.substring(
                0,
                data.text.lastIndexOf("\n\n")
              );
              verifyUrl = verifyUrl.substring(
                verifyUrl.lastIndexOf("\n\n") + 2
              );
              if (verifyUrl && user) {
                needVerifyUsers[user] = verifyUrl;
              }
            }
          });
        });
        msg.once("end", function () {});
      });
      fetch.once("error", function (err) {
        console.log("抓取出现错误: " + err);
      });
      fetch.once("end", function () {});
    }
  );
}

client.once("ready", () => {
  openInbox(() => {
    setInterval(() => {
      getNewEmail();
    }, 1000);
  });
});

client.once("error", function (err) {
  console.log(err);
});

client.once("end", function () {
  console.log("关闭邮箱");
});

client.connect();
