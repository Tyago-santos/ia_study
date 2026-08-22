import { AuthCard } from '../components/AuthCard'
import { RegisterForm } from '../components/RegisterForm'
import * as S from './style'

export function RegisterPage() {
  return (
    <AuthCard title="Crie sua conta" subtitle="Comece a organizar seus estudos agora">
      <RegisterForm />
      <S.Footer>
        Já tem uma conta? <S.FooterLink href="/(auth)/login">Entrar</S.FooterLink>
      </S.Footer>
    </AuthCard>
  )
}
