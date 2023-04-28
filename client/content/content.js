const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pwd = "**BaiDing**"; // 修改成你的DaoMaker账号密码

function startSignUp(arr) {
  window.localStorage.setItem("emailArr", JSON.stringify(arr));
  window.location.href = "https://daomaker.com/register";
}
window.startSignUp = startSignUp;

window.onload = async function () {
  await listeningNeedCreateEmail();
  async function listeningNeedCreateEmail() {
    let targetEmail = "";
    let emailArr;
    do {
      emailArr = JSON.parse(window.localStorage.getItem("emailArr") || "[]");
      await sleep(500);
    } while (!emailArr.length);
    targetEmail = emailArr[0];
    document.querySelector("#email").focus();
    chrome?.runtime?.sendMessage({
      type: "inputLabel",
      msg: targetEmail,
    });
    let value = "";
    do {
      value = document.querySelector("#email").value;
      await sleep(100);
    } while (targetEmail !== value);
    document.querySelector("#password").focus();
    chrome?.runtime?.sendMessage({
      type: "inputLabel",
      msg: pwd,
    });
    let pwdValue = "";
    do {
      pwdValue = document.querySelector("#password").value;
      await sleep(100);
    } while (pwd !== pwdValue);
    document.querySelector("#terms").click();
    document.querySelector(".form-action button").click();

    let tarEmail = "";
    let err = "";
    do {
      tarEmail = document.querySelector(".form_subheader span")?.innerText;
      err = document.querySelector(".invalid-error");
      await sleep(500);
    } while (!tarEmail && !err);
    window.localStorage.setItem("emailArr", JSON.stringify(emailArr.slice(1)));
    await sleep(1000);
    window.location.href = "https://daomaker.com/register";
  }
};
