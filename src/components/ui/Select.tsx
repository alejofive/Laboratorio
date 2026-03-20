'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check, Pencil, X } from 'lucide-react';
import { useState, useRef } from 'react';

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
  readOnly?: boolean;
  onLabelChange?: (newLabel: string) => void;
}

export function Select({ value, onChange, options, placeholder = 'Seleccionar...', label, readOnly = false, onLabelChange }: SelectProps) {
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelEditValue, setLabelEditValue] = useState(label || '');
  const labelInputRef = useRef<HTMLInputElement>(null);

  const handleValueChange = (newValue: string) => {
    if (readOnly) {
      return;
    }
    if (newValue === '__clear__') {
      onChange('');
    } else {
      onChange(newValue);
    }
  };

  const handleLabelClick = () => {
    if (!readOnly && onLabelChange) {
      setLabelEditValue(label || '');
      setIsEditingLabel(true);
    }
  };

  const handleLabelSave = () => {
    if (onLabelChange && labelEditValue.trim()) {
      onLabelChange(labelEditValue.trim());
    }
    setIsEditingLabel(false);
  };

  const handleLabelCancel = () => {
    setIsEditingLabel(false);
    setLabelEditValue(label || '');
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSave();
    } else if (e.key === 'Escape') {
      handleLabelCancel();
    }
  };

  React.useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isEditingLabel]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center gap-1 mb-1">
          {isEditingLabel ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                ref={labelInputRef}
                type="text"
                value={labelEditValue}
                onChange={e => setLabelEditValue(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSave}
                className="text-sm font-medium text-gray-700 border border-cyan-500 rounded px-1 py-0.5 w-full"
              />
              <button type="button" onClick={handleLabelSave} className="text-green-600 hover:text-green-700">
                <Check className="w-3 h-3" />
              </button>
              <button type="button" onClick={handleLabelCancel} className="text-red-600 hover:text-red-700">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-1">
              <label 
                className={`text-sm font-medium ${!readOnly && onLabelChange ? 'cursor-pointer hover:text-cyan-600' : 'text-gray-700'}`}
                onClick={handleLabelClick}
              >
                {label}
              </label>
              {!readOnly && onLabelChange && (
                <Pencil className="w-3 h-3 text-gray-400 cursor-pointer hover:text-cyan-600" onClick={handleLabelClick} />
              )}
            </div>
          )}
        </div>
      )}
      <SelectPrimitive.Root value={value || '__clear__'} onValueChange={handleValueChange} disabled={readOnly}>
        <SelectPrimitive.Trigger 
          className="flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent data-[placeholder]:text-gray-400 bg-gray-50 border-gray-300 disabled:opacity-100 disabled:cursor-default"
        >
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
