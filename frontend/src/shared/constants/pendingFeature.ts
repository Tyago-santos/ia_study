/**
 * Texto unico para controles cuja funcionalidade depende do backend que ainda
 * nao existe (ver `.env.example`).
 *
 * A regra: um controle nessas condicoes fica desabilitado e explica o motivo.
 * Aceitar o clique e nao fazer nada é pior que a ausencia do recurso — o usuario
 * passa a desconfiar de todos os outros botoes.
 */
export const PENDING_BACKEND_HINT = 'Disponível quando o servidor estiver conectado'
