import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'
import { useLogin } from '../hooks/useAuth'
import { loginSchema, type LoginFormData } from '../schemas/auth.schema'
import * as S from './style'

export function LoginForm() {
  const { mutate, isPending, error } = useLogin()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <S.Form>
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
            autoComplete="password"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={errors.password?.message}
          />
        )}
      />
      {error ? <S.FormError>{getErrorMessage(error, 'Erro ao fazer login')}</S.FormError> : null}
      <Button title="Entrar" onPress={handleSubmit((data) => mutate(data))} loading={isPending} />
    </S.Form>
  )
}
