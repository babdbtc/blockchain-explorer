"use client"

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, ExternalLink, ArrowLeft, AlertTriangle, BookOpen, ChevronRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import {
  PRIVACY_TECHNIQUES,
  PRIVACY_INTRO,
  OPSEC_PREREQUISITE,
  type PrivacyTechnique,
  type PrivacyTechniqueId,
} from "@/lib/privacy-data"

type View = 'overview' | 'detail'

const TECHNIQUE_ICONS: Record<PrivacyTechniqueId, string> = {
  coinjoin: '🔀',
  payjoin: '🤝',
  lightning: '⚡',
  cashu: '🥜',
  'atomic-swap': '⚛️',
  coinswap: '🔄',
  p2p: '🏴',
}

const privacyBadgeClass = (level: 'high' | 'moderate') =>
  level === 'high'
    ? 'bg-green-500/15 text-green-400 border border-green-500/30'
    : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'

const easeBadgeClass = (level: 'easy' | 'moderate' | 'advanced') => {
  if (level === 'easy') return 'bg-green-500/15 text-green-400 border border-green-500/30'
  if (level === 'moderate') return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
  return 'bg-red-500/15 text-red-400 border border-red-500/30'
}

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

function PrivacyOverview({
  onSelectTechnique,
}: {
  onSelectTechnique: (id: PrivacyTechniqueId) => void
}) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* OPSEC Prerequisite Banner */}
      <div className="rounded-lg p-4 bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--accent)/0.2)]">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[hsl(var(--accent))] shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[hsl(var(--accent))]">{OPSEC_PREREQUISITE.title}</h3>
            <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">{OPSEC_PREREQUISITE.description}</p>
            <a
              href={OPSEC_PREREQUISITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--accent))] hover:underline"
            >
              {OPSEC_PREREQUISITE.linkText}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Intro Paragraph */}
      <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">{PRIVACY_INTRO}</p>

      {/* Technique Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {PRIVACY_TECHNIQUES.map((technique) => {
          const isRecommended = technique.id === 'cashu'
          return (
          <motion.div key={technique.id} variants={cardItem} data-stagger-item>
            <button
              onClick={() => onSelectTechnique(technique.id)}
              className={`w-full text-left rounded-lg p-4 border-l-2 border-l-[hsl(var(--accent)/0.5)] hover:bg-[hsl(var(--surface-3)/0.5)] hover:-translate-y-0.5 transition-all duration-200 group ${
                isRecommended
                  ? 'recommended-card hover:border-[hsl(var(--accent)/0.6)]'
                  : 'bg-[hsl(var(--surface-2))] border border-transparent hover:border-[hsl(var(--accent)/0.2)]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl" role="img" aria-label={technique.name}>
                  {TECHNIQUE_ICONS[technique.id]}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--surface-3))] text-[hsl(var(--text-muted))] border border-[hsl(var(--border-subtle))]">
                    {technique.layer}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[hsl(var(--text-muted))] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className={`text-sm font-semibold mb-1 ${isRecommended ? 'text-[hsl(var(--accent))]' : 'text-white'}`}>{technique.name}</h3>
              <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed mb-3">{technique.shortDescription}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${privacyBadgeClass(technique.privacyLevel)}`}>
                  {technique.privacyLevel === 'high' ? 'High Privacy' : 'Moderate Privacy'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${easeBadgeClass(technique.easeOfUse)}`}>
                  {technique.easeOfUse === 'easy' ? 'Easy' : technique.easeOfUse === 'moderate' ? 'Moderate' : 'Advanced'}
                </span>
              </div>
            </button>
          </motion.div>
          )
        })}
      </motion.div>

    </motion.div>
  )
}

function PrivacyTechniqueDetail({
  technique,
  onBack,
}: {
  technique: PrivacyTechnique
  onBack: () => void
}) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2 }}
      className="space-y-5"
    >
      {/* Back Button + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="premium-button-accent rounded-md p-1.5 hover:bg-[hsl(var(--accent)/0.25)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{TECHNIQUE_ICONS[technique.id]}</span>
          <h2 className="text-lg font-semibold text-white">{technique.name}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 ml-auto">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--surface-3))] text-[hsl(var(--text-muted))] border border-[hsl(var(--border-subtle))]">
            {technique.layer}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${privacyBadgeClass(technique.privacyLevel)}`}>
            {technique.privacyLevel === 'high' ? 'High Privacy' : 'Moderate Privacy'}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${easeBadgeClass(technique.easeOfUse)}`}>
            {technique.easeOfUse === 'easy' ? 'Easy' : technique.easeOfUse === 'moderate' ? 'Moderate' : 'Advanced'}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[hsl(var(--text-muted))] leading-relaxed">{technique.fullDescription}</p>

      {/* How It Works */}
      <div className="rounded-lg p-4 bg-[hsl(var(--surface-2))] border border-[hsl(var(--border-subtle))]">
        <h3 className="text-sm font-semibold text-white mb-2">How It Works</h3>
        <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed">{technique.howItWorks}</p>
      </div>

      {/* Cost Estimate */}
      <div className="text-xs text-[hsl(var(--text-muted))]">
        <span className="text-white font-medium">Estimated cost:</span> {technique.costEstimate}
      </div>

      {/* Step-by-Step Guide */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Step-by-Step Guide</h3>
        <div className="space-y-3">
          {technique.steps.map((s) => (
            <div key={s.step} className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] text-xs flex items-center justify-center flex-shrink-0">{s.step}</span>
              <div>
                <h4 className="text-sm font-medium text-white">{s.title}</h4>
                <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Tools */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Recommended Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {technique.tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-lg p-3 bg-[hsl(var(--surface-2))] border border-[hsl(var(--border-subtle))] hover:shadow-[0_0_12px_hsl(var(--accent)/0.15)] transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="text-sm font-medium text-white">{tool.name}</h4>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accent)/0.8)] transition-colors shrink-0 ml-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-[hsl(var(--text-muted))] leading-relaxed mb-2">{tool.description}</p>
              <div className="flex flex-wrap gap-1">
                {tool.platforms.map((platform) => (
                  <span
                    key={platform}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--surface-3))] text-[hsl(var(--text-muted))]"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Caveats */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Caveats</h3>
        <ul className="space-y-1.5">
          {technique.caveats.map((caveat, i) => (
            <li key={i} className="flex gap-2 text-xs text-yellow-200/70 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500/60 shrink-0 mt-0.5" />
              {caveat}
            </li>
          ))}
        </ul>
      </div>

      {/* Regulatory Note */}
      {technique.regulatoryNote && (
        <div className="rounded-lg p-4 bg-red-500/5 border border-red-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-red-300 mb-1">Regulatory Risk</h3>
              <p className="text-xs text-red-200/70 leading-relaxed">{technique.regulatoryNote}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function PrivacyGuide({ externalOpen, onExternalOpenHandled }: { externalOpen?: boolean; onExternalOpenHandled?: () => void } = {}) {
  const [isOpen, setIsOpen] = useState(false)

  // Allow external trigger (dock button)
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true)
      onExternalOpenHandled?.()
    }
  }, [externalOpen, onExternalOpenHandled])
  const [view, setView] = useState<View>('overview')
  const [selectedTechnique, setSelectedTechnique] = useState<PrivacyTechniqueId | null>(null)

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      setView('overview')
      setSelectedTechnique(null)
    }, 300)
  }, [])

  const selectTechnique = useCallback((id: PrivacyTechniqueId) => {
    setSelectedTechnique(id)
    setView('detail')
  }, [])

  const backToOverview = useCallback(() => {
    setView('overview')
    setSelectedTechnique(null)
  }, [])

  const activeTechnique = PRIVACY_TECHNIQUES.find((t) => t.id === selectedTechnique)

  return (
    <>
      {/* Modal — triggered externally from the dock */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent
          data-testid="privacy-guide-modal"
          className="premium-modal text-white w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] max-w-5xl max-h-[85vh] overflow-y-auto custom-scrollbar p-0 gap-0"
          originRect={null}
        >
          <DialogHeader className="p-6 pb-4 border-b border-[hsl(var(--border-subtle))] bg-[hsl(var(--accent)/0.05)]">
            <DialogTitle className="flex items-center gap-2 text-[hsl(var(--accent))]">
              <Shield className="w-5 h-5" />
              Bitcoin Privacy Guide
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {view === 'overview' ? (
                <PrivacyOverview onSelectTechnique={selectTechnique} />
              ) : (
                activeTechnique && (
                  <PrivacyTechniqueDetail technique={activeTechnique} onBack={backToOverview} />
                )
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
