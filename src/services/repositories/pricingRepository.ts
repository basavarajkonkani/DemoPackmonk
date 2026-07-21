import { readList, writeList, generateId } from '../storage';

export interface PricingRule {
  id: string;
  name: string;
  type: 'material' | 'rush' | 'print' | 'setup';
  value: number;
  description: string;
  isActive: boolean;
}

const STORE_NAME = 'pricing_rules';

const SEED_RULES: PricingRule[] = [
  { id: '1', name: 'Material Markup', type: 'material', value: 20, description: 'Add 20% to base price for premium materials', isActive: true },
  { id: '2', name: 'Rush Order Fee', type: 'rush', value: 500, description: '₹500 flat fee for orders < 48hrs', isActive: true },
  { id: '3', name: 'Custom Print Charge', type: 'print', value: 50, description: '₹50 per color per 1000 units', isActive: true },
  { id: '4', name: 'Setup Fee', type: 'setup', value: 1500, description: '₹1500 one-time setup charge', isActive: true },
];

export async function listPricingRules(): Promise<PricingRule[]> {
  return readList(STORE_NAME, SEED_RULES);
}

export async function createPricingRule(input: Omit<PricingRule, 'id'>): Promise<PricingRule> {
  const all = await listPricingRules();
  const rule: PricingRule = { ...input, id: generateId('rule') };
  await writeList(STORE_NAME, [...all, rule]);
  return rule;
}

export async function updatePricingRule(rule: PricingRule): Promise<PricingRule> {
  const all = await listPricingRules();
  const updated = all.map((r) => (r.id === rule.id ? rule : r));
  await writeList(STORE_NAME, updated);
  return rule;
}

export async function deletePricingRule(id: string): Promise<void> {
  const all = await listPricingRules();
  await writeList(STORE_NAME, all.filter((r) => r.id !== id));
}
