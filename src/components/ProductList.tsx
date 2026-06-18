import { PackageOpen, Trash2 } from 'lucide-react'
import type { Product } from '../types'

export function ProductList({ products, onRemove }: { products: Product[]; onRemove: (id: string) => void }) {
  return <section className="product-stack" aria-label="Products added">
    <div className="stack-title"><span>{String(products.length).padStart(2, '0')}</span><p>products in your routine</p></div>
    {products.length === 0 ? <div className="empty-product"><PackageOpen size={22} /><span>Your shelf is waiting.</span></div> : products.map((product, index) => <article className="product-row" key={product.id}>
      <span className="product-number">{index + 1}</span><div><h3>{product.productName}</h3><p>{product.ingredientsText}</p></div>
      <button aria-label={`Remove ${product.productName}`} onClick={() => onRemove(product.id)}><Trash2 size={16} /></button>
    </article>)}
  </section>
}
