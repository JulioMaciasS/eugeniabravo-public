import React from 'react'
import ServiceLinks from '@/components/home/ServiceLinks'
import { H1 } from '@/components/ui/Typography'
// import Testimonials from '@/components/Home/Testimonials'

function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <H1 variant="public">
            Servicios
          </H1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros servicios especializados y plataformas diseñadas para ayudarte.
          </p>
        </div>
        
        <ServiceLinks isSection={false}/>
        {/* <Testimonials /> */}
      </div>
    </div>
  )
}

export default ServicesPage