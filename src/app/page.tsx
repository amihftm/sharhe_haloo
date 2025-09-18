// app/page.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, ListChecks, Sparkles, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-20 text-center sm:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-primary">شرح حالوو</span>: آموزش پزشکی با هوش مصنوعی
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
          سامانه آموزش بالینی و گام به گام اصول شرح حال گیری و تقویت دید بالینی برای دانشجویان و کارورزان پزشکی.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild>
            <Link href="/auth/login">ورود و شروع یادگیری</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">یادگیری هوشمند پزشکی</h2>
          <p className="text-muted-foreground mt-2">
            با استفاده از ابزارهای مبتنی بر هوش مصنوعی، مهارت‌های بالینی خود را تقویت کنید.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<BrainCircuit className="h-8 w-8 text-primary" />}
            title="سناریوهای بالینی تعاملی"
            description="با بیماران مجازی مبتنی بر هوش مصنوعی مصاحبه کنید و مهارت شرح حال‌گیری خود را به چالش بکشید."
          />
          <FeatureCard
            icon={<ListChecks className="h-8 w-8 text-primary" />}
            title="راهنمای گام به گام"
            description="در طول فرآیند تشخیص، راهنمایی و سرنخ‌های هوشمند دریافت کنید تا به تشخیص افتراقی صحیح برسید."
          />
          <FeatureCard
            icon={<Sparkles className="h-8 w-8 text-primary" />}
            title="بازخورد هوشمند و آنی"
            description="عملکرد خود را در هر سناریو تحلیل کرده و نقاط قوت و ضعف خود را با گزارش‌های دقیق شناسایی کنید."
          />
          <FeatureCard
            icon={<BookOpenCheck className="h-8 w-8 text-primary" />}
            title="پایگاه دانش جامع"
            description="دسترسی به آخرین مقالات، گایدلاین‌ها و منابع آموزشی برای پشتیبانی از تصمیمات بالینی شما."
          />
        </div>
      </section>
    </div>
  );
}

// Helper component for feature cards
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="text-center transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl">
      <CardHeader>
        <div className="mx-auto bg-secondary rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
