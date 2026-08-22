import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { useRegister } from '../hooks/useAuth'
import { registerSchema, type RegisterFormData } from '../schemas/auth.schema'
import * as S from './style'

export function RegisterForm() {
  const { mutate, isPending, error } = useRegister()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  return (
    <S.Form>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            label="Nome completo"
            autoComplete="name"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="Email"
            keyboardType="email-address"
            autoComplete="email"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Senha"
            secureTextEntry
            autoComplete="password-new"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <Input
            label="Confirme sua senha"
            secureTextEntry
            autoComplete="password-new"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.confirmPassword?.message}
          />
        )}
      />
      {error ? <S.FormError>{getErrorMessage(error, 'Erro ao criar conta')}</S.FormError> : null}
      <Button
        title="Criar conta"
        onPress={handleSubmit((data) => mutate(data))}
        loading={isPending}
      />
    </S.Form>
  )
}
