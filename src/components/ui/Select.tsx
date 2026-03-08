'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder = 'Seleccionar...', label }: SelectProps) {
  const handleValueChange = (newValue: string) => {
    if (newValue === '__clear__') {
      onChange('');
    } else {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <SelectPrimitive.Root value={value || '__clear__'} onValueChange={handleValueChange}>
        <SelectPrimitive.Trigger className="flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent data-[placeholder]:text-gray-400">
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-lg z-50">
            <SelectPrimitive.Viewport className="p-1">
              <SelectPrimitive.Item
                value="__clear__"
                className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none outline-none hover:bg-gray-100 text-gray-500"
              >
                <SelectPrimitive.ItemText>{placeholder}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
              {options.map(option => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="relative flex items-center px-3 py-2 text-sm rounded-sm cursor-pointer select-none outline-none hover:bg-cyan-50 hover:text-cyan-700 data-[highlighted]:bg-cyan-50 data-[highlighted]:text-cyan-700"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                    <Check className="w-4 h-4 text-cyan-600" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}
