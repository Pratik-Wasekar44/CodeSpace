const axios = require("axios");
axios.get("https://wandbox.org/api/list.json")
.then(res => {
    const compilers = res.data;
    const pyCompilers = compilers.filter(c => c.language === "Python").map(c => c.name);
    console.log("Python compilers:", pyCompilers);
})
.catch(err => console.log(err.message));
