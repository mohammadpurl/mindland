"use client";
import React from 'react'
import { Translation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { Gauge, Sparkles, Timer } from 'lucide-react';
import CourtDiagram from '../CourtDiagram';

type ScienceProps = {
  t: Translation;
};

const Science = ({ t }: ScienceProps) => {
    return (
        <section id="science" className="py-24 md:py-36 px-5 md:px-10 border-t border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto">
            <div className="max-w-2xl mb-16 mx-auto text-center">
              <span className="section-kicker">{t.science.tag}</span>
              <h2 className="mt-4 font-display font-bold text-4xl md:text-6xl tracking-tight leading-[0.95]">
                {t.science.title}
              </h2>
              <p className="mt-4 text-foreground/70 text-base md:text-lg">{t.science.sub}</p>
            </div>
    
            {/* Demands */}
            <div className="mb-20">
              <h3 className="mono text-lg font-display font-bold uppercase tracking-widest text-foreground mb-6">{t.science.demands.title}</h3>
              <div className="grid sm:grid-cols-5 gap-px bg-border">
                {t.science.demands.items.map((d, i) => (
                  <motion.div
                    key={d.l}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="bg-background p-6"
                  >
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-2xl font-display font-bold text-neon">{d.v}</span>
                      <span className="mono text-xs text-muted-foreground">%</span>
                    </div>
                    <div className="h-1 bg-border overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${d.v}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-[var(--neon)]"
                      />
                    </div>
                    <p className="mt-3 text-xs uppercase tracking-wider text-foreground/70 mono">{d.l}</p>
                  </motion.div>
                ))}
              </div>
            </div>
    
            {/* Energy systems */}
            <div className="mb-20">
              <h3 className="mono text-lg font-display font-bold uppercase tracking-widest text-foreground mb-6">{t.science.systems.title}</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {t.science.systems.items.map((s, i) => (
                  <motion.div
                    key={s.code}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="border border-border p-7 bg-card/40 hover:border-[var(--neon)] transition group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--neon)] opacity-[0.04] blur-2xl group-hover:opacity-10 transition" />
                    <div className="flex items-center gap-2 mb-6">
                      <Sparkles className="w-3.5 h-3.5 text-neon" />
                      <span className="mono text-xs tracking-widest text-neon">{s.code}</span>
                    </div>
                    <h4 className="font-display font-semibold text-2xl mb-2">{s.t}</h4>
                    <div className="mono text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
                      <Timer className="w-3 h-3" /> {s.time}
                    </div>
                    <p className="text-foreground/60 text-sm leading-relaxed">{s.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
    
            {/* HIIT */}
            <div className="mb-20">
              <h3 className="mono text-lg font-display font-bold uppercase tracking-widest text-foreground mb-6">{t.science.hiit.title}</h3>
              <div className="border border-border divide-y divide-border">
                {t.science.hiit.items.map((h, i) => (
                  <motion.div
                    key={h.t}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="grid grid-cols-12 gap-4 p-5 md:p-7 items-center hover:bg-card/40 transition"
                  >
                    <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                      <Gauge className="w-5 h-5 text-neon" />
                      <span className="font-display font-semibold text-lg md:text-xl">{h.t}</span>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <div className="mono text-xs uppercase tracking-widest text-muted-foreground mb-1">{t.science.hiit.workLabel}</div>
                      <div className="mono text-sm text-neon">{h.w}</div>
                    </div>
                    <div className="col-span-6 md:col-span-2">
                      <div className="mono text-xs uppercase tracking-widest text-muted-foreground mb-1">{t.science.hiit.restLabel}</div>
                      <div className="mono text-sm text-foreground/80">{h.r}</div>
                    </div>
                    <div className="col-span-12 md:col-span-4 text-sm text-foreground/60">{h.d}</div>
                  </motion.div>
                ))}
              </div>
            </div>
    
            {/* Movement patterns — court diagram */}
            <div>
              <h3 className="mono text-lg font-display font-bold uppercase tracking-widest text-foreground mb-6">{t.science.movement.title}</h3>
              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                <CourtDiagram />
                <div className="grid grid-cols-2 gap-px bg-border">
                  {t.science.movement.items.map((m, i) => (
                    <motion.div
                      key={m}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="bg-background p-6 flex flex-col justify-end min-h-[140px] border-s-2 border-neon/40"
                    >
                      <span className="font-display font-semibold text-lg text-start">{m}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
}

export default Science