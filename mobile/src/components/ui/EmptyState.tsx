import { StyleSheet, View } from 'react-native'
import { spacing } from '@/theme'
import { AppText } from './AppText'
import { Button } from './Button'

interface Props {
  title: string
  description: string
  action?: { label: string; onPress: () => void }
}

/** Écran vide : dit ce qui manque et propose l'action qui le remplit. */
export function EmptyState({ title, description, action }: Props) {
  return (
    <View style={styles.root}>
      <AppText variant="heading">{title}</AppText>
      <AppText color="textMuted">{description}</AppText>
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { gap: spacing.md, paddingVertical: spacing.xl }
})
