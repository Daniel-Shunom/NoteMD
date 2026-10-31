import React from 'react';

export interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bg: string;
  borderColor: string;
}