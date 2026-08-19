import HomePageClient from '@/components/home/HomePageClient';
import { buildHomeData } from '@/lib/pageData';

export default function Home() {
  const { dataByLocale, defaultLocale } = buildHomeData();
  return <HomePageClient dataByLocale={dataByLocale} defaultLocale={defaultLocale} />;
}
