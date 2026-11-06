/**
 * Currency and format helpers for SENSE (Argentine Market)
 */

export function formatARS(value: number): string {
  if (isNaN(value)) return '$ 0';
  return `$ ${Math.round(value).toLocaleString('es-AR')}`;
}

export function formatInstallments(amount: number, installments = 6): string {
  const valuePerInstallment = Math.round(amount / installments);
  return `${installments} cuotas sin interés de ${formatARS(valuePerInstallment)}`;
}

export function calculateDiscountPercent(current: number, original?: number): number {
  if (!original || original <= current) return 0;
  return Math.round(((original - current) / original) * 100);
}

export function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoDate;
  }
}
