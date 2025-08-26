import React, { useState, useEffect } from "react";
import "../App.css";
import { FaSearch, FaHighlighter, FaUpload } from "react-icons/fa";
import { doc, getDoc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import SignOutButton from "./signout";

const loadingMessages = [
  "🔍 Reading your document...",
  "🧠 Thinking really hard...",
  "✨ Finding the key insights...",
  "📑 Highlighting important parts...",
  "please dont leave...",
  "what if it's your internet… 🙄",
  "its giving... ✨impatient✨",
  "almost there...",
  "just a bit longer...",
  "your patience is appreciated...",
  "🚀 Almost done!"
];

function Main() {
  const [pdfText, setPdfText] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your PDF...");

  const [credits, setCredits] = useState(0);
  const [showCredits, setShowCredits] = useState(false);
  const [userPlan, setUserPlan] = useState("free");

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchCredits = async () => {
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const plan = data.plan || "free";
        setUserPlan(plan);

        let currentCredits = typeof data.credits === "number" ? data.credits : plan === "free" ? 5 : 0;

        const lastReset = data.lastReset?.toDate ? data.lastReset.toDate() : new Date(data.lastReset);
        const today = new Date();
        if (!lastReset || lastReset.toDateString() !== today.toDateString()) {
          const resetCredits = plan === "free" ? 5 : currentCredits;
          await updateDoc(userRef, {
            credits: resetCredits,
            lastReset: Timestamp.fromDate(today)
          });
          currentCredits = resetCredits;
        }

        setCredits(currentCredits);
      } else {
        await setDoc(userRef, {
          plan: "free",
          credits: 5,
          lastReset: Timestamp.fromDate(new Date())
        });
        setCredits(5);
        setUserPlan("free");
      }
    };

    fetchCredits();
  }, [user]);

  useEffect(() => {
    if (!aiLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[i % loadingMessages.length]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, [aiLoading]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setPdfText(data.text || "");
      setHighlightedContent("");
    } catch (err) {
      console.error(err);
      setPdfText("PDF parsing failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAIHighlight = async () => {
    if (!pdfText) return;

    if (typeof credits !== "number" || credits <= 0) {
      alert("You have no credits left! Come back tomorrow for free credits or upgrade your plan.");
      return;
    }

    setAiLoading(true);

    try {
      const res = await fetch("http://localhost:8000/ai-highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: pdfText })
      });
      const data = await res.json();

      if (data.highlights && Array.isArray(data.highlights)) {
        let newContent = pdfText;
        const markStyle = "background-color: #5cfbb1ff; color: #000; border-radius: 3px; padding: 0 2px;";

        data.highlights.forEach(h => {
          const regex = new RegExp(h.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          newContent = newContent.replace(regex, `<mark style="${markStyle}">$&</mark>`);
        });

        setHighlightedContent(newContent);

        const userRef = doc(db, "users", user.uid);
        const newCredits = credits - 1;
        await updateDoc(userRef, { credits: newCredits });
        setCredits(newCredits);
      } else {
        alert("AI did not find any important sentences to highlight.");
      }
    } catch (err) {
      console.error(err);
      alert("AI highlighting failed");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="title">LENSE</h1>
      <div className="top-bar">
        <div className="top-buttons">
          <button
            className="upgrade-btn"
            onClick={() => window.location.href = "/pricing"}
          >
            Upgrade to Pro
          </button>
          <SignOutButton />
        </div>
      </div>

      <div className="container">
        <div className="glass-panel">
          {loading ? (
            <div className="loading-panel">
              <div className="loading-spinner"></div>
              <p>Parsing PDF...</p>
            </div>
          ) : aiLoading ? (
            <div className="loading-panel">
              <div className="loading-spinner"></div>
              <p>{loadingMessage}</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: highlightedContent || pdfText || "Upload a PDF to see content here..." }} />
          )}
        </div>

        <div className="right-section">
          <div className="button-group">
            <button className="green-btn" onClick={handleAIHighlight} disabled={aiLoading || !pdfText || credits <= 0}>
              <FaHighlighter /> AI Highlight
            </button>
            <button className="green-btn"><FaSearch /> Look Up</button>
          </div>

          {/* Credits Box */}
          <div
            className="credits-box"
            onClick={() => setShowCredits(!showCredits)}
            style={{ color: credits <= 0 ? "red" : "white" }}
          >
            <span style={{ marginRight: "5px" }}>💎</span>
            {credits} Credits
            {showCredits && (
              <div className="credits-popup" style={{ marginTop: "5px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span>
                  {credits > 0
                    ? `You have ${credits} credits remaining for today.`
                    : "You have 0 credits."}
                </span>
                <button
                  className="green-btn"
                  onClick={() => window.location.href = "/pricing"}
                  style={{ marginTop: "5px" }}
                >
                  Upgrade To Pro
                </button>
              </div>
            )}
          </div>

          <div className="upload-glass">
            <p className="upload-text"><FaUpload /> Upload Article</p>
            <input type="file" onChange={handleFileChange} />
            <button className="green-btn" onClick={handleUpload}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
