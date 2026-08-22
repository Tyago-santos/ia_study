import { AuthCard } from '../components/AuthCard'
import { LoginForm } from '../components/LoginForm'
import * as S from './style'

export function LoginPage() {
  return (
    <AuthCard title="Bem-vindo de volta!" subtitle="Faça login para continuar seus estudos">
      <LoginForm />
      <S.Footer>
        Não tem uma conta? <S.FooterLink href="/(auth)/cadastro">Cadastre-se</S.FooterLink>
      </S.Footer>
    </AuthCard>
  )
}
