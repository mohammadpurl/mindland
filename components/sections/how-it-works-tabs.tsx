"use client";

/**
 * HowItWorksTabs — Client island
 *
 * Only this file is client-rendered. It contains:
 *   - Tab state (student / teacher)
 *   - AnimatePresence for step transitions
 *   - Step data (including icon components — must be in client file
 *     because icon components are functions and cannot be serialized
 *     across the server→client boundary as props)
 *
 * The parent how-it-works.tsx is a Server Component.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, Compass, Brain, Trophy, Wand2, BookOpen, BarChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = "student" | "teacher";

interface Step {
  icon:  LucideIcon;
  title: string;
  body:  string;
  color: string;
  num:   string;
}

const journeys: Record<Tab, { label: string; steps: Step[] }> = {
  student: {
    label: "مسیر دانش‌آموز",
    steps: [
      { icon: UserCheck, title: "ثبت‌نام رایگان",       body: "با ایمیل یا شماره موبایل در کمتر از یک دقیقه ثبت‌نام کن.",                                  color: "#6C5CE7", num: "۰۱" },
      { icon: Compass,   title: "انتخاب مسیر یادگیری", body: "هوش مصنوعی ما سطح و علاقه‌های تو را می‌سنجد و مسیر شخصی پیشنهاد می‌دهد.",           color: "#3B82F6", num: "۰۲" },
      { icon: Brain,     title: "شروع با هوش مصنوعی",  body: "درس‌ها با هوش مصنوعی شخصی‌سازی می‌شوند — هر سوال، هر تمرین برای توست.",           color: "#6C5CE7", num: "۰۳" },
      { icon: Trophy,    title: "پیشرفت و کسب مهارت",  body: "امتیاز بگیر، سطح بالا برو و با گواهی‌نامه‌های دیجیتال مهارتت را ثابت کن.",          color: "#00FFB2", num: "۰۴" },
    ],
  },
  teacher: {
    label: "مسیر معلم",
    steps: [
      { icon: UserCheck, title: "ثبت‌نام رایگان",              body: "با مدرک معلمی ثبت‌نام کن و به امکانات حرفه‌ای دسترسی داشته باش.",          color: "#6C5CE7", num: "۰۱" },
      { icon: Wand2,     title: "ساخت محتوا با هوش مصنوعی",   body: "درسنامه، اسلاید و آزمون را در چند دقیقه با کمک هوش مصنوعی بساز.",          color: "#3B82F6", num: "۰۲" },
      { icon: BookOpen,  title: "اشتراک با دانش‌آموزان",      body: "محتوای خود را با یک لینک با تمام کلاس به اشتراک بگذار.",                    color: "#6C5CE7", num: "۰۳" },
      { icon: BarChart,  title: "نظارت و تحلیل پیشرفت",       body: "پیشرفت هر دانش‌آموز را لحظه به لحظه ببین و نقاط ضعف را سریع شناسایی کن.", color: "#00FFB2", num: "۰۴" },
    ],
  },
};

const stepVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export function HowItWorksTabs() {
  const [tab, setTab] = useState<Tab>("student");
  const journey = journeys[tab];

  return (
    <>
      {/* Tab switcher */}
      <div className="flex justify-center mb-16">
        <div
          className="flex items-center rounded-xl p-1"
          style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
        >
          {(["student", "teacher"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="relative h-11 px-8 rounded-xl text-sm font-bold transition-colors duration-150"
              style={{ color: tab === t ? "#0B0F19" : "#9CA3AF" }}
            >
              {tab === t && (
                <motion.div
                  layoutId="hiw-tab-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)", boxShadow: "0 4px 16px rgba(108,92,231,0.35)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <span className={`relative ${tab === t ? "text-white" : ""}`}>
                {journeys[t].label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {journey.steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  custom={i}
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div
                    className="p-8 rounded-2xl h-full"
                    style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #6C5CE7, #3B82F6)" }}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-extrabold text-2xl" style={{ color: "rgba(0,0,0,0.06)" }}>
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2" style={{ fontSize: "1.05rem", color: "#0B0F19" }}>
                      {step.title}
                    </h3>
                    <p className="text-sm" style={{ color: "#6B7280", lineHeight: "1.75", maxWidth: "none" }}>
                      {step.body}
                    </p>
                    <div className="mt-6 h-1 rounded-full" style={{ background: step.color, opacity: 0.6, width: "32px" }} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
