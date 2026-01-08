'use client'

import { BentoCardComponent } from '@/components/custom-ui/bento-card'
import { motion } from 'framer-motion'
import { CloudLightning, Layers, Lock, Zap } from 'lucide-react'
import { IMG_AUTOMACAO, IMG_DESIGN, IMG_PROCESSAMENTO, IMG_SEGURANCA } from './constants'
import { SectionWrapper } from './global'

export const FeaturesSectionComponent = () => {
  return (
    <SectionWrapper id='tools' className='relative overflow-hidden py-32'>
      <div className='relative z-10 container mx-auto px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='mb-20 text-center md:text-left'>
          <h2 className='text-4xl font-black text-white md:text-6xl'>
            Poder Além do <br />
            <span className='bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              Navegador
            </span>
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
          {/* ATUALIZADO: Foco em Processamento Híbrido/API */}
          <BentoCardComponent
            title='Processamento Híbrido'
            desc='Arquitetura inteligente que combina agilidade local com a potência de múltiplas APIs robustas para resultados profissionais.'
            img={IMG_PROCESSAMENTO}
            colSpan='md:col-span-2'
            delay={0.1}
            icon={CloudLightning}
          />
          <BentoCardComponent
            title='Segurança e Controle'
            desc='Seus dados são tratados com protocolos de criptografia de ponta a ponta durante todo o fluxo.'
            img={IMG_SEGURANCA}
            delay={0.2}
            icon={Lock}
          />
          <BentoCardComponent
            title='Design System Pro'
            desc='Interface unificada, temas customizáveis e modo foco imersivo para máxima produtividade.'
            img={IMG_DESIGN}
            delay={0.3}
            icon={Layers}
          />
          <BentoCardComponent
            title='Automação Inteligente'
            desc='Detecta formatos automaticamente e escolhe a melhor rota de processamento (Local ou API) para você.'
            img={IMG_AUTOMACAO}
            colSpan='md:col-span-2'
            delay={0.4}
            icon={Zap}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
