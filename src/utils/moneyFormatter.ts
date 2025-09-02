/**
 * Utilidades para formatear y manejar inputs de dinero
 */

/**
 * Formatea un número como dinero con separadores de miles
 */
export const formatMoney = (amount: number): string => {
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formatea un string para mostrar como dinero mientras el usuario escribe
 */
export const formatInputValue = (value: string): string => {
  // Remover todo excepto números y punto decimal
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Evitar múltiples puntos decimales
  const parts = cleanValue.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Si no hay valor, retornar vacío
  if (!cleanValue || cleanValue === '.') return '';
  
  const number = parseFloat(cleanValue);
  if (isNaN(number)) return '';
  
  // Formatear con separadores de miles
  const [integer, decimal] = cleanValue.split('.');
  const formattedInteger = parseInt(integer || '0').toLocaleString('es-ES');
  
  // Si hay decimales en el input, mantenerlos
  if (decimal !== undefined) {
    return formattedInteger + '.' + decimal;
  }
  
  return formattedInteger;
};

/**
 * Convierte un string formateado de vuelta a número
 */
export const parseMoneyInput = (formattedValue: string): number => {
  // Remover separadores de miles y convertir a número
  const cleanValue = formattedValue.replace(/[^\d.]/g, '');
  const number = parseFloat(cleanValue);
  return isNaN(number) ? 0 : number;
};

/**
 * Valida si un input de dinero es válido
 */
export const isValidMoneyInput = (value: string): boolean => {
  const cleaned = value.replace(/[^\d.]/g, '');
  if (!cleaned) return false;
  
  const number = parseFloat(cleaned);
  return !isNaN(number) && number > 0;
};

/**
 * Limpia un input de dinero removiendo caracteres no permitidos
 */
export const cleanMoneyInput = (value: string): string => {
  return value.replace(/[^\d.]/g, '');
};
