/**
 * Utilidades para el manejo y formateo de fechas.
 */

/**
 * Formatea una fecha a su representación de mes y año en español.
 * Ej: "mayo 2026"
 * 
 * @param dateString Fecha en formato ISO string, o un objeto Date.
 * @returns String formateado.
 */
export function formatMonthYear(dateInput?: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

export function formatReminderDate(dateInput?: string | Date): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  
  const day = new Intl.DateTimeFormat('es-ES', { weekday: 'short' }).format(date);
  const time = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(date);
  
  return `${day} ${time}`;
}
