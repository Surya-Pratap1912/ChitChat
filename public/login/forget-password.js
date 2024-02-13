const form = document.getElementById("myform");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mail = document.getElementById("mailId").value;
  axios
    .post("http://54.226.18.204:10000/password/forget-password", { mail })
    .then((res) => {
      console.log("res.data from forget pass ", res.data);
      alert(res.data.message);
      location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});
