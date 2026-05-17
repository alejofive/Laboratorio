'use client';

import { useState, useEffect, useRef } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface InputNumberProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onLabelChange?: (newLabel: string) => void;
}

export function InputNumber({ label, value, onChange, placeholder, readOnly = false, onLabelChange }: InputNumberProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [labelEditValue, setLabelEditValue] = useState(label || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const labelInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditingLabel && labelInputRef.current) {
      labelInputRef.current.focus();
    }
  }, [isEditingLabel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }
    setLocalValue(e.target.value);
    onChange(e.target.value);
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

  return (
    <div>
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
                className="text-sm font-medium text-gray-tertiary border border-cyan-500 rounded px-1 py-0.5 w-full"
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
                className={`text-sm font-medium ${!readOnly && onLabelChange ? 'cursor-pointer hover:text-cyan-600' : 'text-tertiary'}`}
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
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-transparent"
      />
    </div>
  );
}
