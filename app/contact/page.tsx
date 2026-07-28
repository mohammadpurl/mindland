'use client'
import React, { useState } from 'react'
import { Phone, MapPin, Mail, Clock, Send } from "lucide-react";
import Link from 'next/link';

function ContactPage() {
    const [sent, setSent] = useState<boolean>(false);
    return (
        <>
          <section className="container mx-auto px-6 py-20">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold text-sm font-semibold tracking-widest">ارتباط با ما</span>
              <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-4">تماس با دفتر</h1>
              <div className="flex justify-center"><div className="h-1 w-20 gold-gradient rounded-full" /></div>
              <p className="text-muted-foreground mt-6">برای رزرو وقت مشاوره یا پرسش حقوقی، از طریق راه‌های زیر در ارتباط باشید.</p>
            </div>
    
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Info */}
              <div className="lg:col-span-2 space-y-4">
                {[
                  { icon: Phone, title: "تلفن همراه", value: "۰۹۱۲ ۴۱۳ ۰۲۲۳", href: "tel:09124130223", ltr: true },
                  { icon: MapPin, title: "آدرس دفتر", value: "سعادت‌آباد، میدان کاج، ابتدای کوچه دوازدهم، پلاک ۳۲، طبقه دوم، واحد ۴" },
                  { icon: Mail, title: "ایمیل", value: "info@soltaniazar.legal", ltr: true },
                  { icon: Clock, title: "ساعات کاری", value: "شنبه تا چهارشنبه، ۹ صبح تا ۶ عصر" },
                ].map((c) => (
                  <Link key={c.title} href={c.href || "#"} className="block p-6 rounded-2xl bg-surface border border-border/50 hover:border-gold/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl gold-gradient flex items-center justify-center shrink-0">
                        <c.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">{c.title}</p>
                        <p className="font-semibold leading-relaxed" dir={c.ltr ? "ltr" : "rtl"} style={c.ltr ? { textAlign: "right" } : undefined}>{c.value}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
    
              {/* Form */}
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="lg:col-span-3 p-8 rounded-2xl bg-surface border border-border/50 space-y-5"
              >
                <h2 className="text-2xl font-bold mb-4">درخواست مشاوره</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block">نام و نام خانوادگی</label>
                    <input required className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">شماره تماس</label>
                    <input required type="tel" className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition-colors" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">موضوع پرونده</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">شرح درخواست</label>
                  <textarea required rows={5} className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-gold outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl gold-gradient text-primary-foreground font-bold shadow-gold hover:scale-[1.02] transition-transform">
                  <Send className="h-4 w-4" /> ارسال درخواست
                </button>
                {sent && (
                  <p className="text-center text-gold text-sm">درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.</p>
                )}
              </form>
            </div>
          </section>
        </>
      );
}

export default ContactPage