/** Shared combat tuning — single source for Player + GameplayScene */

export const COMBAT_CONFIG = {
  comboTimeoutMs: 1400,
  maxCombo: 5,
  finisherAtCombo: 5,

  dashDurationMs: 220,
  dashCooldownMs: 550,
  dashSpeed: 2100,
  dashIFramesMs: 280,
  airDashAllowed: true,

  attackBufferMs: 200,
  dashBufferMs: 160,
  jumpBufferMs: 150,

  attackCooldownMs: 260,
  finisherCooldownMs: 520,
  chargedAttackCooldownMs: 580,

  hitstopLightMs: 55,
  hitstopMediumMs: 85,
  hitstopHeavyMs: 120,
  hitstopFinisherMs: 155,
  hitstopBossMs: 95,

  cancelWindowAfterMs: 140,
  comboFinisherZoom: 1.06,
  comboFinisherZoomDurationMs: 220,

  enemyTelegraphMs: 380,
  enemyComboStaggerThreshold: 3,
  enemyComboStaggerWindowMs: 900,
  playerHitGraceMs: 520,
} as const;

export type ComboStep = 0 | 1 | 2 | 3 | 4;

export function comboStepIndex(comboCount: number): ComboStep {
  return ((comboCount - 1) % 3) as ComboStep;
}

export function isFinisherCombo(comboCount: number): boolean {
  return comboCount >= COMBAT_CONFIG.finisherAtCombo;
}

export function getHitstopMs(opts: {
  comboCount?: number;
  isCritical?: boolean;
  isFinisher?: boolean;
  isBoss?: boolean;
}): number {
  const { comboCount = 1, isCritical = false, isFinisher = false, isBoss = false } = opts;
  if (isFinisher) return COMBAT_CONFIG.hitstopFinisherMs;
  if (isBoss && isCritical) return COMBAT_CONFIG.hitstopBossMs;
  if (isCritical) return COMBAT_CONFIG.hitstopHeavyMs;
  if (comboCount >= 4) return COMBAT_CONFIG.hitstopMediumMs;
  return COMBAT_CONFIG.hitstopLightMs;
}

export function canCancelAttackIntoDash(attackElapsedMs: number, isAttacking: boolean): boolean {
  return isAttacking && attackElapsedMs >= COMBAT_CONFIG.cancelWindowAfterMs;
}

export function getComboLungeSpeed(step: ComboStep, facingRight: boolean): { vx: number; vy: number } {
  const dir = facingRight ? 1 : -1;
  switch (step) {
    case 0:
      return { vx: dir * 200, vy: 0 };
    case 1:
      return { vx: dir * 140, vy: -150 };
    case 2:
      return { vx: dir * 280, vy: -40 };
    default:
      return { vx: dir * 220, vy: 0 };
  }
}
