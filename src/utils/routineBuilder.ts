import type { DetectedIngredient, Routine, RoutineGroup } from '../types'

const morning = ['vitamin c', 'niacinamide', 'hydrator', 'moisturizer', 'spf']
const night = ['retinoid', 'aha', 'bha', 'barrier support', 'moisturizer']

export function buildRoutine(ingredients: DetectedIngredient[]): Routine {
  const group = (categories: string[]): RoutineGroup[] => categories.map(category => ({ category, ingredients: ingredients.filter(x => x.category === category).map(x => x.name) })).filter(x => x.ingredients.length)
  //combine the supported routine categories 
  const known = new Set([...morning, ...night])
  const otherMap = new Map<string, string[]>()
  ingredients.filter(x => !known.has(x.category)).forEach(x => otherMap.set(x.category, [...(otherMap.get(x.category) ?? []), x.name]))
  return { morning: group(morning), night: group(night), other: [...otherMap].map(([category, names]) => ({ category, ingredients: names })) }
}
