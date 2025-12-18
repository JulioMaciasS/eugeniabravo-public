import Hero from '@/components/home/Hero'
import LatestPosts from '@/components/home/LatestPosts'
import GetInTouch from '@/components/home/GetInTouch'
import AboutMe from '@/components/home/AboutMe'
import FAQ from '@/components/home/FAQ'
import Testimonials from '@/components/home/Testimonials'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EugeniaBravoDemo - Abogada Especialista',
  description: 'Navegando por complejos panoramas legales con claridad y precisión. Servicios legales especializados en derecho civil, penal, laboral y más.',
  alternates: {
    canonical: 'https://www.eugeniabravodemo.com',
  },
  openGraph: {
    title: 'EugeniaBravoDemo - Abogada Especialista',
    description: 'Navegando por complejos panoramas legales con claridad y precisión.',
    url: 'https://www.eugeniabravodemo.com',
    siteName: 'EugeniaBravoDemo',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function HomePage() {
  return (
      <div>
        <Hero />
        <LatestPosts isSection={true}/>
        {/* <ServiceLinks /> */}
        <AboutMe/>
        <Testimonials />
        <FAQ />
        <GetInTouch isSection={true}/>
      </div>  
  )
}
