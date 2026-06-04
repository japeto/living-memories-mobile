/* ============================================================
   Icon — line set ported to react-native-svg
   (same paths as components.jsx, rounded stroke)
   Usage: <Icon name="mic" size={26} color={theme.colors.primary} />
   ============================================================ */
import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

export type IconName =
  | 'mic' | 'home' | 'book' | 'heart' | 'bell' | 'user' | 'lock' | 'mail'
  | 'eye' | 'eyeoff' | 'arrow' | 'back' | 'check' | 'plus' | 'family'
  | 'stetho' | 'leaf' | 'sun' | 'quote' | 'play' | 'clock' | 'info' | 'chevron-right';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;       // ≈ stroke
  strokeWidth?: number; // ≈ sw
  fill?: string;
}

export function Icon({
  name,
  size = 26,
  color = '#000',
  strokeWidth = 2,
  fill = 'none',
}: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill,
  };

  const body: Record<IconName, React.ReactNode> = {
    mic: (
      <>
        <Rect x={9} y={2} width={6} height={12} rx={3} {...common} />
        <Path d="M5 11a7 7 0 0 0 14 0" {...common} />
        <Path d="M12 18v4" {...common} />
      </>
    ),
    home: (
      <>
        <Path d="M3 11l9-8 9 8" {...common} />
        <Path d="M5 10v10h14V10" {...common} />
      </>
    ),
    book: (
      <>
        <Path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" {...common} />
        <Path d="M4 19a2 2 0 0 1 2-2h12" {...common} />
      </>
    ),
    heart: <Path d="M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9z" {...common} />,
    bell: (
      <>
        <Path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" {...common} />
        <Path d="M10 19a2 2 0 0 0 4 0" {...common} />
      </>
    ),
    user: (
      <>
        <Circle cx={12} cy={8} r={4} {...common} />
        <Path d="M4 21a8 8 0 0 1 16 0" {...common} />
      </>
    ),
    lock: (
      <>
        <Rect x={4} y={10} width={16} height={11} rx={2.5} {...common} />
        <Path d="M8 10V7a4 4 0 0 1 8 0v3" {...common} />
      </>
    ),
    mail: (
      <>
        <Rect x={3} y={5} width={18} height={14} rx={2.5} {...common} />
        <Path d="M3.5 7l8.5 6 8.5-6" {...common} />
      </>
    ),
    eye: (
      <>
        <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" {...common} />
        <Circle cx={12} cy={12} r={3} {...common} />
      </>
    ),
    eyeoff: (
      <>
        <Path d="M3 3l18 18" {...common} />
        <Path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" {...common} />
        <Path d="M9.4 5.2A10 10 0 0 1 12 5c6 0 10 7 10 7a18 18 0 0 1-3.2 3.9M6.3 6.3A18 18 0 0 0 2 12s4 7 10 7a10 10 0 0 0 3-.5" {...common} />
      </>
    ),
    arrow: (
      <>
        <Path d="M5 12h14" {...common} />
        <Path d="M13 6l6 6-6 6" {...common} />
      </>
    ),
    back: (
      <>
        <Path d="M19 12H5" {...common} />
        <Path d="M11 6l-6 6 6 6" {...common} />
      </>
    ),
    check: <Path d="M5 12l5 5 9-10" {...common} />,
    plus: (
      <>
        <Path d="M12 6v12" {...common} />
        <Path d="M6 12h12" {...common} />
      </>
    ),
    family: (
      <>
        <Circle cx={8} cy={8} r={3} {...common} />
        <Circle cx={16} cy={9} r={2.5} {...common} />
        <Path d="M3 20a5 5 0 0 1 10 0" {...common} />
        <Path d="M14 20a4 4 0 0 1 7-2.7" {...common} />
      </>
    ),
    stetho: (
      <>
        <Path d="M5 3v5a4 4 0 0 0 8 0V3" {...common} />
        <Path d="M9 16v1a4 4 0 0 0 8 0v-2" {...common} />
        <Circle cx={18} cy={11} r={2.5} {...common} />
      </>
    ),
    leaf: (
      <>
        <Path d="M5 19c0-8 6-13 14-13 0 8-5 14-14 14" {...common} />
        <Path d="M5 19c2-4 5-6 9-7" {...common} />
      </>
    ),
    sun: (
      <>
        <Circle cx={12} cy={12} r={4} {...common} />
        <Path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" {...common} />
      </>
    ),
    quote: <Path d="M7 7H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2V9M17 7h-2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2V9" {...common} />,
    play: <Path d="M7 4v16l13-8z" fill={color} stroke="none" />,
    clock: (
      <>
        <Circle cx={12} cy={12} r={9} {...common} />
        <Path d="M12 7v5l3 2" {...common} />
      </>
    ),
    info: (
      <>
        <Circle cx={12} cy={12} r={10} {...common} />
        <Path d="M12 16v-4" {...common} />
        <Path d="M12 8h.01" {...common} />
      </>
    ),
    'chevron-right': (
      <Path d="M9 18l6-6-6-6" {...common} />
    ),
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {body[name]}
    </Svg>
  );
}
