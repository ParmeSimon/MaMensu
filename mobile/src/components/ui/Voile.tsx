import { StyleSheet } from 'react-native'
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg'

// Voile de couleurs en relief : nappes bleu, violet, ciel et rose, traversées
// de plis diagonaux (reflets blancs, creux teintés). Dessiné sur 390 × 844 et
// étiré pour couvrir l'écran. Purement décoratif.

const NAPPES = [
  { id: 'bleu', cx: 80, cy: 50, rx: 280, ry: 230, rgb: '#2563EB', a: 0.6 },
  { id: 'violet', cx: 360, cy: 160, rx: 250, ry: 220, rgb: '#A855F7', a: 0.45 },
  { id: 'ciel', cx: 340, cy: 590, rx: 210, ry: 210, rgb: '#38BDF8', a: 0.4 },
  { id: 'rose', cx: 80, cy: 784, rx: 260, ry: 220, rgb: '#EC4899', a: 0.35 }
]

const PLIS = [
  { id: 'p1', y: 90, h: 150, angle: -24, couleur: '#FFFFFF', a: 0.7 },
  { id: 'p2', y: 215, h: 90, angle: -24, couleur: '#2563EB', a: 0.16 },
  { id: 'p3', y: 380, h: 130, angle: -20, couleur: '#FFFFFF', a: 0.7 },
  { id: 'p4', y: 560, h: 110, angle: -16, couleur: '#A855F7', a: 0.16 },
  { id: 'p5', y: 660, h: 140, angle: -16, couleur: '#FFFFFF', a: 0.7 }
]

export function Voile() {
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
      aria-hidden
    >
      <Defs>
        {NAPPES.map((n) => (
          <RadialGradient key={n.id} id={n.id}>
            <Stop offset="0" stopColor={n.rgb} stopOpacity={n.a} />
            <Stop offset="1" stopColor={n.rgb} stopOpacity={0} />
          </RadialGradient>
        ))}
        {PLIS.map((p) => (
          <LinearGradient key={p.id} id={p.id} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={p.couleur} stopOpacity={0} />
            <Stop offset="0.5" stopColor={p.couleur} stopOpacity={p.a} />
            <Stop offset="1" stopColor={p.couleur} stopOpacity={0} />
          </LinearGradient>
        ))}
      </Defs>
      {NAPPES.map((n) => (
        <Ellipse key={n.id} cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill={`url(#${n.id})`} />
      ))}
      {PLIS.map((p) => (
        <Rect
          key={p.id}
          x={-180}
          y={p.y}
          width={760}
          height={p.h}
          fill={`url(#${p.id})`}
          transform={`rotate(${p.angle} 200 ${p.y + p.h / 2})`}
        />
      ))}
    </Svg>
  )
}
