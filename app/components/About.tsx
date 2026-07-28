interface AboutProps {
  lang: string
}

export default function About({ lang }: AboutProps) {
  const isFa = lang === 'fa'
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          {isFa ? 'درباره مایلند' : 'About Mindland'}
        </h1>
        <p className="text-slate-600 leading-relaxed">
          {isFa
            ? 'مایلند پلتفرم آموزش برنامه‌نویسی، هوش مصنوعی و رباتیک برای کودکان ۷ تا ۱۵ سال است.'
            : 'Mindland teaches programming, AI, and robotics to children aged 7–15.'}
        </p>
      </div>
    </main>
  )
}
