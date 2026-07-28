"use client";

/**
 * QuizBuilderCard — Client island
 *
 * Isolated because it requires useState + useEffect + AnimatePresence
 * for the AI "generating" animation. Everything else in teacher-world.tsx
 * is server-rendered.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle2, Check } from "lucide-react";

const generatedQuestions = [
  {
    q:       "کدام یک از موارد زیر از ۱/۲ بزرگ‌تر است؟",
    opts:    ["۱/۳", "۳/۴", "۱/۴", "۲/۶"],
    correct: 1,
  },
  {
    q:       "حاصل ۲/۵ + ۳/۵ برابر است با:",
    opts:    ["۱/۵", "۵/۱۰", "۱", "۲/۱"],
    correct: 2,
  },
];

export function QuizBuilderCard() {
  const [generated, setGenerated] = useState(false);
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(true),   800);
    const t2 = setTimeout(() => setGenerated(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl overflow-hidden"
      style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
          >
            AI
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#0B0F19" }}>آزمون‌ساز هوشمند</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>ساخت آزمون با هوش مصنوعی</p>
          </div>
        </div>
        {generated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-1 rounded-full"
            style={{ background: "rgba(0,255,178,0.1)", border: "1px solid rgba(0,255,178,0.2)" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#00FFB2" }} />
            <span className="text-xs font-bold" style={{ color: "#00996A" }}>آماده</span>
          </motion.div>
        )}
      </div>

      {/* Inputs */}
      <div className="px-6 py-6" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold mb-2 block" style={{ color: "#6B7280" }}>موضوع درسی</label>
            <div
              className="flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium"
              style={{ background: "#F7F8FA", border: "1px solid rgba(0,0,0,0.08)", color: "#0B0F19" }}
            >
              <BookOpen className="w-4 h-4" style={{ color: "#6C5CE7" }} />
              کسرهای ریاضی — پایه چهارم
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "تعداد سوال", value: "۱۰ سوال" },
              { label: "سطح دشواری", value: "متوسط"   },
            ].map(({ label, value }) => (
              <div key={label}>
                <label className="text-xs font-bold mb-2 block" style={{ color: "#6B7280" }}>{label}</label>
                <div className="px-4 py-4 rounded-xl text-sm font-medium text-center" style={{ background: "#F7F8FA", border: "1px solid rgba(0,0,0,0.08)", color: "#0B0F19" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div
            className="flex items-center justify-center h-12 rounded-xl font-bold text-sm text-white"
            style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
          >
            {loading && !generated ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                در حال ساخت آزمون...
              </span>
            ) : generated ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                ۱۰ سوال آماده شد
              </span>
            ) : (
              <span>ساخت آزمون با هوش مصنوعی</span>
            )}
          </div>
        </div>
      </div>

      {/* Generated questions */}
      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="px-6 py-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#6C5CE7", letterSpacing: "0.1em" }}>
              نمونه سوالات
            </p>
            {generatedQuestions.map((q, qi) => (
              <div key={qi} className="mb-4 p-4 rounded-xl" style={{ background: "#F7F8FA", border: "1px solid rgba(0,0,0,0.05)" }}>
                <p className="text-sm font-semibold mb-4" style={{ color: "#0B0F19" }}>
                  سوال {qi + 1}: {q.q}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {q.opts.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
                      style={{
                        background: i === q.correct ? "rgba(108,92,231,0.08)" : "rgba(0,0,0,0.03)",
                        border:     i === q.correct ? "1px solid rgba(108,92,231,0.25)" : "1px solid transparent",
                        color:      i === q.correct ? "#6C5CE7" : "#6B7280",
                        fontWeight: i === q.correct ? "600" : "400",
                      }}
                    >
                      {i === q.correct && <Check className="w-3 h-3 shrink-0" />}
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              {["دانلود PDF", "اشتراک با کلاس", "ویرایش"].map((action) => (
                <button
                  key={action}
                  className="flex-1 h-10 rounded-xl text-xs font-bold"
                  style={{ border: "1px solid rgba(108,92,231,0.2)", color: "#6C5CE7", background: "rgba(108,92,231,0.05)" }}
                >
                  {action}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
