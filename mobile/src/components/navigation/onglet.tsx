import { Ionicons } from '@expo/vector-icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useRef, type ComponentProps, type ReactNode } from 'react'
import { Pressable, StyleSheet, View, type LayoutRectangle } from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type WithSpringConfig
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppText } from '@/components/ui'
import { colors, gradients, radius, spacing } from '@/theme'

type Icone = ComponentProps<typeof Ionicons>['name']

/** Options d'un onglet de la barre du bas : titre et icône. */
export function onglet(title: string, icone: Icone) {
  return {
    title,
    tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={icone} color={color} size={size} />
  }
}

export const optionsBarreOnglets = { headerShown: false }

const HAUTEUR = 64
/** Au-delà, la capsule ne s'étire plus (tablettes, web) : elle reste centrée. */
const LARGEUR_MAX = 480

/** Un ressort vif mais sans rebond excessif, partagé par la pilule et les onglets. */
const RESSORT: WithSpringConfig = { damping: 18, stiffness: 190, mass: 0.9 }
const TRANSITION = LinearTransition.springify().damping(18).stiffness(190).mass(0.9)

/** Place à laisser libre en bas des écrans pour que la capsule ne cache rien. */
export function useEspaceBarre() {
  const { bottom } = useSafeAreaInsets()
  return HAUTEUR + Math.max(bottom, spacing.md) + spacing.sm
}

/**
 * Barre d'onglets en capsule flottante : verre cerclé d'un liseré en dégradé.
 * L'onglet actif s'élargit pour montrer son libellé, et la pilule bleue glisse
 * jusqu'à lui en suivant sa nouvelle place. La capsule ne dépasse jamais la
 * largeur de l'écran : sur un petit téléphone, les icônes se resserrent.
 */
export function BarreOnglets({ state, descriptors, navigation }: BottomTabBarProps) {
  const { bottom } = useSafeAreaInsets()
  const places = useRef<LayoutRectangle[]>([])
  const x = useSharedValue(0)
  const largeur = useSharedValue(0)
  const visible = useSharedValue(0)

  // Premier placement sans animation, puis la pilule glisse d'un onglet à l'autre.
  const placerPilule = (index: number) => {
    const place = places.current[index]
    if (!place) return
    if (visible.value === 0) {
      x.value = place.x
      largeur.value = place.width
      visible.value = 1
    } else {
      x.value = withSpring(place.x, RESSORT)
      largeur.value = withSpring(place.width, RESSORT)
    }
  }

  useEffect(() => placerPilule(state.index), [state.index])

  const stylePilule = useAnimatedStyle(() => ({
    opacity: visible.value,
    width: largeur.value,
    transform: [{ translateX: x.value }]
  }))

  return (
    <View style={[styles.position, { bottom: Math.max(bottom, spacing.md) }]} pointerEvents="box-none">
      <LinearGradient colors={gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.lisere}>
        <View style={styles.capsule} accessibilityRole="tablist">
          <Animated.View style={[styles.pilule, stylePilule]} pointerEvents="none">
            <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.degrade} />
          </Animated.View>

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key]!
            const actif = state.index === index
            const label = options.title ?? route.name

            const appuyer = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
              if (!actif && !event.defaultPrevented) navigation.navigate(route.name, route.params)
            }

            return (
              <Onglet
                key={route.key}
                actif={actif}
                label={label}
                onPress={appuyer}
                onPlace={(place) => {
                  places.current[index] = place
                  if (actif) placerPilule(index)
                }}
                icone={options.tabBarIcon?.({ focused: actif, color: actif ? colors.white : colors.textMuted, size: 22 })}
              />
            )
          })}
        </View>
      </LinearGradient>
    </View>
  )
}

interface PropsOnglet {
  actif: boolean
  label: string
  icone: ReactNode
  onPress: () => void
  onPlace: (place: LayoutRectangle) => void
}

/** Un onglet : s'enfonce au toucher, s'élargit et révèle son libellé quand il devient actif. */
function Onglet({ actif, label, icone, onPress, onPlace }: PropsOnglet) {
  const echelle = useSharedValue(1)
  const styleEchelle = useAnimatedStyle(() => ({ transform: [{ scale: echelle.value }] }))

  return (
    <Animated.View
      layout={TRANSITION}
      onLayout={(e) => onPlace(e.nativeEvent.layout)}
      style={actif ? styles.zoneActive : styles.zoneInactive}
    >
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: actif }}
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={() => (echelle.value = withSpring(0.9, RESSORT))}
        onPressOut={() => (echelle.value = withSpring(1, RESSORT))}
      >
        <Animated.View style={[styles.onglet, actif && styles.ongletActif, styleEchelle]}>
          {/* Changer de clé rejoue le fondu : l'icône passe en douceur du gris au blanc. */}
          <Animated.View key={actif ? 'actif' : 'inactif'} entering={FadeIn.duration(220)}>
            {icone}
          </Animated.View>
          {actif ? (
            <Animated.View entering={FadeIn.delay(90).duration(220)} exiting={FadeOut.duration(90)} style={styles.libelle}>
              <AppText variant="label" color="white" numberOfLines={1} maxFontSizeMultiplier={1.2}>
                {label}
              </AppText>
            </Animated.View>
          ) : null}
        </Animated.View>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  position: { position: 'absolute', left: spacing.lg, right: spacing.lg, alignItems: 'center' },
  lisere: {
    width: '100%',
    maxWidth: LARGEUR_MAX,
    borderRadius: radius.full,
    padding: 1,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8
  },
  capsule: {
    height: HAUTEUR - 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.92)'
  },
  pilule: {
    position: 'absolute',
    top: 6,
    left: 0,
    height: 50,
    borderRadius: radius.full,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 }
  },
  degrade: { ...StyleSheet.absoluteFillObject, borderRadius: radius.full },
  // L'onglet actif garde sa largeur naturelle mais peut rétrécir (libellé coupé) ;
  // les autres se partagent le reste, entre 40 et 48 px.
  zoneActive: { flexShrink: 1, minWidth: 0 },
  zoneInactive: { flexShrink: 1, width: 48, minWidth: 40 },
  onglet: { width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  ongletActif: { width: 'auto', paddingLeft: spacing.lg, paddingRight: 18 },
  libelle: { flexShrink: 1 }
})

/** À passer tel quel à `<Tabs tabBar={…}>`. */
export const renduBarreOnglets = (props: BottomTabBarProps) => <BarreOnglets {...props} />
