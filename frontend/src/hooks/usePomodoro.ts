// ============================================================================
// usePomodoro — notre premier HOOK PERSONNALISÉ.
//
// Un hook personnalisé = une fonction "useXxx" qui combine les hooks de base
// (useState, useEffect) pour encapsuler une logique réutilisable. Ici : toute
// la mécanique du minuteur. La page, elle, ne fera QUE de l'affichage —
// même séparation que Controller (affichage) / Service (logique) côté Spring.
//
// Concept nouveau : useEffect. Un composant React est une fonction "pure" :
// props/état en entrée, JSX en sortie. Tout ce qui vit EN DEHORS de ce calcul
// (un setInterval qui bat chaque seconde, un titre d'onglet à changer, un
// son à jouer) est un "effet de bord" — et se déclare dans useEffect.
// ============================================================================

import { useEffect, useState } from 'react';

export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workMin: number;       // durée d'une session de travail (minutes)
  shortBreakMin: number; // pause courte
  longBreakMin: number;  // pause longue (toutes les 4 sessions)
}

const SESSIONS_BEFORE_LONG_BREAK = 4;

// Joue un bip de fin de phase avec l'API audio du navigateur (aucun fichier
// son nécessaire : on génère une onde à 880 Hz qui s'estompe en 0,8 s).
function playBeep() {
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
}

export function usePomodoro(settings: PomodoroSettings) {
  const [phase, setPhase] = useState<Phase>('work');
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(settings.workMin * 60);
  const [completedSessions, setCompletedSessions] = useState(0);

  const durationOf = (p: Phase) =>
    (p === 'work'
      ? settings.workMin
      : p === 'shortBreak'
        ? settings.shortBreakMin
        : settings.longBreakMin) * 60;

  // Passage à la phase suivante (fin naturelle ou bouton "Passer") :
  // travail -> pause (longue toutes les 4 sessions) -> travail -> ...
  const goToNextPhase = () => {
    if (phase === 'work') {
      const done = completedSessions + 1;
      setCompletedSessions(done);
      const next: Phase =
        done % SESSIONS_BEFORE_LONG_BREAK === 0 ? 'longBreak' : 'shortBreak';
      setPhase(next);
      setSecondsLeft(durationOf(next));
    } else {
      setPhase('work');
      setSecondsLeft(durationOf('work'));
    }
  };

  // ---- EFFET 1 : le tic-tac -------------------------------------------
  // Quand isRunning passe à true, on démarre un setInterval qui décrémente
  // secondsLeft chaque seconde. La fonction RETOURNÉE est le "nettoyage" :
  // React l'appelle quand l'effet doit s'arrêter (pause, ou fermeture de la
  // page) — sans elle, l'intervalle continuerait de battre pour toujours.
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      // setSecondsLeft(fonction) plutôt que setSecondsLeft(secondsLeft - 1) :
      // la forme "fonction" reçoit toujours la valeur la plus récente.
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(id); // le nettoyage
  }, [isRunning]); // ne se (re)déclenche que quand isRunning change

  // ---- EFFET 2 : fin de phase ------------------------------------------
  // Surveille le compte à rebours : à zéro, bip + phase suivante.
  useEffect(() => {
    if (secondsLeft > 0) return;
    playBeep();
    goToNextPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  // ---- EFFET 3 : réglages modifiés (minuteur à l'arrêt) ----------------
  // Si l'utilisateur change les durées pendant que le minuteur est arrêté,
  // on met le compte à rebours à jour pour refléter le nouveau réglage.
  useEffect(() => {
    if (!isRunning) setSecondsLeft(durationOf(phase));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.workMin, settings.shortBreakMin, settings.longBreakMin]);

  const reset = () => {
    setIsRunning(false);
    setPhase('work');
    setSecondsLeft(settings.workMin * 60);
    setCompletedSessions(0);
  };

  // Ce que le hook expose à la page : des VALEURS à afficher et des
  // ACTIONS à brancher sur les boutons. Rien d'autre ne sort.
  return {
    phase,
    secondsLeft,
    totalSeconds: durationOf(phase),
    isRunning,
    completedSessions,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    skip: goToNextPhase,
    reset,
  };
}
