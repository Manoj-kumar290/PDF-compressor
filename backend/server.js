const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

// Ensure folders exist
const uploadDir = "uploads";
const compressedDir = "compressed";

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(compressedDir)) fs.mkdirSync(compressedDir, { recursive: true });

// Multer Setup
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

app.post("/compress", upload.single("pdf"), (req, res) => {
    
    if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const inputPath = req.file.path;
    const outputPath = path.join(compressedDir, `compressed-${Date.now()}.pdf`);

    const command = `gswin64c -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${outputPath}" "${inputPath}"`;

    exec(command, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: "PDF Compression Failed" });
        }

        // Send file for download
        res.download(outputPath, (err) => {
            if (err) console.error("Download error:", err);

            // Cleanup files after download attempt
            try {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            } catch (cleanupErr) {
                console.error("Cleanup error:", cleanupErr);
            }
        });
    });
});

app.listen(5000, () => {
    console.log("✅ PDF Compressor Server running on http://localhost:5000");
});