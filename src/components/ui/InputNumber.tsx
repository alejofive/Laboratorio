'use client';

import { useState, useEffect } from 'react';

interface InputNumberProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function InputNumber({ label, value, onChange, placeholder }: InputNumberProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
      />
    </div>
  );
}
