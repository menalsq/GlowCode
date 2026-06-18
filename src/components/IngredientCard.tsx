import { Check, Info } from 'lucide-react'
import type { DetectedIngredient } from '../types'

export function IngredientCard({ ingredient }: { ingredient: DetectedIngredient }) {
  return <article className="ingredient-card">
    <div className="ingredient-top"><span className="category-pill">{ingredient.category}</span><Info size={17} /></div>
    <h3>{ingredient.name}</h3><p className="description">{ingredient.info.description}</p>
    <div className="insight"><h4>What it does</h4>{ingredient.info.whatDoesItDo.slice(0, 2).map(item => <p key={item}><Check size={14} />{item}</p>)}</div>
    <div className="tags">{ingredient.info.goodFor.map(item => <span key={item}>{item}</span>)}</div>
  </article>
}
