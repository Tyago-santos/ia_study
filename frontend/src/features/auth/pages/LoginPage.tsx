import { Link } from '@tanstack/react-router'
import { AuthCard } from '../components/AuthCard'
import { LoginForm } from '../components/LoginForm'
import { SocialAuthButtons } from '../components/SocialAuthButtons'

export function LoginPage() {
  return (
    <AuthCard title="Bem-vindo de volta!" subtitle="Faça login para continuar seus estudos">
      <LoginForm />
      <SocialAuthButtons label="Ou continue com" />

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-[var(--accent-text)] font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
    </AuthCard>
  )
}
