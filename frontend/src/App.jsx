import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCompress = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.post("http://localhost:5000/compress", formData, {
        responseType: "blob",           // Important for file download
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `compressed-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert("✅ PDF Compressed Successfully!");

    } catch (error) {
      console.error(error);
      alert("❌ Error compressing PDF: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>PDF Compressor update</h1>

        <p className="subtitle">
          Upload and compress your PDF files easily
        </p>

        <div className="upload-box">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="file-info">
            Selected File: <span>{file.name}</span>
          </div>
        )}

        <button onClick={handleCompress} disabled={loading || !file}>
          {loading ? "Compressing..." : "Compress PDF"}
        </button>
      </div>
    </div>
  );
}

export default App;