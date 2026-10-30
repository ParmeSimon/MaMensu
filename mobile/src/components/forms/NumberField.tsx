import { useState } from 'react'
import { TextField, type TextFieldProps } from './TextField'

interface Props extends Omit<TextFieldProps, 'value' | 'onChangeText'> {
  value: number | undefined
  onChange: (value: number | undefined) => void
}

const versTexte = (n: number | undefined) => (n === undefined ? '' : String(n).replace('.', ','))

/** Saisie d'un nombre à la française : la virgule est acceptée (4,20). */
export function NumberField({ value, onChange, ...props }: Props) {
  // Le texte est gardé tel que tapé, pour pouvoir écrire « 4, » avant « 4,2 ».
  const [texte, setTexte] = useState(versTexte(value))

  const changer = (saisie: string) => {
    setTexte(saisie)
    const nombre = Number.parseFloat(saisie.replace(',', '.'))
    onChange(Number.isNaN(nombre) ? undefined : nombre)
  }

  return <TextField keyboardType="decimal-pad" inputMode="decimal" value={texte} onChangeText={changer} {...props} />
}
