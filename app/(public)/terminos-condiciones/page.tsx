import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Términos y Condiciones - EugeniaBravoDemo Asesoría Legal',
  description: 'Términos y condiciones de uso de los servicios de EugeniaBravoDemo Asesoría Legal.',
}

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Términos y Condiciones de Servicio
          </h1>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Introducción y Aceptación
              </h2>
              <p>
                Los presentes términos y condiciones regulan el uso de los servicios de asesoría legal 
                prestados por EugeniaBravoDemo (en adelante, "el Prestador") y el acceso a este sitio web. 
                Al acceder o utilizar nuestros servicios, usted acepta quedar vinculado por estos términos.
              </p>
              <p>
                Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios 
                ni acceder a este sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Servicios Ofrecidos
              </h2>
              <p>
                EugeniaBravoDemo ofrece servicios de asesoría legal especializados en:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Derecho de familia y divorcios</li>
                <li>Asesoramiento legal integral</li>
                <li>Gestión de procedimientos judiciales</li>
                <li>Consultoría jurídica especializada</li>
                <li>Otros servicios relacionados con el ámbito legal</li>
              </ul>
              <p className="mt-4">
                Los servicios se prestan bajo las condiciones establecidas en el contrato específico 
                que se suscriba con cada cliente y conforme a la legislación española aplicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Relación Cliente-Abogado
              </h2>
              <p>
                La relación profesional entre el cliente y EugeniaBravoDemo se establece mediante:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Contrato de prestación de servicios profesionales</li>
                <li>Carta de encargo específica para cada asunto</li>
                <li>Aceptación expresa de las condiciones de servicio</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="text-blue-800">
                  <strong>Importante:</strong> La mera consulta de este sitio web o el envío de una consulta 
                  inicial no establece una relación abogado-cliente hasta que se formalice el correspondiente 
                  contrato de servicios.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Confidencialidad y Secreto Profesional
              </h2>
              <p>
                EugeniaBravoDemo se compromete a mantener la más estricta confidencialidad respecto a toda 
                la información proporcionada por el cliente, conforme a:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>El secreto profesional establecido en el Estatuto General de la Abogacía Española</li>
                <li>El Código Deontológico de la Abogacía Española</li>
                <li>Las disposiciones del Reglamento General de Protección de Datos (RGPD)</li>
                <li>La Ley Orgánica de Protección de Datos Personales y garantía de los derechos digitales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Honorarios y Forma de Pago
              </h2>
              <p>
                Los honorarios profesionales se establecerán conforme a:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>La complejidad del asunto</li>
                <li>El tiempo dedicado</li>
                <li>Los baremos orientativos del Colegio de Abogados correspondiente</li>
                <li>El acuerdo específico alcanzado con el cliente</li>
              </ul>
              <p className="mt-4">
                Los honorarios y la forma de pago se especificarán claramente en el contrato de servicios 
                o carta de encargo correspondiente. El cliente se compromete al pago de los honorarios 
                en los términos acordados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Obligaciones del Cliente
              </h2>
              <p>El cliente se compromete a:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Proporcionar información veraz, completa y actualizada</li>
                <li>Colaborar activamente en la defensa de sus intereses</li>
                <li>Facilitar toda la documentación necesaria</li>
                <li>Comunicar cualquier cambio relevante en las circunstancias del caso</li>
                <li>Cumplir con los plazos y requerimientos establecidos</li>
                <li>Abonar los honorarios en los términos acordados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <p>
                La responsabilidad de EugeniaBravoDemo se limita a la prestación diligente de los servicios 
                profesionales contratados, conforme a la lex artis y las normas deontológicas aplicables.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800">
                  <strong>Limitaciones:</strong>
                </p>
                <ul className="list-disc pl-5 text-amber-800 space-y-1 mt-2">
                  <li>No se garantizan resultados específicos en procedimientos judiciales</li>
                  <li>La responsabilidad se limita al ámbito de actuación profesional contratado</li>
                  <li>Se excluye responsabilidad por información incorrecta facilitada por el cliente</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Terminación del Contrato
              </h2>
              <p>
                El contrato de servicios puede finalizar por:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Cumplimiento del objeto contractual</li>
                <li>Mutuo acuerdo entre las partes</li>
                <li>Desistimiento del cliente (con pago de servicios prestados)</li>
                <li>Renuncia del abogado por causas justificadas</li>
                <li>Incumplimiento grave de las obligaciones contractuales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Protección de Datos Personales
              </h2>
              <p>
                El tratamiento de datos personales se realizará conforme a nuestra 
                <a href="/politica-privacidad" className="text-blue-600 hover:text-blue-800 underline">
                  Política de Privacidad
                </a> y a la normativa vigente en materia de protección de datos.
              </p>
              <p className="mt-4">
                Los datos se tratarán con la finalidad de prestar los servicios legales contratados 
                y cumplir con las obligaciones profesionales y legales aplicables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Resolución de Conflictos
              </h2>
              <p>
                En caso de discrepancia o conflicto relacionado con la prestación de servicios, 
                las partes se comprometen a intentar resolverlo mediante:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>Negociación directa entre las partes</li>
                <li>Mediación a través del Colegio de Abogados correspondiente</li>
                <li>En último caso, sometimiento a los tribunales competentes</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Legislación Aplicable y Jurisdicción
              </h2>
              <p>
                Estos términos y condiciones se rigen por la legislación española vigente. 
                Para cualquier controversia que pudiera surgir, las partes se someten a la 
                jurisdicción de los Juzgados y Tribunales de Madrid, España, 
                renunciando expresamente a cualquier otro fuero que pudiera corresponderles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Modificaciones
              </h2>
              <p>
                EugeniaBravoDemo se reserva el derecho a modificar estos términos y condiciones. 
                Las modificaciones serán comunicadas a los clientes y publicadas en este sitio web 
                con la debida antelación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Contacto
              </h2>
              <p>
                Para cualquier consulta sobre estos términos y condiciones:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <ul className="space-y-2">
                  <li><strong>EugeniaBravoDemo</strong></li>
                  <li><strong>Email:</strong> contact@eugeniabravodemo.com</li>
                  <li><strong>Teléfono:</strong> +34 900 123 456</li>
                  <li><strong>Dirección:</strong> Calle Demo 123, 28000 Madrid, España</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}
