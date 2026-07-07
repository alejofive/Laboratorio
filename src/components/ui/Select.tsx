'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check, Pencil, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { FieldLabel, TextInput } from './FormField';

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
              <TextInput
                ref={labelInputRef}
                type="text"
                value={labelEditValue}
                onChange={e => setLabelEditValue(e.target.value)}
                onKeyDown={handleLabelKeyDown}
                onBlur={handleLabelSave}
                className="h-9 text-sm"
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
              <FieldLabel 
                className={`mb-0 ${!readOnly && onLabelChange ? 'cursor-pointer hover:text-brand-primary' : ''}`}
                onClick={handleLabelClick}
              >
                {label}
              </FieldLabel>
              {!readOnly && onLabelChange && (
                <Pencil className="w-3 h-3 text-secondary cursor-pointer hover:text-brand-primary" onClick={handleLabelClick} />
              )}
            </div>
          )}
        </div>
      )}
      <SelectPrimitive.Root value={value || '__clear__'} onValueChange={handleValueChange} disabled={readOnly}>
        <SelectPrimitive.Trigger 
          className="flex min-h-12 w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-base text-primary outline-none transition-colors hover:border-brand-primary focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 data-[placeholder]:text-secondary/70 disabled:cursor-not-allowed disabled:opacity-100"
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="z-50 overflow-hidden rounded-xl border border-border-default bg-white">
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
                  className="relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-brand-active hover:text-brand-primary data-[highlighted]:bg-brand-active data-[highlighted]:text-brand-primary"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute right-2">
                    <Check className="w-4 h-4 text-brand-primary" />
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
