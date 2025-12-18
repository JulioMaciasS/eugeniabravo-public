"use client"

import React from 'react';
import './AboutMe.css';
import { motion } from 'framer-motion';
import Link from "next/link";

function AboutMe() {
  return (
    <div className='min-h-[calc(80vh-80px)] py-12 bg-gray-50 justify-center'>
      <div className="pt-16 pb-16 pr-5 pl-5">
        <div className="text-center m-14">
          <motion.h4
            className="text-2xl lg:text-3xl font-bold tracking-wide uppercase"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.2 }}
          >
            Sobre Mí
          </motion.h4>
        </div>
        <div className='w-full flex flex-row justify-center'>
          <div className="flex flex-col lg:flex-row items-center justify-center text-center gap-3 max-w-5xl p-2">
            <motion.div
              className="pro-img lg:w-2/5 mb-4 lg:mb-0 lg:mr-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p>
                <img
                  className="max-h-full max-w-full sm:max-h-96 sm:max-w-96 lg:max-w-full md:max-h-full mx-auto rounded-full"
                  src="/images/portrait-placeholder.svg"
                  alt="EugeniaBravoDemo"
                  title="EugeniaBravoDemo"
                />
              </p>
              <p className='mt-3'>
                <em>
                  <strong>EugeniaBravoDemo</strong>
                </em>
                <br /><br />
                <em>Asesoría legal y mediación familiar</em>
                <br />
                <em>Experiencia demostrativa en gestión de casos</em>
              </p>
            </motion.div>
            <motion.div
              className="inline-block align-top w-full md:w-3/5 text-justify text-lg italic text-gray-800"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p>
                Internet está llena de información sobre lo que dice la ley respecto al divorcio y todos los
                temas asociados a la ruptura matrimonial: la custodia de los hijos, la pensión de alimentos, la
                división de los bienes y, en general, se encuentran consejos sobre qué hacer para evitar un proceso
                largo y tedioso, teniendo en cuenta lo que la ley dice y los jueces interpretan. <br /><br />
                Aquí te propongo que te centres en ti, en tu realidad, necesidad y tu deseo antes de tomar en cuenta
                “lo que debe ser” tu divorcio según las leyes y los jueces. <br /><br />
                Quiero guiarte para que desde el primer minuto sepas qué tener en cuenta, cómo puedes organizarte y
                ordenar tus ideas para lograr un divorcio a tu medida y obtener la información precisa para darle a
                tu asesor.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMe;
