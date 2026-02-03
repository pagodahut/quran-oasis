'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import {
  TAJWEED_COLORS,
  TAJWEED_RULE_DEFINITIONS,
  NOON_SAKINAH_FLOWCHART,
  MEEM_SAKINAH_FLOWCHART,
  type TajweedRuleType,
  type FlowchartNode,
} from '@/lib/tajweed-rules';

type FlowchartType = 'noon-sakinah' | 'meem-sakinah';

interface RuleFlowchartProps {
  type?: FlowchartType;
  interactive?: boolean;
  onRuleReached?: (rule: TajweedRuleType) => void;
  className?: string;
}

export default function RuleFlowchart({
  type = 'noon-sakinah',
  interactive = true,
  onRuleReached,
  className = '',
}: RuleFlowchartProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(['start']);
  const [selectedFlowchart, setSelectedFlowchart] = useState<FlowchartType>(type);

  const flowchart = selectedFlowchart === 'noon-sakinah'
    ? NOON_SAKINAH_FLOWCHART
    : MEEM_SAKINAH_FLOWCHART;

  const currentNode = useMemo(() => {
    return flowchart.find(n => n.id === currentNodeId) || flowchart[0];
  }, [flowchart, currentNodeId]);

  const handleAnswer = useCallback((answer: 'yes' | 'no') => {
    if (currentNode.type !== 'question') return;
    
    const nextId = answer === 'yes' ? currentNode.yes : currentNode.no;
    if (nextId) {
      setVisitedNodes(prev => [...prev, nextId]);
      setCurrentNodeId(nextId);

      // Check if we reached a rule
      const nextNode = flowchart.find(n => n.id === nextId);
      if (nextNode?.type === 'rule' && nextNode.rule) {
        onRuleReached?.(nextNode.rule);
      }
    }
  }, [currentNode, flowchart, onRuleReached]);

  const handleReset = useCallback(() => {
    setCurrentNodeId('start');
    setVisitedNodes(['start']);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    if (!interactive) return;
    const nodeIndex = visitedNodes.indexOf(nodeId);
    if (nodeIndex >= 0) {
      setVisitedNodes(visitedNodes.slice(0, nodeIndex + 1));
      setCurrentNodeId(nodeId);
    }
  }, [interactive, visitedNodes]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Flowchart Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedFlowchart('noon-sakinah');
            handleReset();
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            selectedFlowchart === 'noon-sakinah'
              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
              : 'bg-night-800 text-cream-400 border border-night-700 hover:border-night-600'
          }`}
        >
          <span className="font-arabic text-lg">نْ</span>
          <span className="ml-2">Noon Sakinah</span>
        </button>
        <button
          onClick={() => {
            setSelectedFlowchart('meem-sakinah');
            handleReset();
          }}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            selectedFlowchart === 'meem-sakinah'
              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
              : 'bg-night-800 text-cream-400 border border-night-700 hover:border-night-600'
          }`}
        >
          <span className="font-arabic text-lg">مْ</span>
          <span className="ml-2">Meem Sakinah</span>
        </button>
      </div>

      {/* Progress Path */}
      <div className="flex items-center flex-wrap gap-2">
        {visitedNodes.map((nodeId, index) => {
          const node = flowchart.find(n => n.id === nodeId);
          if (!node) return null;

          const isLast = index === visitedNodes.length - 1;
          const ruleColor = node.rule ? TAJWEED_COLORS[node.rule] : null;

          return (
            <div key={nodeId} className="flex items-center gap-2">
              <motion.button
                onClick={() => handleNodeClick(nodeId)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  isLast
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                    : 'bg-night-800 text-cream-400 hover:bg-night-700'
                } ${node.type === 'rule' && ruleColor ? ruleColor.bgColor : ''}`}
                style={node.type === 'rule' && ruleColor ? { color: ruleColor.color } : {}}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {node.type === 'start' && '🏁'}
                {node.type === 'question' && '❓'}
                {node.type === 'rule' && '✓'}
                <span className="ml-1">
                  {node.type === 'rule' ? node.text.split('\n')[0] : 
                   node.type === 'start' ? 'Start' : 
                   `Q${index}`}
                </span>
              </motion.button>
              {!isLast && (
                <ChevronRight className="w-4 h-4 text-cream-600" />
              )}
            </div>
          );
        })}
      </div>

      {/* Current Node Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNodeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="min-h-[200px]"
        >
          {currentNode.type === 'start' && (
            <StartNode
              node={currentNode}
              onContinue={() => {
                const firstQuestion = flowchart.find(n => n.type === 'question');
                if (firstQuestion) {
                  setVisitedNodes(prev => [...prev, firstQuestion.id]);
                  setCurrentNodeId(firstQuestion.id);
                }
              }}
            />
          )}

          {currentNode.type === 'question' && (
            <QuestionNode
              node={currentNode}
              onAnswer={handleAnswer}
              interactive={interactive}
            />
          )}

          {currentNode.type === 'rule' && currentNode.rule && (
            <RuleNode
              node={currentNode}
              onReset={handleReset}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Reset Button */}
      {currentNodeId !== 'start' && (
        <motion.button
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-cream-400 hover:text-gold-400 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ x: -2 }}
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </motion.button>
      )}

      {/* Visual Flowchart (Static Overview) */}
      <FlowchartOverview
        flowchart={flowchart}
        visitedNodes={visitedNodes}
        currentNodeId={currentNodeId}
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}

// ============================================
// Start Node Component
// ============================================

interface StartNodeProps {
  node: FlowchartNode;
  onContinue: () => void;
}

function StartNode({ node, onContinue }: StartNodeProps) {
  return (
    <div className="text-center space-y-6 p-6 rounded-2xl bg-gradient-to-br from-night-800 to-night-900 border border-night-700">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20">
        <BookOpen className="w-8 h-8 text-gold-400" />
      </div>

      <div>
        <h3 className="text-xl font-semibold text-cream-100">
          {node.text}
        </h3>
        <p className="text-cream-400 font-arabic text-2xl mt-2" dir="rtl">
          {node.arabicText}
        </p>
      </div>

      <p className="text-sm text-cream-500">
        Follow the decision tree to determine which tajweed rule applies.
      </p>

      <motion.button
        onClick={onContinue}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500/20 text-gold-400 font-medium hover:bg-gold-500/30 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Begin
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

// ============================================
// Question Node Component
// ============================================

interface QuestionNodeProps {
  node: FlowchartNode;
  onAnswer: (answer: 'yes' | 'no') => void;
  interactive?: boolean;
}

function QuestionNode({ node, onAnswer, interactive = true }: QuestionNodeProps) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-night-800 to-night-900 border border-night-700">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-midnight-500/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6 text-midnight-400" />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-cream-100 whitespace-pre-line">
              {node.text}
            </h3>
            {node.arabicText && (
              <p className="text-cream-400 font-arabic text-xl mt-2" dir="rtl">
                {node.arabicText}
              </p>
            )}
          </div>

          {interactive && (
            <div className="flex gap-3">
              <motion.button
                onClick={() => onAnswer('yes')}
                className="flex-1 py-3 px-4 rounded-xl bg-sage-500/20 text-sage-400 font-medium hover:bg-sage-500/30 border border-sage-500/30 transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <CheckCircle2 className="w-5 h-5 inline-block mr-2" />
                Yes
              </motion.button>
              <motion.button
                onClick={() => onAnswer('no')}
                className="flex-1 py-3 px-4 rounded-xl bg-night-700 text-cream-400 font-medium hover:bg-night-600 border border-night-600 transition-all"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                No
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Rule Node Component
// ============================================

interface RuleNodeProps {
  node: FlowchartNode;
  onReset: () => void;
}

function RuleNode({ node, onReset }: RuleNodeProps) {
  if (!node.rule) return null;

  const ruleColor = TAJWEED_COLORS[node.rule];
  const ruleDefinition = TAJWEED_RULE_DEFINITIONS[node.rule];

  return (
    <div
      className="p-6 rounded-2xl border-2"
      style={{
        backgroundColor: `${ruleColor.color}10`,
        borderColor: ruleColor.color,
      }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${ruleColor.color}30` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle2 className="w-8 h-8" style={{ color: ruleColor.color }} />
        </motion.div>

        <div className="flex-1 space-y-4">
          <div>
            <motion.h3
              className="text-xl font-semibold"
              style={{ color: ruleColor.color }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {ruleDefinition.name}
            </motion.h3>
            <p className="text-cream-400 font-arabic text-2xl mt-1" dir="rtl">
              {ruleDefinition.arabicName}
            </p>
          </div>

          <motion.p
            className="text-cream-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {ruleDefinition.explanation}
          </motion.p>

          {/* Examples */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-xs text-cream-500 uppercase tracking-wide">Examples</h4>
            <div className="flex flex-wrap gap-2">
              {ruleDefinition.examples.map((example, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-lg font-quran text-lg"
                  style={{
                    backgroundColor: `${ruleColor.color}20`,
                    color: ruleColor.color,
                  }}
                  dir="rtl"
                >
                  {example}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-xs text-cream-500 uppercase tracking-wide">Tips</h4>
            <ul className="space-y-1">
              {ruleDefinition.tips.slice(0, 3).map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-cream-400">
                  <span style={{ color: ruleColor.color }}>•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Try Again Button */}
          <motion.button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-night-800 text-cream-400 hover:text-cream-200 transition-colors mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-4 h-4" />
            Try Another
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Flowchart Overview Component
// ============================================

interface FlowchartOverviewProps {
  flowchart: FlowchartNode[];
  visitedNodes: string[];
  currentNodeId: string;
  onNodeClick: (nodeId: string) => void;
}

function FlowchartOverview({
  flowchart,
  visitedNodes,
  currentNodeId,
  onNodeClick,
}: FlowchartOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-t border-night-700 pt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-cream-500 hover:text-cream-300 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
        View Complete Flowchart
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-4"
          >
            <div className="grid gap-3">
              {flowchart.map((node) => {
                const isVisited = visitedNodes.includes(node.id);
                const isCurrent = currentNodeId === node.id;
                const ruleColor = node.rule ? TAJWEED_COLORS[node.rule] : null;

                return (
                  <motion.div
                    key={node.id}
                    onClick={() => isVisited && onNodeClick(node.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'border-gold-500 bg-gold-500/10'
                        : isVisited
                        ? 'border-night-600 bg-night-800/50 cursor-pointer hover:bg-night-800'
                        : 'border-night-700 bg-night-900/50 opacity-50'
                    }`}
                    style={
                      node.type === 'rule' && ruleColor && isVisited
                        ? {
                            borderColor: ruleColor.color,
                            backgroundColor: `${ruleColor.color}10`,
                          }
                        : {}
                    }
                    whileHover={isVisited ? { scale: 1.01 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          node.type === 'start'
                            ? 'bg-gold-500/20 text-gold-400'
                            : node.type === 'question'
                            ? 'bg-midnight-500/20 text-midnight-400'
                            : ruleColor
                            ? ''
                            : 'bg-sage-500/20 text-sage-400'
                        }`}
                        style={
                          ruleColor
                            ? {
                                backgroundColor: `${ruleColor.color}20`,
                                color: ruleColor.color,
                              }
                            : {}
                        }
                      >
                        {node.type === 'start' && '🏁'}
                        {node.type === 'question' && '?'}
                        {node.type === 'rule' && '✓'}
                      </span>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            isCurrent
                              ? 'text-gold-400'
                              : ruleColor
                              ? ''
                              : 'text-cream-300'
                          }`}
                          style={ruleColor ? { color: ruleColor.color } : {}}
                        >
                          {node.text.split('\n')[0]}
                        </p>
                        {node.arabicText && (
                          <p className="text-xs text-cream-500 font-arabic" dir="rtl">
                            {node.arabicText}
                          </p>
                        )}
                      </div>
                      {isCurrent && (
                        <span className="text-xs text-gold-400 animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Export Individual Components
// ============================================

export { StartNode, QuestionNode, RuleNode, FlowchartOverview };
