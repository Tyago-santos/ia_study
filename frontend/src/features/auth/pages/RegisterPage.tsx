import { Link } from '@tanstack/react-router'
import { AuthCard } from '../components/AuthCard'
import { RegisterForm } from '../components/RegisterForm'
import { SocialAuthButtons } from '../components/SocialAuthButtons'

export function RegisterPage() {
  return (
    <AuthCard title="Crie sua conta" subtitle="Comece a estudar de forma inteligente">
      <RegisterForm />
      <SocialAuthButtons label="Ou cadastre-se com" />

      <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-[var(--accent-text)] font-medium hover:underline">
          Faça login
        </Link>
      </p>
    </AuthCard>
  )
}
