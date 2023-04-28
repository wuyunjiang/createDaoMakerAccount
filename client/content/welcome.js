const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
window.onload = async function () {
  let successTar;
  do {
    successTar = document.querySelector("h2.body");
    await sleep(500);
  } while (!successTar);
  if (
    successTar.innerText ===
    "Your account is now created. Please proceed to Login."
  ) {
    const arr = JSON.parse(window.localStorage.getItem("successArr") || "[]");
    arr.push(window.location.search);
    window.localStorage.setItem("successArr", JSON.stringify(arr));
  }
  await sleep(1000);
  window.close();
};
