import React, { cloneElement } from 'react';
import { useMagnetic } from '../../hooks/useMagnetic';

export default function Magnetic({ children, strength = 50 }) {
  const magneticRef = useMagnetic({ strength });

  return cloneElement(children, { ref: magneticRef });
}
