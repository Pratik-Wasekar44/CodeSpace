const axios = require("axios");
axios.post("https://wandbox.org/api/compile.json", { compiler: "nodejs-head", code: "console.log('hi');", save: false })
.then(res => console.log(res.data))
.catch(err => console.log("ERROR:", err.response?.data || err.message));
