/**
 * Valida que el input solo contenga letras y números
 * @param value - El valor a validar
 * @returns true si solo contiene letras y números, false en caso contrario
 */
export const isValidAlphanumeric = (value: string): boolean => {
  // Regex que permite solo letras (a-z, A-Z, á, é, í, ó, ú, ñ, etc.) y números (0-9)
  const alphanumericRegex = /^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]*$/;
  return alphanumericRegex.test(value);
};

/**
 * Filtra el input para que solo contenga letras y números
 * @param value - El valor a filtrar
 * @returns El valor filtrado sin caracteres especiales
 */
export const filterAlphanumeric = (value: string): string => {
  // Remover todos los caracteres que no sean letras, números o espacios
  return value.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s]/g, '');
};

/**
 * Handler para inputs que solo permiten letras y números
 * @param value - El valor del input
 * @param setter - Función para actualizar el estado
 * @param maxLength - Longitud máxima opcional
 */
export const handleAlphanumericInput = (
  value: string, 
  setter: (value: string) => void, 
  maxLength?: number
) => {
  const filteredValue = filterAlphanumeric(value);
  if (maxLength && filteredValue.length > maxLength) {
    return; // No actualizar si excede la longitud máxima
  }
  setter(filteredValue);
};
