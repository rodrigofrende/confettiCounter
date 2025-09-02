import React, { useState, useEffect, useRef } from 'react';

interface MoneyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  id?: string;
  name?: string;
}

/**
 * Formatea un valor como dinero mientras el usuario escribe
 * Mantiene el cursor en la posición correcta
 */
const formatAsUserTypes = (value: string): string => {
  // Remover todo excepto números y punto decimal
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  if (!cleanValue) return '';
  
  // Manejar punto decimal
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    // Si hay más de un punto, mantener solo el primero
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Formatear la parte entera con separadores de miles
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // Si hay parte decimal, incluirla
  if (decimalPart !== undefined) {
    return formattedInteger + '.' + decimalPart;
  }
  
  return formattedInteger;
};

/**
 * Obtiene el valor sin formato para el estado del componente padre
 */
const getRawValue = (formattedValue: string): string => {
  return formattedValue.replace(/,/g, '');
};

export const MoneyInput: React.FC<MoneyInputProps> = ({
  value,
  onChange,
  placeholder = "0.00",
  className = "",
  min,
  max,
  required = false,
  disabled = false,
  autoComplete = "off",
  id,
  name
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  // Sincronizar valor inicial y cambios externos
  useEffect(() => {
    if (value === '') {
      setDisplayValue('');
    } else {
      const formatted = formatAsUserTypes(value);
      setDisplayValue(formatted);
    }
  }, [value]);

  // Restaurar posición del cursor después del formateo
  useEffect(() => {
    if (inputRef.current && cursorPosition !== null) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      setCursorPosition(null);
    }
  }, [displayValue, cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const currentCursorPos = e.target.selectionStart || 0;
    
    // Si el campo está vacío
    if (inputValue === '') {
      setDisplayValue('');
      onChange('');
      return;
    }

    // Formatear el valor para mostrar
    const formatted = formatAsUserTypes(inputValue);
    setDisplayValue(formatted);
    
    // Calcular nueva posición del cursor
    const commasBeforeCursor = (inputValue.substring(0, currentCursorPos).match(/,/g) || []).length;
    const commasInFormatted = (formatted.substring(0, currentCursorPos).match(/,/g) || []).length;
    const newCursorPos = currentCursorPos + (commasInFormatted - commasBeforeCursor);
    setCursorPosition(newCursorPos);
    
    // Enviar valor sin formato al componente padre
    const rawValue = getRawValue(formatted);
    onChange(rawValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Permitir teclas de navegación y control
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', 'PageUp', 'PageDown'
    ];
    
    if (allowedKeys.includes(e.key)) {
      return;
    }
    
    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
    if (e.ctrlKey || e.metaKey) {
      return;
    }
    
    // Permitir números
    if (/^\d$/.test(e.key)) {
      return;
    }
    
    // Permitir un solo punto decimal
    if (e.key === '.' && !displayValue.includes('.')) {
      return;
    }
    
    // Bloquear cualquier otra tecla
    e.preventDefault();
  };

  const baseClassName = `w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium transition-all duration-300 ${className}`;

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 text-lg font-medium">$</span>
      </div>
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={baseClassName}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        inputMode="decimal"
      />
    </div>
  );
};
