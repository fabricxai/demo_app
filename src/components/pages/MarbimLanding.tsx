import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, Sparkles, Zap, CheckCircle, Clock, Activity, 
  ArrowRight, Play, Target, Users, TrendingUp, Shield,
  ChevronRight, Star, Award, BarChart3, MessageSquare,
  Settings, Eye, Gauge, Package, FileText, Factory
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { fabricxaiLogoDark } from '../../config/branding';

export function MarbimLanding() {
  const [activeTab, setActiveTab] = useState('leads');

  const stats = [
    { label: 'Time Saved', value: '85%', icon: Clock, color: '#57ACAF' },
    { label: 'Success Rate', value: '92%', icon: Target, color: '#EAB308' },
    { label: 'Monthly Savings', value: '$47K', icon: TrendingUp, color: '#57ACAF' },
    { label: 'Workflows', value: '50+', icon: Zap, color: '#EAB308' }
  ];

  const agentModes = [
    {
      id: 'leads',
      name: 'Leads Board AI',
      icon: Target,
      description: 'Auto-score, qualify, and convert leads',
      stats: { time: '78% faster', metric: '145 leads/day', success: '42% conversion' },
      color: '#57ACAF',
      workflows: [
        'Score & prioritize 45 leads by conversion potential',
        'Generate follow-up campaigns for 28 warm leads',
        'Qualify 15 leads with AI-powered questions',
        'Convert 8 qualified leads to RFQs'
      ]
    },
    {
      id: 'campaigns',
      name: 'Campaigns AI',
      icon: Sparkles,
      description: 'Multi-channel campaign creation & optimization',
      stats: { time: '92% faster', metric: '1,050 touchpoints/week', success: '38% open rate' },
      color: '#EAB308',
      workflows: [
        'Create 5-touch nurture campaign for 150 leads',
        'A/B test 3 subject lines + 2 email variations',
        'Build industry-specific campaigns',
        'Re-engage 85 dormant leads'
      ]
    },
    {
      id: 'rfq',
      name: 'RFQ Board AI',
      icon: FileText,
      description: 'Respond to 50+ RFQs while you sleep',
      stats: { time: '94% faster', metric: '147 RFQs/week', success: '32% margin' },
      color: '#57ACAF',
      workflows: [
        'Auto-respond to 12 pending RFQs',
        'Prioritize & assign 45 RFQs to sales team',
        'Generate bulk quotes for 8 similar RFQs',
        'Negotiate 5 high-value RFQs ($50K+)'
      ]
    },
    {
      id: 'supplier',
      name: 'Supplier Directory AI',
      icon: Factory,
      description: 'Find, evaluate & negotiate globally',
      stats: { time: '85% faster', metric: '47 suppliers managed', success: '15-20% cost reduction' },
      color: '#EAB308',
      workflows: [
        'Discover & onboard 15 new fabric suppliers',
        'Re-evaluate & re-score all 47 suppliers',
        'Negotiate 8-12% price reduction',
        'Multi-supplier RFQ campaign'
      ]
    },
    {
      id: 'machine',
      name: 'Machine Monitoring AI',
      icon: Settings,
      description: 'Predict failures before they happen',
      stats: { time: '85% prevention', metric: '48hrs saved/month', success: '$23K avoided' },
      color: '#57ACAF',
      workflows: [
        'Predictive maintenance for 5 at-risk machines',
        'Optimize Line A efficiency (+14% throughput)',
        'Auto-generate work orders for overdue maintenance',
        'Real-time anomaly detection & alerts'
      ]
    },
    {
      id: 'quality',
      name: 'Quality Inspection AI',
      icon: Eye,
      description: 'Catch defects before disasters',
      stats: { time: '35% reduction', metric: '1,200 defects analyzed', success: '$18.5K savings' },
      color: '#EAB308',
      workflows: [
        'Auto-schedule inspections for 8 batches',
        'AI defect pattern analysis',
        'Predict quality issues for 6 upcoming orders',
        'Critical defect alert & root cause'
      ]
    },
    {
      id: 'costing',
      name: 'Cost Sheets AI',
      icon: BarChart3,
      description: 'Perfect pricing in minutes',
      stats: { time: '87% faster', metric: '156 sheets/month', success: '28% margin' },
      color: '#57ACAF',
      workflows: [
        'Auto-generate cost sheet for new RFQ',
        'Optimize margins on 8 low-profit orders',
        'Bulk cost analysis for 12 similar orders',
        'Create 3 profit scenarios'
      ]
    },
    {
      id: 'email',
      name: 'Email Sequences AI',
      icon: MessageSquare,
      description: 'Cold outreach that gets responses',
      stats: { time: '89% faster', metric: '41% reply rate', success: '27% meetings' },
      color: '#EAB308',
      workflows: [
        'Build 7-email cold outreach sequence',
        'Optimize underperforming sequence (+35% opens)',
        'Post-demo follow-up (5 emails)',
        'Re-engagement "breakup" sequence'
      ]
    }
  ];

  const activeAgent = agentModes.find(a => a.id === activeTab) || agentModes[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] via-[#182336] to-[#0A0F1C]">
      {/* Header */}
      <header className="border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-10 w-auto max-w-[200px] object-contain object-left" />
              <div className="h-8 w-px bg-white/20" />
              <span className="text-white font-semibold text-lg">MARBIM</span>
              <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30">
                AI Agent Platform
              </Badge>
            </div>
            <nav className="flex items-center gap-8">
              <a href="#agents" className="text-[#6F83A7] hover:text-white transition-colors text-sm">
                Agents
              </a>
              <a href="#features" className="text-[#6F83A7] hover:text-white transition-colors text-sm">
                Features
              </a>
              <a href="#pricing" className="text-[#6F83A7] hover:text-white transition-colors text-sm">
                Pricing
              </a>
              <a href="#demo" className="text-[#6F83A7] hover:text-white transition-colors text-sm">
                Demo
              </a>
              <Button className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-medium">
                Start Free Trial
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 mb-6">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Introducing MARBIM AI Agent Platform
                </Badge>
                
                <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
                  Your Fully Autonomous
                  <span className="block bg-gradient-to-r from-[#57ACAF] to-[#EAB308] bg-clip-text text-transparent">
                    AI Agent for Manufacturing
                  </span>
                </h1>
                
                <p className="text-xl text-[#6F83A7] mb-8 leading-relaxed">
                  Stop managing workflows. Let MARBIM do it all—from lead scoring to machine maintenance—while you approve the results.
                </p>

                <div className="flex items-center gap-4 mb-12">
                  <Button size="lg" className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-medium text-lg px-8 py-6">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-6">
                    <Play className="w-5 h-5 mr-2" />
                    Watch Demo
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-8 text-sm">
                  <div className="flex items-center gap-2 text-[#6F83A7]">
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span>8 Specialized Agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6F83A7]">
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span>50+ Automated Workflows</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#6F83A7]">
                    <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                    <span>85% Time Saved</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 backdrop-blur-xl shadow-2xl">
                {/* Mock Agent Interface */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">MARBIM Agent</div>
                      <div className="text-xs text-[#6F83A7]">Executing Now</div>
                    </div>
                    <Badge className="ml-auto bg-[#EAB308]/20 text-[#EAB308] animate-pulse">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>

                  {/* Live Workflow */}
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-white font-medium text-sm mb-1">
                          Auto-Respond to 12 Pending RFQs
                        </div>
                        <div className="text-xs text-[#6F83A7]">
                          Analyzing specifications, calculating costs...
                        </div>
                      </div>
                      <div className="text-[#EAB308] font-bold text-sm">67%</div>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#57ACAF] to-[#EAB308]"
                        initial={{ width: '0%' }}
                        animate={{ width: '67%' }}
                        transition={{ duration: 2, ease: 'easeInOut' }}
                      />
                    </div>
                    <div className="mt-3 space-y-2">
                      {[
                        { label: 'Analyzing 12 RFQ specifications', done: true },
                        { label: 'Calculating costs: materials, labor, overhead', done: true },
                        { label: 'Determining optimal pricing with margins', done: false },
                        { label: 'Generating professional quotations', done: false }
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          {step.done ? (
                            <CheckCircle className="w-3 h-3 text-[#57ACAF]" />
                          ) : (
                            <div className="w-3 h-3 rounded-full border-2 border-white/20" />
                          )}
                          <span className={step.done ? 'text-[#6F83A7]' : 'text-white'}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Completed', value: '847', color: '#57ACAF' },
                      { label: 'In Progress', value: '3', color: '#EAB308' },
                      { label: 'Success Rate', value: '94%', color: '#57ACAF' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>
                          {stat.value}
                        </div>
                        <div className="text-xs text-[#6F83A7]">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-6 top-12 bg-gradient-to-br from-[#57ACAF]/20 to-[#57ACAF]/5 border border-[#57ACAF]/30 rounded-xl p-3 backdrop-blur-xl"
                >
                  <div className="text-xs text-[#57ACAF] mb-1">Just Completed</div>
                  <div className="text-white font-medium text-sm">12 RFQs Quoted</div>
                  <div className="text-xs text-[#6F83A7]">$145K Pipeline</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute -left-6 bottom-12 bg-gradient-to-br from-[#EAB308]/20 to-[#EAB308]/5 border border-[#EAB308]/30 rounded-xl p-3 backdrop-blur-xl"
                >
                  <div className="text-xs text-[#EAB308] mb-1">Time Saved Today</div>
                  <div className="text-white font-medium text-sm">4.2 Hours</div>
                  <div className="text-xs text-[#6F83A7]">vs Manual Process</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 px-8 border-y border-white/10 bg-gradient-to-r from-white/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                  <stat.icon className="w-8 h-8" style={{ color: stat.color }} />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-[#6F83A7]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 Agent Modes Showcase */}
      <section id="agents" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border-[#57ACAF]/20 mb-4">
              <Sparkles className="w-3 h-3 mr-2" />
              8 Specialized AI Agents
            </Badge>
            <h2 className="text-5xl font-bold text-white mb-6">
              One Agent Mode. Infinite Possibilities.
            </h2>
            <p className="text-xl text-[#6F83A7] max-w-3xl mx-auto">
              Each agent is personalized for specific workflows—from lead management to machine maintenance.
            </p>
          </div>

          {/* Agent Tabs */}
          <div className="grid grid-cols-4 gap-3 mb-12">
            {agentModes.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setActiveTab(agent.id)}
                className={`p-4 rounded-xl transition-all duration-300 text-left ${
                  activeTab === agent.id
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/30 shadow-lg'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ 
                      background: activeTab === agent.id 
                        ? `linear-gradient(135deg, ${agent.color}40, ${agent.color}10)` 
                        : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <agent.icon 
                      className="w-5 h-5" 
                      style={{ color: activeTab === agent.id ? agent.color : '#6F83A7' }}
                    />
                  </div>
                  {activeTab === agent.id && (
                    <Badge className="bg-[#EAB308]/20 text-[#EAB308] text-xs">Active</Badge>
                  )}
                </div>
                <div className={`font-semibold text-sm mb-1 ${activeTab === agent.id ? 'text-white' : 'text-[#6F83A7]'}`}>
                  {agent.name}
                </div>
                <div className="text-xs text-[#6F83A7] line-clamp-2">
                  {agent.description}
                </div>
              </button>
            ))}
          </div>

          {/* Active Agent Details */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-12"
          >
            <div className="grid grid-cols-2 gap-12">
              {/* Left: Agent Info */}
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ 
                      background: `linear-gradient(135deg, ${activeAgent.color}, ${activeAgent.color}80)`
                    }}
                  >
                    <activeAgent.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{activeAgent.name}</h3>
                    <p className="text-[#6F83A7]">{activeAgent.description}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {Object.entries(activeAgent.stats).map(([key, value], i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div 
                        className="text-2xl font-bold mb-1" 
                        style={{ color: activeAgent.color }}
                      >
                        {value}
                      </div>
                      <div className="text-xs text-[#6F83A7] capitalize">{key.replace('_', ' ')}</div>
                    </div>
                  ))}
                </div>

                {/* Workflows */}
                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: activeAgent.color }} />
                    Autonomous Workflows
                  </h4>
                  <div className="space-y-3">
                    {activeAgent.workflows.map((workflow, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: activeAgent.color }} />
                        <span className="text-sm text-white">{workflow}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  className="mt-8 w-full bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-medium"
                  size="lg"
                >
                  Try {activeAgent.name}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Right: Visual */}
              <div className="relative">
                <div className="bg-gradient-to-br from-[#0A0F1C] to-[#182336] rounded-2xl border border-white/20 p-6">
                  {/* Mock Executing Now View */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                    <Zap className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-sm text-white font-medium">Executing Now</span>
                    <Badge className="ml-auto bg-[#EAB308]/20 text-[#EAB308] text-xs animate-pulse">
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {/* Sample Workflow Execution */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm mb-1">
                            {activeAgent.workflows[0]}
                          </div>
                          <div className="text-xs text-[#6F83A7]">
                            Step 4 of 8: Processing...
                          </div>
                        </div>
                        <div className="text-[#EAB308] font-bold">52%</div>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: '52%',
                            background: `linear-gradient(90deg, ${activeAgent.color}, #EAB308)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                      {[
                        { label: 'Loading data from database', done: true },
                        { label: 'Analyzing patterns and metrics', done: true },
                        { label: 'Running AI models', done: true },
                        { label: 'Generating recommendations', active: true },
                        { label: 'Creating deliverables', pending: true },
                        { label: 'Preparing for approval', pending: true }
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-xs">
                          {step.done ? (
                            <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                          ) : step.active ? (
                            <div className="relative">
                              <div className="w-4 h-4 rounded-full border-2 border-[#EAB308] animate-pulse" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping" />
                              </div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                          )}
                          <span className={
                            step.done ? 'text-[#6F83A7] line-through' : 
                            step.active ? 'text-white font-medium' : 
                            'text-[#6F83A7]'
                          }>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Success Badge */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-4 bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/80 rounded-2xl px-4 py-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-white" />
                    <div>
                      <div className="text-white font-bold text-sm">92% Success</div>
                      <div className="text-white/70 text-xs">AI Accuracy</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-8 bg-gradient-to-b from-transparent to-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              From Request to Results in Minutes
            </h2>
            <p className="text-xl text-[#6F83A7]">
              Watch MARBIM work transparently, step-by-step
            </p>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {[
              {
                step: 1,
                icon: Target,
                title: 'Agent Suggests',
                description: '50+ workflows ready to run',
                color: '#57ACAF'
              },
              {
                step: 2,
                icon: Play,
                title: 'You Click Start',
                description: 'One click launches automation',
                color: '#EAB308'
              },
              {
                step: 3,
                icon: Zap,
                title: 'MARBIM Executes',
                description: 'Watch 5-8 steps in real-time',
                color: '#57ACAF'
              },
              {
                step: 4,
                icon: Brain,
                title: 'AI Recommends',
                description: 'Smart suggestions backed by data',
                color: '#EAB308'
              },
              {
                step: 5,
                icon: CheckCircle,
                title: 'Results Delivered',
                description: 'Detailed metrics ready',
                color: '#57ACAF'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${item.color}40, ${item.color}10)` }}
                  >
                    <item.icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>
                  <div className="text-sm font-bold text-[#6F83A7] mb-2">Step {item.step}</div>
                  <div className="text-white font-semibold mb-2">{item.title}</div>
                  <div className="text-xs text-[#6F83A7]">{item.description}</div>
                </div>
                {i < 4 && (
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-6 h-6 text-[#6F83A7]" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Loved by Manufacturing Teams
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-[#EAB308] text-[#EAB308]" />
              ))}
              <span className="text-white font-bold ml-2">4.8/5</span>
              <span className="text-[#6F83A7]">from 500+ teams</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Operations Director',
                company: 'Premium Textiles Ltd.',
                quote: 'MARBIM responded to 47 RFQs while I was in meetings. I just approved the quotes and they went out. This is magic.',
                avatar: '👩‍💼'
              },
              {
                name: 'Rajesh Kumar',
                role: 'Production Manager',
                company: 'Global Garments Inc.',
                quote: 'The predictive maintenance alone saved us $23K in the first month. Machine M-08 would have broken mid-shift—MARBIM caught it 3 days early.',
                avatar: '👨‍💼'
              },
              {
                name: 'Maria Rodriguez',
                role: 'Quality Director',
                company: 'EcoWear Manufacturing',
                quote: 'Defect analysis that used to take me 2 days now happens in 16 minutes. And it finds patterns I would have missed.',
                avatar: '👩‍🔬'
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#EAB308] text-[#EAB308]" />
                  ))}
                </div>
                <p className="text-white mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#57ACAF] to-[#EAB308] flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-[#6F83A7]">{testimonial.role}</div>
                    <div className="text-xs text-[#6F83A7]">{testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#57ACAF]/20 via-transparent to-[#EAB308]/20 border border-white/20 rounded-3xl p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
            
            <div className="relative z-10">
              <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 mb-6">
                <Sparkles className="w-3 h-3 mr-2" />
                No Credit Card Required
              </Badge>
              
              <h2 className="text-5xl font-bold text-white mb-6">
                Ready to Let AI Run Your Operations?
              </h2>
              
              <p className="text-xl text-[#6F83A7] mb-8 max-w-2xl mx-auto">
                Join 500+ garment manufacturers already automating with MARBIM
              </p>

              <div className="flex items-center justify-center gap-4 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-[#EAB308] to-[#EAB308]/80 hover:from-[#EAB308]/90 hover:to-[#EAB308]/70 text-black font-medium text-lg px-12 py-7">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 text-lg px-12 py-7">
                  Schedule a Demo
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 text-sm text-[#6F83A7]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  14-day full access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  All 8 agents included
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#57ACAF]" />
                  5-minute setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-5 gap-12 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src={fabricxaiLogoDark} alt="FabricXAI" className="h-9 w-auto max-w-[180px] object-contain object-left" />
                <span className="text-white font-bold text-lg">MARBIM</span>
              </div>
              <p className="text-[#6F83A7] text-sm leading-relaxed mb-4">
                FabricXAI's AI Agent Platform for intelligent manufacturing operations. Automate workflows across 14 modules with full transparency and human oversight.
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/5 text-[#6F83A7] border-white/10">
                  Made with ❤️ for Manufacturers
                </Badge>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Product</div>
              <div className="space-y-2 text-sm text-[#6F83A7]">
                <div className="hover:text-white cursor-pointer transition-colors">Agent Modes</div>
                <div className="hover:text-white cursor-pointer transition-colors">Modules</div>
                <div className="hover:text-white cursor-pointer transition-colors">Pricing</div>
                <div className="hover:text-white cursor-pointer transition-colors">Demo</div>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Company</div>
              <div className="space-y-2 text-sm text-[#6F83A7]">
                <div className="hover:text-white cursor-pointer transition-colors">About</div>
                <div className="hover:text-white cursor-pointer transition-colors">Careers</div>
                <div className="hover:text-white cursor-pointer transition-colors">Blog</div>
                <div className="hover:text-white cursor-pointer transition-colors">Contact</div>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold mb-4">Resources</div>
              <div className="space-y-2 text-sm text-[#6F83A7]">
                <div className="hover:text-white cursor-pointer transition-colors">Documentation</div>
                <div className="hover:text-white cursor-pointer transition-colors">API</div>
                <div className="hover:text-white cursor-pointer transition-colors">Support</div>
                <div className="hover:text-white cursor-pointer transition-colors">Security</div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-sm text-[#6F83A7]">
            <div>© 2024 FabricXAI. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <div className="hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
              <div className="hover:text-white cursor-pointer transition-colors">Terms of Service</div>
              <div className="hover:text-white cursor-pointer transition-colors">Cookie Policy</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
