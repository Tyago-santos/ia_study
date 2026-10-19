interface AnimatedLogoProps {
  /** Tamanho do quadrado. */
  size?: number
  className?: string
}

/**
 * Logomarca do Gnosis IA. A aura animada (Lottie) foi removida por
 * pedido — fica apenas a marca, com um "float" suave de CSS.
 */
export function AnimatedLogo({ size = 36, className }: AnimatedLogoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
    >
      {/* a marca em si, flutuando de leve */}
      <img
        src="/gnosis-mark.svg"
        alt="Gnosis IA"
        className="relative animate-logo-float rounded-xl object-contain"
        style={{ width: size, height: size }}
      />
    </span>
  )
}
