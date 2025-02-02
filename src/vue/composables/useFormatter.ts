export const useCurrencyFormatter = (options: Partial<Intl.NumberFormatOptions> = {}) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', ...options })
}
