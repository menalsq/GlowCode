import type { AnalysisResult, Conflict, IngredientDatabase, Interaction, Product } from '../types'
import { parseIngredients } from './parseIngredients'

const scoreLabel = (score: number) => score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 50 ? 'Use With Caution' : 'High Conflict'

export function analyzeCompatibility(products: Product[], database: IngredientDatabase, interactions: Interaction[]): AnalysisResult {
  const detectedMap = new Map<string, { products: Set<string> }>()
  const unmatched = new Set<string>()

  products.forEach(product => parseIngredients(product.ingredientsText).forEach(name => {
    if (database[name]) {
      const current = detectedMap.get(name) ?? { products: new Set<string>() }
      current.products.add(product.productName)
      detectedMap.set(name, current)
    } else unmatched.add(name)
  }))

  const detected = [...detectedMap].map(([name, value]) => ({ name, category: database[name].category, info: database[name], products: [...value.products] }))
  const categoryExamples = new Map<string, string>()
  detected.forEach(item => { if (!categoryExamples.has(item.category)) categoryExamples.set(item.category, item.name) })
  const categories = [...categoryExamples.keys()]
  const conflicts: Conflict[] = []

  for (let i = 0; i < categories.length; i++) for (let j = i + 1; j < categories.length; j++) {
    const a = categories[i], b = categories[j]
    const match = interactions.find(x => (x.categoryA === a && x.categoryB === b) || (x.categoryA === b && x.categoryB === a))
    if (match) conflicts.push({ ...match, categoryA: a, categoryB: b, ingredientA: categoryExamples.get(a)!, ingredientB: categoryExamples.get(b)! })
  }

  const score = Math.max(0, 100 - conflicts.reduce((sum, x) => sum + (x.severity === 'avoid' ? 30 : x.severity === 'caution' ? 15 : 0), 0))
  return { score, label: scoreLabel(score), detected, conflicts, unmatched: [...unmatched] }
}
