import { Plus, Sparkles } from 'lucide-react'
import type { Product } from '../types'

interface Props { product: Product; onChange: (product: Product) => void; onAdd: () => void; canAdd: boolean; onAnalyze: () => void; canAnalyze: boolean }

export function ProductForm({ product, onChange, onAdd, canAdd, onAnalyze, canAnalyze }: Props) {
  return <section className="form-card" aria-labelledby="add-product-title">
    <div className="section-heading">
      <span className="eyebrow">Build your lineup</span>
      <h2 id="add-product-title">Add a product</h2>
      <p>Paste the ingredient list exactly as it appears on the label. We’ll do the decoding.</p>
    </div>
    <div className="fields">
      <label>Product name<input value={product.productName} onChange={e => onChange({ ...product, productName: e.target.value })} placeholder="e.g. Moonlit Retinol Serum" /></label>
      <label>Ingredients<textarea value={product.ingredientsText} onChange={e => onChange({ ...product, ingredientsText: e.target.value })} placeholder="Retinol, Squalane, Ceramides..." rows={5} /></label>
    </div>
    <div className="form-actions">
      <button className="secondary-btn" disabled={!canAdd} onClick={onAdd}><Plus size={17} /> Add product</button>
      <button className="primary-btn" disabled={!canAnalyze} onClick={onAnalyze}><Sparkles size={17} /> Analyze routine</button>
    </div>
  </section>
}
