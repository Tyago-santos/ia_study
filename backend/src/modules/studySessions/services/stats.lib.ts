import type { StudySession } from "@/generated/prisma/client.js";

/**
 * Agregacoes puras sobre sessoes de estudo — dashboard, serie diaria e
 * sequencia de dias. Espelha a logica que vivia so' no app (dataStore.ts);
 * a diferenca e' que agora e' o backend que tem a lista completa de sessoes
 * do usuario, entao o calculo pode viver num lugar so'.
 */

export interface DailyStats {
  date: string;
  minutes: number;
  pomodoros: number;
}

export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  totalMinutes: number;
  sessions: number;
}

interface DayTotals {
  minutes: number;
  pomodoros: number;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/** Chave "AAAA-MM-DD" no fuso do servidor — mesma regra do app (ver dataStore.ts). */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function totalsByDay(sessions: StudySession[]): Map<string, DayTotals> {
  const totals = new Map<string, DayTotals>();

  for (const session of sessions) {
    const key = dayKey(session.completedAt);
    const current = totals.get(key) ?? { minutes: 0, pomodoros: 0 };

    totals.set(key, {
      minutes: current.minutes + session.duration,
      pomodoros: current.pomodoros + (session.type === "pomodoro" ? 1 : 0),
    });
  }

  return totals;
}

/** Serie diaria continua terminando hoje — dias sem estudo entram zerados. */
function series(totals: Map<string, DayTotals>, days: number): DailyStats[] {
  const result: DailyStats[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() - (days - 1));

  for (let i = 0; i < days; i++) {
    const key = dayKey(cursor);
    const totalsOfDay = totals.get(key) ?? { minutes: 0, pomodoros: 0 };
    result.push({ date: key, ...totalsOfDay });
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
}

/**
 * Dias seguidos de estudo contados de tras para frente. O dia de hoje nao
 * quebra a sequencia enquanto ainda esta em aberto.
 */
function streakOf(totals: Map<string, DayTotals>): number {
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!totals.get(dayKey(cursor))?.minutes) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (totals.get(dayKey(cursor))?.minutes) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function sumMinutes(days: DailyStats[]): number {
  return days.reduce((total, day) => total + day.minutes, 0);
}

export interface DashboardStats {
  todayMinutes: number;
  weekMinutes: number;
  monthMinutes: number;
  streak: number;
}

export function dashboardStats(sessions: StudySession[]): DashboardStats {
  const totals = totalsByDay(sessions);

  return {
    todayMinutes: totals.get(dayKey(new Date()))?.minutes ?? 0,
    weekMinutes: sumMinutes(series(totals, 7)),
    monthMinutes: sumMinutes(series(totals, 30)),
    streak: streakOf(totals),
  };
}

export function weeklySeries(sessions: StudySession[]): DailyStats[] {
  return series(totalsByDay(sessions), 7);
}

const CALENDAR_WEEKS = 20;

/** Serie diaria comecando num domingo, terminando hoje — cada coluna de 7 no
 * app vira uma semana inteira (ver `toWeeks` no cliente). */
export function contributionsSeries(sessions: StudySession[]): DailyStats[] {
  const totals = totalsByDay(sessions);
  const daysIntoWeek = new Date().getDay();
  return series(totals, (CALENDAR_WEEKS - 1) * 7 + daysIntoWeek + 1);
}

export function pomodoroStats(sessions: StudySession[]): { totalPomodoros: number } {
  return { totalPomodoros: sessions.filter((s) => s.type === "pomodoro").length };
}

export function subjectStats(sessions: StudySession[]): SubjectStats[] {
  const totals = new Map<string, SubjectStats>();

  for (const session of sessions) {
    const key = session.subjectId ?? "sem-materia";
    const current = totals.get(key) ?? {
      subjectId: key,
      subjectName: session.subjectName ?? "Sem matéria",
      totalMinutes: 0,
      sessions: 0,
    };

    totals.set(key, {
      ...current,
      totalMinutes: current.totalMinutes + session.duration,
      sessions: current.sessions + 1,
    });
  }

  return [...totals.values()].sort((a, b) => b.totalMinutes - a.totalMinutes);
}
