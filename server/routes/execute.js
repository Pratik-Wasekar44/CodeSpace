const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { language, sourceCode } = req.body;
        
        // Map our language to Wandbox compiler names
        const langMap = {
            "javascript": "nodejs-20.17.0",
            "python": "cpython-3.12.7",
            "c": "gcc-head-c",
            "cpp": "gcc-head",
            "java": "openjdk-jdk-22+36"
        };
        const compilerVal = langMap[language] || langMap["javascript"];

        const response = await axios.post("https://wandbox.org/api/compile.json", {
            compiler: compilerVal,
            code: sourceCode,
            save: false
        });

        const data = response.data;
        // Wandbox sends stdout and stderr as separate keys
        const output = data.program_output || data.compiler_output || data.program_message || data.compiler_message || "";
        const compileErr = data.compiler_error || "";
        
        if (data.status !== "0" && !output) {
            res.json({ error: compileErr || "Execution failed without output." });
        } else {
            res.json({ run: { output: compileErr ? compileErr + '\n' + output : output }, compile: { output: "" } });
        }
    } catch (err) {
        console.error("Execution error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
