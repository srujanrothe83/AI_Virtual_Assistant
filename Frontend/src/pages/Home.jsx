import React, { useContext, useEffect, useRef } from "react";
import { userDataContext } from "../components/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import listening from "../assets/listening.gif";
import { LogOut, PencilSparkles, Menu, X } from "lucide-react";

function Home() {


const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { serverURL, user, setUser, getGeminiResponse } =
    useContext(userDataContext);

  const [status, setStatus] = useState("idle");
  const [typedText, setTypedText] = useState("");

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverURL}/api/auth/logout`, {
        withCredentials: true,
      });

      setUser(null);
      console.log(result.data.message);
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const recognitionRef = useRef(null);
  const processingRef = useRef(false);
  const timerRef = useRef(null);

  const assistantRef = useRef(user?.assistantName);
  const geminiRef = useRef(getGeminiResponse);

  assistantRef.current = user?.assistantName;
  geminiRef.current = getGeminiResponse;

  useEffect(() => {
    if (!user?.assistantName) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognitionRef.current = recognition;

    let active = true;

    const speak = (text) => {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();

        setStatus("speaking");
        setTypedText("");
        let i = 0;
        const typer = setInterval(() => {
          i++;
          setTypedText(text.slice(0, i));
          if (i >= text.length) clearInterval(typer);
        }, 50);

        const finish = () => {
          clearInterval(typer);
          setTypedText(text);
          setTimeout(() => {
            setTypedText("");
            setStatus("idle");
            resolve();
          }, 1200);
        };

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-IN";
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = finish;
        utterance.onerror = finish;

        window.speechSynthesis.speak(utterance);
      });
    };

    const startListening = () => {
      if (!active || processingRef.current) return;

      try {
        recognition.start();
        console.log("Assistant is listening...");
      } catch (error) {
        console.log("Recognition start error:", error.message);
      }
    };

    const restartListening = () => {
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        startListening();
      }, 1000);
    };

    recognition.onstart = () => {
      console.log("Microphone started");
      if (!processingRef.current) setStatus("listening");
    };

    recognition.onresult = async (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.trim();

      console.log("Heard:", transcript);

      if (processingRef.current) return;

      const assistantName = assistantRef.current;

      if (!assistantName) return;

      const escapedName = assistantName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const wakeWord = new RegExp(escapedName, "i");

      if (!wakeWord.test(transcript)) {
        console.log("Wake word not detected");
        return;
      }

      const prompt = transcript.replace(wakeWord, "").trim();

      console.log("Wake word detected!");
      console.log("User command:", prompt);

      processingRef.current = true;
      recognition.stop();

      try {
        if (!prompt) {
          await speak("Yes, I am listening.");
          return;
        }

        console.log("Sending command to Gemini...");

        const gemResult = await geminiRef.current(prompt);

        console.log("Gemini response:", gemResult);

        if (!gemResult || !gemResult.type) {
          throw new Error("Invalid Gemini response");
        }

        const { type, response, parameters } = gemResult;

        let url = null;

        switch (type) {
          case "open-youtube":
            url = "https://www.youtube.com";
            break;

          case "open-instagram":
            url = "https://www.instagram.com";
            break;

          case "open-google":
            url = "https://www.google.com";
            break;

          case "open-facebook":
            url = "https://www.facebook.com";
            break;

          case "open-whatsapp":
            url = "https://web.whatsapp.com";
            break;

          case "open-github":
            url = "https://github.com";
            break;

          case "search-google":
            url = `https://www.google.com/search?q=${encodeURIComponent(parameters?.query || "")}`;
            break;

          case "search-youtube":
          case "play-youtube":
            url = `https://www.youtube.com/results?search_query=${encodeURIComponent(parameters?.query || "")}`;
            break;

          default:
            break;
        }

        if (url) {
          window.open(url, "_blank");
        }

        await speak(response || "Sorry, I couldn't understand.");
      } catch (error) {
        console.log("Assistant Error:", error);
        await speak("Sorry, something went wrong.");
      } finally {
        processingRef.current = false;

        if (active) {
          restartListening();
        }
      }
    };

    recognition.onerror = (event) => {
      console.log("Recognition error:", event.error);
    };

    recognition.onend = () => {
      console.log("Recognition ended");

      if (!processingRef.current) setStatus("idle");

      if (active && !processingRef.current) {
        restartListening();
      }
    };

    startListening();

    return () => {
      active = false;
      clearTimeout(timerRef.current);

      recognition.onend = null;
      recognition.onresult = null;

      recognition.stop();

      window.speechSynthesis.cancel();

      recognitionRef.current = null;
    };
  }, [user?.assistantName]);

  if (!user) return null;

  return (
    <div className="w-full h-dvh overflow-hidden bg-gradient-to-t from-gray-800 to-white flex justify-center items-center">
  <div className="h-full w-full md:h-140 md:max-h-[95%] md:w-250 md:max-w-[95%] bg-white/10 backdrop-blur-md border border-white/20 md:rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-3 justify-center items-center relative">
    <h2 className="text-2xl font-bold text-[#2b2a2a] shrink-0">
      Say, <span className="text-blue-700">{user.assistantName}</span>
    </h2>

    <div className="flex-1 min-h-0 w-full flex justify-center items-center">
      <img
        src={user.Img}
        alt="AI Assistant Image"
        className="max-h-full max-w-full object-contain rounded-2xl border-gray-400 shadow-2xl shadow-black"
      />
    </div>

    <div className="min-h-16 md:min-h-20 shrink-0 w-full px-4 flex justify-center items-center text-center">
      {status === "listening" && (
        <img src={listening} alt="Listening" className="h-16 object-contain" />
      )}

      {status === "speaking" && (
        <p className="text-lg font-semibold text-blue-800 wrap-break-word">
          {typedText}
          <span className="animate-pulse text-blue-400">|</span>
        </p>
      )}
    </div>

    {/* Hamburger: mobile only */}
    <button
      onClick={() => setMenuOpen(true)}
      type="button"
      aria-label="Open menu"
      className="md:hidden absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 text-black shadow-lg active:scale-95 transition-all duration-300"
    >
      <Menu />
    </button>

    {/* Desktop buttons: hidden on mobile */}
    <button
      onClick={handleLogout}
      type="button"
      className="hidden md:flex justify-around cursor-pointer w-30 absolute top-4 right-4 py-3 mt-2 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 text-black font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
    >
      Logout <LogOut />
    </button>

    <button
      onClick={() => navigate("/customized")}
      type="button"
      className="hidden md:flex justify-around cursor-pointer w-33 absolute top-20 right-4 py-3 mt-2 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 text-black font-semibold shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300"
    >
      Customized <PencilSparkles />
    </button>
  </div>

  {/* Backdrop */}
  <div
    onClick={() => setMenuOpen(false)}
    className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
      menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  />

  {/* Sidebar: mobile only */}
  <aside
    className={`md:hidden fixed top-0 right-0 z-50 h-dvh w-64 max-w-[80%] bg-gradient-to-b from-gray-700 to-gray-900 border-l border-white/20 shadow-2xl p-5 flex flex-col gap-4 transition-transform duration-300 ease-in-out ${
      menuOpen ? "translate-x-0" : "translate-x-full"
    }`}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-white truncate">
        {user.assistantName}
      </h3>
      <button
        onClick={() => setMenuOpen(false)}
        type="button"
        aria-label="Close menu"
        className="p-2 rounded-lg text-white hover:bg-white/10 active:scale-95 transition-all"
      >
        <X />
      </button>
    </div>

    <div className="h-px w-full bg-white/20" />

    <button
      onClick={() => {
        setMenuOpen(false);
        navigate("/customized");
      }}
      type="button"
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 text-black font-semibold shadow-lg active:scale-95 transition-all duration-300"
    >
      Customized <PencilSparkles />
    </button>

    <button
      onClick={() => {
        setMenuOpen(false);
        handleLogout();
      }}
      type="button"
      className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gradient-to-b from-gray-200 to-gray-400 text-black font-semibold shadow-lg active:scale-95 transition-all duration-300"
    >
      Logout <LogOut />
    </button>
  </aside>
</div>
  );
}

export default Home;
