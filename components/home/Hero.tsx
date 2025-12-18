"use client"

import { BookOpen, ChevronDown, Mail } from 'lucide-react'
import Link from 'next/link'
import './Hero.css'

export default function Hero() {
  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight - 80, behavior: 'smooth' })
  }

  return (
    <section className="hero-container relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80"
          alt="Oficina legal"
          className="w-full h-full object-cover blur-md"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-800/50"></div>
      </div>
      
      {/* Wrapper with translation - this is the key change */}
      <div className="-translate-y-28 md:-translate-y-0 h-[calc(100vh-80px)] flex flex-col items-center justify-center w-full">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          {/* Text content */}
          <div className="text-center w-full px-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider md:tracking-widest text-white mb-2 mx-auto animate-fade-in-down">
              EugeniaBravoDemo
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 px-2 animate-fade-in">
              Navegando por complejos panoramas legales con{' '}
              <span
                style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}
                className="whitespace-nowrap font-bold text-[21px] md:text-[24px] text-gray-200"
              >
                claridad y precisión
              </span>
              .<br />
              Análisis experto y consejos prácticos.
            </h2>
            
            <div className="flex items-center flex-col md:flex-row justify-center gap-4 md:gap-6 flex-wrap px-2">
              <Link
                href="/articulos"
                className="w-40 md:w-44 h-14 md:h-16 bg-gray-50/10 border-2 border-[#009483] rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 flex justify-center items-center space-x-1"
              >
                <p className="text-lg md:text-2xl text-white">Artículos</p>
                <BookOpen className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </Link>
              <Link
                href="/contacto"
                className="w-40 md:w-44 h-14 md:h-16 bg-[#009483] rounded-full shadow-lg transition-transform transform hover:scale-105 duration-300 flex justify-center items-center space-x-1"
              >
                <p className="text-lg md:text-2xl text-white">Contactar</p>
                <Mail className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </Link>
            </div>
          </div>
        </div>
        
        <button
          onClick={scrollDown}
          aria-label="Desplazar hacia abajo"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 focus:outline-none z-10"
        >
          <ChevronDown className="w-8 h-8 text-white animate-bounce" />
        </button>
      </div>
    </section>
  )
}