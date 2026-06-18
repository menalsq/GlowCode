import { Moon, Sun, WandSparkles } from 'lucide-react'
import type { RoutineGroup } from '../types'

export function RoutineCard({ type, groups }: { type: 'morning' | 'night' | 'other'; groups: RoutineGroup[] }) {
  const Icon = type === 'morning' ? Sun : type === 'night' ? Moon : WandSparkles
  const title = type === 'morning' ? 'Morning ritual' : type === 'night' ? 'Evening ritual' : 'Other ingredients'
  return <article className={`routine-card ${type}`}><div className="routine-heading"><span><Icon size={20} /></span><div><p>{type === 'morning' ? 'AM' : type === 'night' ? 'PM' : 'ANYTIME'}</p><h3>{title}</h3></div></div>
    {groups.length ? <ol>{groups.map((group, index) => <li key={group.category}><span>{index + 1}</span><div><strong>{group.category}</strong><p>{group.ingredients.join(', ')}</p></div></li>)}</ol> : <p className="routine-empty">No matching ingredients in this lineup.</p>}
  </article>
}
