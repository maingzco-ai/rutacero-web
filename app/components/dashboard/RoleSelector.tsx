'use client';

import { useCallback } from 'react';
import { CarFront, UserPlus } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/app/lib/design-system';

type Role = 'pasajero' | 'conductor';

interface RoleSelectorProps {
  activeRole: Role;
  onChange: (role: Role) => void;
}

export default function RoleSelector({ activeRole, onChange }: RoleSelectorProps) {
  const roles: { value: Role; icon: React.ReactNode; label: string }[] = [
    { value: 'pasajero', icon: <UserPlus className="h-4 w-4" />, label: 'Pedir Cupo' },
    { value: 'conductor', icon: <CarFront className="h-4 w-4" />, label: 'Ofrecer Cupo' },
  ];

  return (
    <div role="tablist" aria-label="Seleccionar rol" className="flex gap-2">
      {roles.map(({ value, icon, label }) => (
        <Button
          key={value}
          role="tab"
          aria-selected={activeRole === value}
          onClick={() => onChange(value)}
          variant={activeRole === value ? 'primary' : 'secondary'}
          fullWidth
          className="gap-2"
        >
          {icon}
          {label}
        </Button>
      ))}
    </div>
  );
}