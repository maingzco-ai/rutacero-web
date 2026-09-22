import React from 'react';

type MembershipBadgeProps = {
  viajesCompletados: number;
};

const levels = [
  { min: 0, max: 4, label: '🌱 Estudiante Verificado', color: 'bg-gray-200 text-gray-800', next: 5 },
  { min: 5, max: 19, label: '⭐ Miembro RutaPass', color: 'bg-green-100 text-green-800', next: 20 },
  { min: 20, max: Infinity, label: '👑 Embajador Sostenible', color: 'bg-yellow-100 text-yellow-800', next: null },
];

export default function MembershipBadge({ viajesCompletados }: MembershipBadgeProps) {
  const level = levels.find(l => viajesCompletados >= l.min && viajesCompletados <= l.max);
  if (!level) return null; // Should not happen

  const { label, color, next } = level;

  // Progress calculation
  let progressPercent = 0;
  let remainingText = '';
  if (next !== null) {
    const range = next - level.min;
    const progress = viajesCompletados - level.min;
    progressPercent = Math.min((progress / range) * 100, 100);
    const remaining = next - viajesCompletados;
    remainingText = `Faltan ${remaining} viajes para el siguiente nivel`;
  } else {
    progressPercent = 100;
    remainingText = 'Has alcanzado el nivel máximo';
  }

  // Determine gradient based on level for progress bar
  const getProgressBarBg = () => {
    if (viajesCompletados < 5) return 'from-gray-400 to-gray-600';
    if (viajesCompletados < 20) return 'from-green-400 to-green-600';
    return 'from-yellow-400 to-yellow-600';
  };

  return (
    <div className="text-center space-y-3">
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${color} shadow`}>
        {label}
      </div>
      <div className="w-full max-w-xs">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div
            className={`h-2.5 rounded-full ${getProgressBarBg()} transition-all duration-500`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">{remainingText}</p>
      </div>
    </div>
  );
}