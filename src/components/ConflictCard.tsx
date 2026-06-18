import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react'
import type { Conflict } from '../types'

export function ConflictCard({ conflict }: { conflict: Conflict }) {
  const Icon = conflict.severity === 'avoid' ? ShieldAlert : conflict.severity === 'caution' ? AlertTriangle : CheckCircle2
  return <article className={`conflict-card ${conflict.severity}`}><Icon size={21} /><div><div className="conflict-title"><h3>{conflict.ingredientA} + {conflict.ingredientB}</h3><span>{conflict.severity}</span></div><p>{conflict.reason}</p></div></article>
}
