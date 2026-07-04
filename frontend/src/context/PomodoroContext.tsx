// ============================================================================
// PomodoroContext — LE MINUTEUR GLOBAL de l'app (un seul à la fois).
//
// Pourquoi un "Context" ? Pour qu'UN même minuteur soit accessible partout :
// la page Pomodoro, le hub d'un programme, et la pastille flottante partagent
// tous cet état. Le minuteur continue donc de tourner quand on navigue.
//
// Robustesse au changement de fenêtre : on ne décrémente pas un compteur
// seconde par seconde (les navigateurs ralentissent ça en arrière-plan). On
// mémorise l'HEURE DE FIN de la phase (endTimeRef) et on recalcule le temps
// restant à partir de l'horloge réelle (Date.now()). Même si l'onglet dort,
// au réveil le calcul est exact.
// ============================================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createSession } from '../api/pomodoroSessions';

export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workMin: number;
  shortBreakMin: number;
  longBreakMin: number;
}

// À quoi le minuteur est rattaché : un programme (les sessions y sont comptées)
// ou rien (mode libre / révision spontanée).
export interface AttachedProgramme {
  id: number;
  name: string;
}

const SESSIONS_BEFORE_LONG_BREAK = 4;
const DEFAULT_SETTINGS: PomodoroSettings = { workMin: 25, shortBreakMin: 5, longBreakMin: 15 };

// Bip de fin de phase (onde à 880 Hz, sans fichier son).
function playBeep() {
  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.8);
  } catch {
    // AudioContext peut être bloqué tant que l'utilisateur n'a pas interagi
  }
}

interface PomodoroContextValue {
  phase: Phase;
  secondsLeft: number;
  totalSeconds: number;
  isRunning: boolean;
  completedSessions: number;
  isIdle: boolean; // minuteur "neuf" : à l'arrêt, phase travail, remis à zéro
  settings: PomodoroSettings;
  setSettings: (s: PomodoroSettings) => void;
  attached: AttachedProgramme | null;
  attachToProgramme: (p: AttachedProgramme | null) => void;
  focusMode: boolean; // affichage plein écran (mode concentration)
  setFocusMode: (on: boolean) => void;
  start: () => void;
  pause: () => void;
  skip: () => void;
  reset: () => void;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

// Hook d'accès au minuteur global depuis n'importe quel composant.
export function usePomodoroTimer(): PomodoroContextValue {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoroTimer doit être utilisé dans <PomodoroProvider>');
  return ctx;
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<Phase>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SETTINGS.workMin * 60);
  const [attached, setAttached] = useState<AttachedProgramme | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  // endTimeRef : horodatage (ms) de fin de la phase en cours quand ça tourne.
  const endTimeRef = useRef<number | null>(null);

  // Miroirs des valeurs dans des refs : utilisables dans l'intervalle sans
  // capturer des valeurs périmées (closures).
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const completedRef = useRef(completedSessions);
  completedRef.current = completedSessions;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const attachedRef = useRef(attached);
  attachedRef.current = attached;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;
  const secondsLeftRef = useRef(secondsLeft);
  secondsLeftRef.current = secondsLeft;

  const durationOf = useCallback(
    (p: Phase, s: PomodoroSettings = settingsRef.current) =>
      (p === 'work' ? s.workMin : p === 'shortBreak' ? s.shortBreakMin : s.longBreakMin) * 60,
    [],
  );

  const totalSeconds = durationOf(phase, settings);
  const isIdle =
    !isRunning && completedSessions === 0 && phase === 'work' &&
    secondsLeft === durationOf('work', settings);

  // Passage à la phase suivante. fromNaturalEnd = true si le compte à rebours
  // est arrivé à zéro (≠ bouton "Passer") → dans ce cas on enregistre la session.
  const advance = useCallback(
    (fromNaturalEnd: boolean) => {
      const current = phaseRef.current;

      if (current === 'work') {
        if (fromNaturalEnd) {
          // Enregistrement de la session de travail terminée
          const minutes = settingsRef.current.workMin;
          const prog = attachedRef.current;
          createSession(minutes, prog?.id)
            .then(() => {
              if (prog?.id) {
                queryClient.invalidateQueries({ queryKey: ['sessions', prog.id] });
              }
            })
            .catch(() => {});
        }
        const done = completedRef.current + 1;
        completedRef.current = done;
        setCompletedSessions(done);
        const next: Phase = done % SESSIONS_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak';
        phaseRef.current = next;
        setPhase(next);
        const secs = durationOf(next);
        secondsLeftRef.current = secs;
        setSecondsLeft(secs);
        if (isRunningRef.current) endTimeRef.current = Date.now() + secs * 1000;
      } else {
        phaseRef.current = 'work';
        setPhase('work');
        const secs = durationOf('work');
        secondsLeftRef.current = secs;
        setSecondsLeft(secs);
        if (isRunningRef.current) endTimeRef.current = Date.now() + secs * 1000;
      }
    },
    [durationOf, queryClient],
  );

  // ---- Boucle d'affichage (robuste à l'arrière-plan) -------------------
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      const end = endTimeRef.current;
      if (end == null) return;
      const left = Math.max(0, Math.round((end - Date.now()) / 1000));
      secondsLeftRef.current = left;
      setSecondsLeft(left);
      if (left <= 0) {
        playBeep();
        advance(true); // fin naturelle → enregistre la session si phase travail
      }
    };
    const id = setInterval(tick, 500);
    // Recalcule immédiatement au retour sur l'onglet (rattrape le temps écoulé)
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    tick();
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [isRunning, advance]);

  // Titre de l'onglet = temps restant (visible même sur un autre onglet)
  useEffect(() => {
    if (isRunning) {
      const m = Math.floor(secondsLeft / 60);
      const s = secondsLeft % 60;
      document.title = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} — StudyMate`;
    } else {
      document.title = 'StudyMate';
    }
  }, [secondsLeft, isRunning]);

  // Réglages modifiés à l'arrêt → on met à jour le temps affiché
  useEffect(() => {
    if (!isRunningRef.current) {
      const secs = durationOf(phaseRef.current);
      secondsLeftRef.current = secs;
      setSecondsLeft(secs);
    }
  }, [settings.workMin, settings.shortBreakMin, settings.longBreakMin, durationOf]);

  const start = useCallback(() => {
    endTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (endTimeRef.current != null) {
      const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      secondsLeftRef.current = left;
      setSecondsLeft(left);
    }
    endTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const skip = useCallback(() => {
    advance(false); // passage manuel : pas d'enregistrement de session
  }, [advance]);

  const reset = useCallback(() => {
    setIsRunning(false);
    endTimeRef.current = null;
    phaseRef.current = 'work';
    setPhase('work');
    completedRef.current = 0;
    setCompletedSessions(0);
    const secs = durationOf('work');
    secondsLeftRef.current = secs;
    setSecondsLeft(secs);
  }, [durationOf]);

  const attachToProgramme = useCallback((p: AttachedProgramme | null) => {
    setAttached(p);
  }, []);

  const value: PomodoroContextValue = {
    phase,
    secondsLeft,
    totalSeconds,
    isRunning,
    completedSessions,
    isIdle,
    settings,
    setSettings,
    attached,
    attachToProgramme,
    focusMode,
    setFocusMode,
    start,
    pause,
    skip,
    reset,
  };

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}
