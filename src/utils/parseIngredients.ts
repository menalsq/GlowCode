export const normalizeIngredient = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ')

export const parseIngredients = (text: string) =>
  [...new Set(text.split(',').map(normalizeIngredient).filter(Boolean))]
