const axios = require("axios");
axios.post("https://wandbox.org/api/compile.json", { compiler: "cpython-head", code: "print('hello')", save: false })
.then(res => console.log(res.data))
.catch(err => console.log("ERROR:", err.response?.data || err.message));
