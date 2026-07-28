import About from "@/app/components/About";

type AboutPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  return <About lang={lang} />;
}

export default AboutPage;