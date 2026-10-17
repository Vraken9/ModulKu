"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ChatMessage {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: string;
  category?: string;
}

const STORAGE_KEY = "modulku_user_feedback_chat";
const ADMIN_INBOX_KEY = "modulku_admin_feedback_inbox";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    sender: "admin",
    text: "Halo Bapak/Ibu Pendidik! Tim Layanan ModulKu siap membantu Anda. Sampaikan kendala teknis, keluh kesah, saran perbaikan, atau permintaan fitur baru untuk platform ini.",
    timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
  },
];

const CATEGORIES = [
  { id: "kendala", label: "Kendala Teknis", icon: AlertCircle },
  { id: "keluh_kesah", label: "Keluh Kesah / Masukan", icon: MessageSquare },
  { id: "fitur", label: "Permintaan Fitur Baru", icon: Lightbulb },
  { id: "pembayaran", label: "Pertanyaan Akun / Kuota", icon: HelpCircle },
];

export function AdminChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("keluh_kesah");
  const [isSentAlert, setIsSentAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      category: selectedCategory,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText("");

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Simpan ke inbox feedback admin
      const rawInbox = localStorage.getItem(ADMIN_INBOX_KEY);
      const inboxList = rawInbox ? JSON.parse(rawInbox) : [];
      const userProfile = localStorage.getItem("guru_teacher_profile");
      const parsedProfile = userProfile ? JSON.parse(userProfile) : {};

      const feedbackItem = {
        id: userMsg.id,
        senderName: parsedProfile.teacher_name || "Pendidik ModulKu",
        senderSchool: parsedProfile.school_name || "Satuan Pendidikan",
        category: selectedCategory,
        text: userMsg.text,
        timestamp: new Date().toISOString(),
        status: "unread",
      };

      localStorage.setItem(ADMIN_INBOX_KEY, JSON.stringify([feedbackItem, ...inboxList]));
      window.dispatchEvent(new CustomEvent("modulku-feedback-received"));
    } catch {
      // ignore
    }

    // Auto response dari sistem admin
    setTimeout(() => {
      const adminReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: "admin",
        text: "Terima kasih atas pesan dan masukan Anda! Laporan ini telah diteruskan langsung ke sistem admin. Jika memerlukan respon darurat atau tindak lanjut instan, silakan hubungi WhatsApp resmi kami di bawah ini.",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => {
        const withReply = [...prev, adminReply];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(withReply));
        } catch {
          // ignore
        }
        return withReply;
      });
      setIsSentAlert(true);
      setTimeout(() => setIsSentAlert(false), 5000);
    }, 800);
  };

  const getWhatsAppDirectLink = () => {
    const phone = "6289530123608";
    const categoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Bantuan";
    const text = encodeURIComponent(
      `Halo Admin ModulKu, saya ingin menyampaikan feedback mengenai [${categoryLabel}]: ${inputText || "Mohon bantuan terkait modul dan akun saya."}`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <>
      {/* Floating Trigger Button di Pojok Kanan Bawah */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 no-print">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer border border-blue-500/50"
            title="Layanan Bantuan & Masukan Pendidik"
          >
            <div className="relative">
              <Headphones className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-pulse" />
            </div>
            <span className="text-xs font-bold tracking-tight">Chat Admin & Feedback</span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 no-print">
          {/* Header Chat */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Layanan Pendidik ModulKu</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Admin Siaga (Respon Aktif)</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Kategori Pilihan Cepat */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Pilih Kategori Masukan:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Area Pesan Chat */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none"
                  }`}
                >
                  {msg.category && msg.sender === "user" && (
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-blue-700/80 text-blue-100 px-1.5 py-0.5 rounded mb-1">
                      {CATEGORIES.find((c) => c.id === msg.category)?.label || msg.category}
                    </span>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-600 font-mono mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick WhatsApp Action Strip */}
          <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-[11px]">
            <span className="text-emerald-800 font-medium truncate">
              Butuh respon cepat langsung?
            </span>
            <a
              href={getWhatsAppDirectLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0"
            >
              <span>WhatsApp Admin (089530123608)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Input Formulir Pesan */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tulis kendala, saran, atau keluh kesah..."
              className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-3.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
