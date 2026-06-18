
export interface Product { id: string; productName: string; ingredientsText: string }
export interface IngredientInfo {category: string; description: string; whatIsIt: string; whatDoesItDo: string[]; goodFor: string[]; avoidFor: string[]}
export type IngredientDatabase = Record<string, IngredientInfo>
export type Severity = 'compatible' | 'caution' | 'avoid'
export interface Interaction { categoryA: string; categoryB: string; severity: Severity; reason: string }
export interface DetectedIngredient { name: string; category: string; info: IngredientInfo; products: string[] }
export interface Conflict { categoryA: string; categoryB: string; severity: Severity; reason: string; ingredientA: string; ingredientB: string }
export interface AnalysisResult { score: number; label: string; detected: DetectedIngredient[]; conflicts: Conflict[]; unmatched: string[] }
export interface RoutineGroup { category: string; ingredients: string[] }
export interface Routine { morning: RoutineGroup[]; night: RoutineGroup[]; other: RoutineGroup[] }
