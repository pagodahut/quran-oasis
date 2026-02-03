/**
 * Tajweed Components
 * 
 * Visual components for teaching and displaying Tajweed rules
 */

// Main components
export { default as TajweedHighlight, RuleDetails, TajweedLegend } from './TajweedHighlight';
export { default as MakhrajDiagram, MakhrajCard } from './MakhrajDiagram';
export { default as RuleFlowchart } from './RuleFlowchart';

// Re-export types and utilities from lib
export {
  TAJWEED_COLORS,
  TAJWEED_RULE_DEFINITIONS,
  MAKHRAJ_POINTS,
  NOON_SAKINAH_FLOWCHART,
  MEEM_SAKINAH_FLOWCHART,
  findTajweedRules,
  getRuleColor,
  getAllRuleTypes,
  getMakhrajForLetter,
  type TajweedRuleType,
  type TajweedMatch,
  type TajweedRuleDefinition,
  type MakhrajPoint,
  type FlowchartNode,
} from '@/lib/tajweed-rules';
