import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/components/ui'
import { PENDING_BACKEND_HINT } from '@/shared/constants/pendingFeature'
import { useLogin } from '@/features/auth/hooks/useAuth'
import { loginSchema, type LoginFormData } from '@/features/auth/schemas/auth.schema'

export function LoginForm() {
  const loginMutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        id="email"
        placeholder="seu@email.com"
        className="h-12 rounded-xl bg-[var(--bg-secondary)]"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Senha"
        type="password"
        id="password"
        placeholder="••••••••"
        className="h-12 rounded-xl bg-[var(--bg-secondary)]"
        error={errors.password?.message}
        {...register('password')}
      />
      {/*
        A caixa "Lembrar de mim" foi removida: a sessao já persiste sempre, entao
        ela oferecia uma escolha que nao existe. Recuperacao de senha é prometida
        pelo spec e ainda nao tem backend, por isso fica visivel e desabilitada.
      */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          disabled
          title={`Recuperação de senha: ${PENDING_BACKEND_HINT.toLowerCase()}`}
          className="text-sm font-medium text-tertiary-400 hover:text-tertiary-300 cursor-not-allowed opacity-60"
        >
          Esqueceu a senha?
        </button>
      </div>
      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 font-semibold text-white hover:shadow-lg hover:shadow-primary-500/40"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
