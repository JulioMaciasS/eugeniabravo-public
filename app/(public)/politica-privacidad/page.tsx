import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad - EugeniaBravoDemo Asesoría Legal',
  description: 'Política de privacidad y protección de datos conforme al RGPD.',
}

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Política de Privacidad
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Responsable del Tratamiento
              </h2>
              <p>
                En cumplimiento del Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018, 
                de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), 
                se informa que los datos personales recabados serán tratados por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Responsable:</strong> EugeniaBravoDemo</li>
                <li><strong>NIF:</strong> DEMO-0000</li>
                <li><strong>Dirección:</strong> Calle Demo 123, 28000 Madrid, España</li>
                <li><strong>Teléfono:</strong> +34 900 123 456</li>
                <li><strong>Email:</strong> contact@eugeniabravodemo.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Finalidades del Tratamiento
              </h2>
              <p>Los datos personales que se recogen se utilizarán para las siguientes finalidades:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prestación de servicios legales:</strong> Gestión de consultas, contratación y prestación de servicios de asesoría legal</li>
                <li><strong>Comunicación:</strong> Responder a consultas y mantener comunicación profesional</li>
                <li><strong>Newsletter:</strong> Envío de información legal relevante (con consentimiento expreso)</li>
                <li><strong>Obligaciones legales:</strong> Cumplimiento de obligaciones fiscales, contables y profesionales</li>
                <li><strong>Análisis web:</strong> Mejora de la experiencia del usuario mediante análisis estadísticos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Base Jurídica del Tratamiento
              </h2>
              <p>El tratamiento de los datos personales se basa en:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales y newsletter</li>
                <li><strong>Ejecución contractual:</strong> Para la prestación de servicios jurídicos contratados</li>
                <li><strong>Interés legítimo:</strong> Para responder consultas y mejorar nuestros servicios</li>
                <li><strong>Obligación legal:</strong> Para cumplir con obligaciones profesionales, fiscales y contables</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Datos Recogidos
              </h2>
              <p>Se pueden recoger los siguientes tipos de datos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Datos identificativos:</strong> Nombre, apellidos, DNI/NIE</li>
                <li><strong>Datos de contacto:</strong> Dirección, teléfono, email</li>
                <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, páginas visitadas</li>
                <li><strong>Datos del caso:</strong> Información relacionada con la consulta o servicio legal</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Periodo de Conservación
              </h2>
              <p>Los datos personales se conservarán durante:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Clientes activos:</strong> Durante la relación profesional y hasta 6 años después por obligaciones legales</li>
                <li><strong>Consultas:</strong> 3 años desde la última comunicación</li>
                <li><strong>Newsletter:</strong> Hasta que se solicite la baja</li>
                <li><strong>Datos técnicos:</strong> Según políticas de Google Analytics (máximo 26 meses)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Destinatarios de los Datos
              </h2>
              <p>Los datos personales pueden ser comunicados a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Administraciones Públicas:</strong> Cuando sea legalmente exigible</li>
                <li><strong>Proveedores de servicios:</strong> Hosting, email marketing, herramientas técnicas (bajo acuerdos de confidencialidad)</li>
                <li><strong>Colegio Profesional:</strong> Para cumplir con obligaciones deontológicas</li>
                <li><strong>Aseguradoras:</strong> En caso de necesidad por responsabilidad civil profesional</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Transferencias Internacionales
              </h2>
              <p>
                Algunos proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo. 
                En estos casos, se garantiza un nivel de protección adecuado mediante:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Decisiones de adecuación de la Comisión Europea</li>
                <li>Cláusulas contractuales tipo</li>
                <li>Certificaciones y códigos de conducta aprobados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Derechos del Interesado
              </h2>
              <p>Usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acceso:</strong> Conocer qué datos tratamos sobre usted</li>
                <li><strong>Rectificación:</strong> Modificar datos inexactos o incompletos</li>
                <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos</li>
                <li><strong>Limitación:</strong> Restringir el tratamiento en determinadas circunstancias</li>
                <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
                <li><strong>Oposición:</strong> Oponerse al tratamiento por motivos particulares</li>
                <li><strong>Revocación del consentimiento:</strong> Retirar el consentimiento en cualquier momento</li>
              </ul>
              <p>
                Para ejercer estos derechos, puede contactar en: <strong>contact@eugeniabravodemo.com</strong> 
                o en la dirección postal indicada.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Reclamaciones
              </h2>
              <p>
                Si considera que el tratamiento de sus datos personales no se ajusta a la normativa, 
                puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) 
                a través de su sitio web: <a href="https://www.aepd.es" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aepd.es</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Cookies y Tecnologías de Seguimiento
              </h2>
              <p>
                Este sitio web utiliza cookies y tecnologías similares. Para más información, 
                consulte nuestra <a href="/politica-cookies" className="text-blue-600 hover:underline">Política de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Medidas de Seguridad
              </h2>
              <p>
                Se han adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad 
                de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, 
                de acuerdo con el estado de la técnica y la naturaleza de los datos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Actualizaciones
              </h2>
              <p>
                Esta política de privacidad puede ser actualizada. Se recomienda revisar periódicamente 
                este documento. La última actualización se realizó en <strong>[FECHA DE ÚLTIMA ACTUALIZACIÓN]</strong>.
              </p>
            </section>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <p className="text-sm text-blue-800">
                <strong>Contacto para Protección de Datos:</strong><br />
                Email: contact@eugeniabravodemo.com<br />
                Teléfono: +34 900 123 456<br />
                Dirección: Calle Demo 123, 28000 Madrid, España
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
              <p className="text-sm text-green-800">
                <strong>Información actualizada:</strong> Este documento contiene datos de referencia para la demo 
                de EugeniaBravoDemo, Colegiada Nº DEMO-0000 del Colegio de Abogados de Madrid. 
                Última actualización: Agosto 2025.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
