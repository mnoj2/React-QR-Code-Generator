import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload, FiCopy, FiSun, FiMoon } from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = "qrcode.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded!");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied to clipboard!");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Toaster position="top-center" />
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-5 right-5 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? <FiSun /> : <FiMoon />}
      </button>
      <div className={`rounded-3xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
        <h1 className="text-3xl md:text-4xl font-semibold mb-2 text-center">QR Code Generator</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">Create sleek QR codes for your links or text instantly.</p>
        <input
          type="text"
          placeholder="Enter URL or text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 transition bg-white dark:bg-gray-700 dark:text-white"
        />
        {text && (
          <div ref={qrRef} className="mb-6 p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-700">
            <QRCodeCanvas value={text} size={200} bgColor={darkMode ? "#1f2937" : "#FFFFFF"} fgColor={darkMode ? "#F9FAFB" : "#111827"} />
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <button
            onClick={downloadQRCode}
            disabled={!text}
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white font-medium rounded-xl py-3 transition disabled:opacity-50"
          >
            <FiDownload /> Download QR
          </button>
          <button
            onClick={copyToClipboard}
            disabled={!text}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-medium rounded-xl py-3 transition disabled:opacity-50"
          >
            <FiCopy /> Copy Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;