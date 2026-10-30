import { useController, type Control, type FieldValues, type Path } from 'react-hook-form'
import { NumberField } from './NumberField'
import { SegmentedControl } from './SegmentedControl'
import { TextField, type TextFieldProps } from './TextField'

// Champs reliés à react-hook-form : chaque formulaire passe son `control` et le
// nom du champ, l'erreur de validation s'affiche toute seule sous le champ.

interface ControlledProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  hint?: string
}

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  ...props
}: ControlledProps<T> & Omit<TextFieldProps, 'value' | 'onChangeText' | 'label'>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <TextField
      {...props}
      value={field.value ?? ''}
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )
}

export function ControlledNumberField<T extends FieldValues>({ control, name, ...props }: ControlledProps<T>) {
  const { field, fieldState } = useController({ control, name })
  return (
    <NumberField
      {...props}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )
}

export function ControlledSegmentedControl<T extends FieldValues, V extends string>({
  control,
  name,
  label,
  options
}: ControlledProps<T> & { options: { value: V; label: string; description?: string }[] }) {
  const { field } = useController({ control, name })
  return <SegmentedControl label={label} options={options} value={field.value} onChange={field.onChange} />
}
