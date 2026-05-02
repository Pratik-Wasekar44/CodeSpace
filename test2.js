const axios = require("axios");
axios.get("https://wandbox.org/api/list.json")
.then(res => {
    const compilers = res.data;
    const js = compilers.find(c => c.language === "JavaScript" || c.name.includes("node")).name;
    const py = compilers.find(c => c.language === "Python" && c.name.includes("cpython")).name;
    const c = compilers.find(c => c.language === "C" && c.name.includes("gcc")).name;
    const cpp = compilers.find(c => c.language === "C++" && c.name.includes("gcc")).name;
    const java = compilers.find(c => c.language === "Java" && c.name.includes("openjdk")).name;
    console.log(JSON.stringify({ js, py, c, cpp, java }));
})
.catch(err => console.log(err.message));
