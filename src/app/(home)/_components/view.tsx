'use client'

import { FeaturesSectionComponent } from './features'
import { FooterCtaComponent } from './footer-cta'
import { NoiseTexture, SpotlightOverlay } from './global'
import { HeroSectionComponent } from './hero'
import { ToolsShowcaseComponent } from './tools'

export const HomeViewComponent = () => {
  return (
    <div className='min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30 selection:text-purple-200'>
      <main className='min-h-screen bg-slate-950 text-slate-200 selection:bg-purple-500/30 selection:text-purple-200'>
        <SpotlightOverlay />
        <NoiseTexture />
        <HeroSectionComponent />
        <FeaturesSectionComponent />
        <ToolsShowcaseComponent />
        <FooterCtaComponent />
      </main>
    </div>
  )
}
