import { Lottie } from 'lottie-react'
import { logoAuraAnimation } from '@/shared/assets/logoAura'

interface AnimatedLogoProps {
  /** Tamanho do quadrado (o PNG ocupa ~70% e a aura transborda). */
  size?: number
  className?: string
}

/**
 * Logomarca do Gnosis IA com aura animada por tras (Lottie): ondas
 * concentricas + pontos girando. O PNG da marca fica por cima, com um
 * "float" suave de CSS. A aura e' decorativa, entao fica aria-hidden.
 */
export function AnimatedLogo({ size = 36, className }: AnimatedLogoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      {/* aura Lottie — transborda o quadro de proposito */}
      <span
        className="pointer-events-none absolute -inset-[35%] opacity-80"
        aria-hidden="true"
      >
        <Lottie src={logoAuraAnimation} loop autoplay />
      </span>

      {/* a marca em si, flutuando de leve */}
      <img
        src="/gnosis-mark-transparent.png"
        alt="Gnosis IA"
        className="relative animate-logo-float rounded-xl object-contain"
        style={{ width: size, height: size }}
      />
    </span>
  )
}
