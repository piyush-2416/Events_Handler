import { useEffect, useRef, useState } from "react";

/* =====================================================================
   NEW: AI CHATBOT (floating button + chat window)
   Abhi sirf UI hai. Backend jodne ke liye neeche getBotReply() badalna hai.
   ===================================================================== */

/* Quick suggestion buttons (pehli baar chat khulne par dikhte hain) */
const quickReplies = ["Plan a wedding 💍", "Birthday party ideas 🎂", "Show me offers 🎁", "Find vendors 📸"];

/* ---------- BOT REPLY ----------
   ABHI: demo ke liye fake reply deta hai (keyword matching).
   BAAD MEIN: is poore function ko apne backend call se replace karo:

   async function getBotReply(messages) {
     const res = await fetch("http://localhost:5000/api/chat", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ messages }), // [{ role, content }]
     });
     if (!res.ok) throw new Error("Request failed");
     const data = await res.json();
     return data.reply;
   }
*/
async function getBotReply(messages) {
  await new Promise((r) => setTimeout(r, 1200)); // typing ka feel
  const last = messages[messages.length - 1].content.toLowerCase();
  if (last.includes("wedding")) return "Congratulations! 💍 Use code WED25 for 25% off our wedding bundles. What's your guest count?";
  if (last.includes("birthday")) return "Fun! 🎂 Code BDAY15 gives 15% off birthday combos. Who is the party for?";
  if (last.includes("offer")) return "Check out our Birthday Party offer in Special Highlights on this page for the latest deals! 🎁";
  if (last.includes("vendor")) return "We have verified caterers, decorators, photographers and bands. What kind of event are you planning?";
  return "I can help with weddings, birthdays, corporate events and more. Tell me what you're planning!";
}

/* ---------- Typing dots (bot soch raha hai) ---------- */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 bg-white shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm ring-1 ring-sky-100 w-fit" aria-label="Assistant is typing">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          style={{ animationDelay: `${d}ms` }}
          className="bg-sky-400 rounded-full w-2 h-2 animate-bounce motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/* ---------- CHATBOT ---------- */
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! 👋 I'm Eventora's assistant. What event are we planning today?" },
  ]);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  // Naya message aane par neeche tak scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  // Chat khulne par input par focus + Esc se close
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const send = async (text) => {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await getBotReply(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const showQuick = messages.length === 1; // sirf shuru mein

  return (
    <>
      {/* CHAT WINDOW */}
      <section
        aria-label="Eventora assistant chat"
        {...(!open && { inert: "" })}
        className={`fixed bottom-24 right-4 z-30 flex h-[28rem] max-h-[calc(100vh-7rem)] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-2xl shadow-sky-900/20 transition-all duration-300 sm:right-6 sm:w-96 ${
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-sky-700 to-blue-800 px-4 py-3 text-white">
          <span className="relative flex justify-center items-center bg-white/20 rounded-full w-10 h-10 text-xl">
            🤖
            <span className="right-0 bottom-0 absolute bg-emerald-400 rounded-full ring-2 ring-sky-700 w-2.5 h-2.5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold text-sm leading-tight">Eventora Assistant</p>
            <p className="text-sky-100 text-xs">Online · Ask me anything</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="hover:bg-white/15 p-1.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 bg-gradient-to-b from-sky-50 to-white p-4 overflow-y-auto" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[80%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-2xl rounded-br-sm bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-md shadow-sky-300/40"
                    : "rounded-2xl rounded-bl-sm bg-white text-slate-700 shadow-sm ring-1 ring-sky-100"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}

          {showQuick && (
            <div className="flex flex-wrap gap-2 pt-1">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="bg-white hover:bg-sky-50 hover:shadow-md px-3 py-1.5 border border-sky-200 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 font-medium text-sky-700 text-xs transition hover:-translate-y-0.5"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {loading && <TypingDots />}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 bg-white p-3 border-sky-100 border-t">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Type your message..."
            maxLength={500}
            aria-label="Type your message"
            className="flex-1 bg-sky-50 px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 text-slate-800 placeholder:text-slate-400 text-sm"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className="flex justify-center items-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-10 h-10 text-white hover:scale-105 disabled:hover:scale-100 transition disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </section>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className="group right-4 sm:right-6 bottom-5 z-30 fixed flex justify-center items-center bg-gradient-to-br from-sky-500 to-blue-700 shadow-sky-500/40 shadow-xl rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 w-14 h-14 text-white hover:scale-110 transition"
      >
        {/* Pulse ring: sirf chat band ho tab */}
        {!open && (
          <span aria-hidden="true" className="absolute inset-0 bg-sky-400/50 rounded-full animate-ping motion-reduce:animate-none" />
        )}
        <span className={`relative text-2xl transition-transform duration-300 ${open ? "rotate-90" : "group-hover:-rotate-12"}`}>
          {open ? "✕" : "💬"}
        </span>
      </button>
    </>
  );
}