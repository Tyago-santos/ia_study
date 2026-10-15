/**
 * Aura animada da logomarca do Gnosis IA (formato Lottie).
 *
 * Fica atras do PNG da marca: ondas concentricas que sobem e somem (ripple)
 * mais um anel de pontos girando. Tudo em loop perfeito dentro de 120 frames
 * (2s a 60fps) — as ondas comecam e terminam com opacidade 0, entao a
 * virada do loop passa despercebida.
 *
 * Cor base: verde do tema (primary-500 #22c55e).
 */
export const logoAuraAnimation = {
  v: '5.7.4',
  fr: 60,
  ip: 0,
  op: 120,
  w: 200,
  h: 200,
  nm: 'gnosis-aura',
  ddd: 0,
  assets: [],
  layers: [
    // --- ondas concentricas (ripple) ---
    rippleRing(1, 64, 0),
    rippleRing(2, 64, 40),
    rippleRing(3, 64, 80),
    // --- pontos girando em volta ---
    orbitDots(4),
  ],
}

/**
 * Uma onda: anel com contorno que cresce e some. `delay` desloca a fase em
 * frames pra as tres ondas se revezarem.
 */
function rippleRing(ind: number, radius: number, delay: number) {
  // janela da onda (100 frames) com o delay aplicado, sempre dentro do loop
  const start = delay
  const fadeIn = delay + 12
  const end = delay + 100

  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: `ring-${ind}`,
    sr: 1,
    ks: {
      o: {
        a: 1,
        k: [
          key(start, [0], [100]),
          key(fadeIn, [100], [0]),
          key(Math.min(end, 120), [0], [0]),
        ],
      },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1,
        k: [
          key(start, [55, 55, 100], [100, 100, 100]),
          key(Math.min(end, 120), [100, 100, 100], [100, 100, 100]),
        ],
      },
    },
    ao: 0,
    shapes: [
      {
        ty: 'gr',
        it: [
          { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [radius, radius] } },
          {
            ty: 'st',
            c: { a: 0, k: [0.133, 0.772, 0.369, 1] },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 2 },
            lc: 2,
            lj: 2,
          },
          {
            ty: 'tr',
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
          },
        ],
      },
    ],
    ip: 0,
    op: 120,
    st: 0,
  }
}

/** Anel de 6 pontos girando 360 graus — loop perfeito (0 -> 360). */
function orbitDots(ind: number) {
  const dots = [0, 60, 120, 180, 240, 300].map((angle) => {
    const rad = (angle * Math.PI) / 180
    const x = Math.cos(rad) * 84
    const y = Math.sin(rad) * 84
    return { ty: 'el', p: { a: 0, k: [x, y] }, s: { a: 0, k: [7, 7] } }
  })

  return {
    ddd: 0,
    ind,
    ty: 4,
    nm: 'orbit',
    sr: 1,
    ks: {
      o: { a: 0, k: 90 },
      r: {
        a: 1,
        k: [
          { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
          { t: 120, s: [360] },
        ],
      },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    shapes: [
      {
        ty: 'gr',
        it: [
          ...dots,
          {
            ty: 'tr',
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
          },
        ],
      },
      {
        ty: 'fl',
        c: { a: 0, k: [0.133, 0.772, 0.369, 1] },
        o: { a: 0, k: 100 },
      },
    ],
    ip: 0,
    op: 120,
    st: 0,
  }
}

/** Monta um keyframe Lottie (formato "t/s/e" com easing suave). */
function key(t: number, s: number[], e: number[]) {
  return {
    i: { x: [0.4], y: [1] },
    o: { x: [0.6], y: [0] },
    t,
    s,
    e,
  }
}
