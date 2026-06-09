'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full min-h-[500px] bg-black/[0.96] border border-white/[0.08] relative overflow-hidden rounded-xl">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 uppercase tracking-tight">
            Oxyx Market
          </h1>
          <p className="mt-4 text-neutral-400 max-w-lg text-sm md:text-base leading-relaxed">
            Jelajahi pasar API yang luas, alat pengembang canggih, dan integrasi 3D yang imersif untuk meningkatkan performa aplikasi Anda tanpa batasan.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative min-h-[350px] md:min-h-full">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  )
}
