import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, FlaskConical, Leaf, Sparkles } from 'lucide-react'
import ingredientData from './data/ingredients.json'
import interactionData from './data/interactions.json'
import { ProductForm } from './components/ProductForm'
import { ProductList } from './components/ProductList'
import { ScoreCard } from './components/ScoreCard'
import { IngredientCard } from './components/IngredientCard'
import { ConflictCard } from './components/ConflictCard'
import { RoutineCard } from './components/RoutineCard'
import { analyzeCompatibility } from './utils/compatibilityEngine'
import { buildRoutine } from './utils/routineBuilder'
import type { IngredientDatabase, Interaction, Product } from './types'

const emptyProduct = (): Product => ({ id: crypto.randomUUID(), productName: '', ingredientsText: '' })
const sampleProducts: Product[] = [
  { id: 'sample-1', productName: 'Daybreak Brightening Serum', ingredientsText: 'Ascorbic Acid, Niacinamide, Hyaluronic Acid' },
  { id: 'sample-2', productName: 'Daily Mineral Veil SPF', ingredientsText: 'Zinc Oxide, Squalane' },
  { id: 'sample-3', productName: 'Moonlit Renewal Serum', ingredientsText: 'Retinol, Ceramides, Glycerin' }
]

export default function App() {
  const [draft, setDraft] = useState<Product>(emptyProduct)
  const [products, setProducts] = useState<Product[]>([])
  const [result, setResult] = useState<ReturnType<typeof analyzeCompatibility> | null>(null)
  const completeDraft = draft.productName.trim() !== '' && draft.ingredientsText.trim() !== ''

  const analysisProducts = useMemo(() => completeDraft && products.length < 10 ? [...products, draft] : products, [products, draft, completeDraft])
  const addProduct = () => { if (completeDraft && products.length < 10) { setProducts([...products, draft]); setDraft(emptyProduct()); setResult(null) } }
  const analyze = (override?: Product[]) => {
    const lineup = override ?? analysisProducts
    if (!lineup.length) return
    if (completeDraft && !override) { setProducts(lineup); setDraft(emptyProduct()) }
    setResult(analyzeCompatibility(lineup, ingredientData as IngredientDatabase, interactionData as Interaction[]))
    requestAnimationFrame(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' }))
  }
  const loadSample = () => { setProducts(sampleProducts); setDraft(emptyProduct()); analyze(sampleProducts) }
  const reset = () => { setProducts([]); setDraft(emptyProduct()); setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const routine = result ? buildRoutine(result.detected) : null

  return <div className="app-shell">
    <nav className="topbar"><a className="wordmark" href="#top">GlowCode<span>✦</span></a><div className="nav-tag">Decode. Discover. Glow.</div><button className="text-button" onClick={loadSample}>Try a sample <ArrowRight size={15} /></button></nav>

    <main id="top">
      {!result ? <>
        <header className="hero">
          <div className="hero-copy"><span className="eyebrow"><Sparkles size={13} /> Your routine, decoded</span><h1>Know what your skin<br /><em>is really getting.</em></h1><p>Paste your product ingredients. GlowCode maps the actives, spots conflicts, and turns your shelf into a smarter routine.</p><button className="hero-link" onClick={loadSample}>See how it works <ArrowRight size={16} /></button></div>
          <div className="hero-art" aria-hidden="true"><div className="orb orb-one"></div><div className="orb orb-two"></div><div className="bottle bottle-tall"><span>GLOW</span><i>01</i></div><div className="bottle bottle-short"><span>CODE</span><i>02</i></div><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="data-chip"><FlaskConical size={16} /><span>ingredient intelligence</span></div></div>
        </header>
        <section className="workspace"><div className="workspace-heading"><span>01</span><div><h2>What’s on your shelf?</h2><p>Add up to 10 products. Commas between ingredients work best.</p></div></div><div className="workspace-grid"><ProductForm product={draft} onChange={setDraft} onAdd={addProduct} canAdd={completeDraft && products.length < 10} onAnalyze={() => analyze()} canAnalyze={analysisProducts.length > 0} /><ProductList products={products} onRemove={id => { setProducts(products.filter(p => p.id !== id)); setResult(null) }} /></div></section>
      </> : <section id="results" className="results">
        <div className="results-header"><button className="back-button" onClick={() => setResult(null)}><ArrowLeft size={16} /> Edit products</button><span className="eyebrow"><Sparkles size={13} /> Your GlowCode report</span><h1>Your routine,<br /><em>decoded.</em></h1><p>Based on {products.length || analysisProducts.length} product{(products.length || analysisProducts.length) === 1 ? '' : 's'} and {result.detected.length} recognized ingredient{result.detected.length === 1 ? '' : 's'}.</p></div>
        <ScoreCard score={result.score} label={result.label} />
        <div className="result-section"><div className="numbered-heading"><span>01</span><div><h2>Products analyzed</h2><p>The lineup behind your report.</p></div></div><div className="analyzed-products">{products.map((p, i) => <div key={p.id}><span>{String(i + 1).padStart(2, '0')}</span><strong>{p.productName}</strong></div>)}</div></div>
        <div className="result-section"><div className="numbered-heading"><span>02</span><div><h2>Ingredient intelligence</h2><p>{result.detected.length} ingredients recognized from the local GlowCode library.</p></div></div>{result.detected.length ? <div className="ingredient-grid">{result.detected.map(x => <IngredientCard ingredient={x} key={x.name} />)}</div> : <div className="no-findings">No ingredients matched the current library. You can expand <code>src/data/ingredients.json</code> anytime.</div>}{result.unmatched.length > 0 && <details className="unmatched"><summary>{result.unmatched.length} unmatched ingredient{result.unmatched.length === 1 ? '' : 's'}</summary><p>{result.unmatched.join(' · ')}</p></details>}</div>
        <div className="result-section"><div className="numbered-heading"><span>03</span><div><h2>Compatibility check</h2><p>Pairings found across unique ingredient categories.</p></div></div><div className="conflict-list">{result.conflicts.length ? result.conflicts.map((x, i) => <ConflictCard conflict={x} key={`${x.categoryA}-${x.categoryB}-${i}`} />) : <div className="all-clear"><Leaf size={22} /><div><strong>No known conflicts found</strong><p>Your recognized ingredients have no flagged interactions in the current library.</p></div></div>}</div></div>
        {routine && <div className="result-section"><div className="numbered-heading"><span>04</span><div><h2>Your suggested rhythm</h2><p>A simple order based on ingredient category—not product texture.</p></div></div><div className="routine-grid"><RoutineCard type="morning" groups={routine.morning} /><RoutineCard type="night" groups={routine.night} />{routine.other.length > 0 && <RoutineCard type="other" groups={routine.other} />}</div></div>}
        <div className="report-actions"><button className="secondary-btn" onClick={() => setResult(null)}><ArrowLeft size={16} /> Adjust lineup</button><button className="primary-btn" onClick={reset}>Start a new decode <Sparkles size={16} /></button></div>
      </section>}
    </main>
    <footer><div className="wordmark">GlowCode<span>✦</span></div><p>GlowCode is for educational purposes only and does not replace medical advice.</p><span>Local data. Private by design.</span></footer>
  </div>
}
