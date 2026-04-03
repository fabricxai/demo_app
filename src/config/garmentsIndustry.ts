/**
 * Garment manufacturing domain vocabulary, pipeline language, and MARBIM prompt starters.
 * Import from module pages for consistent copy and AI context.
 */

export const GARMENTS_UNITS = {
  fabric: 'yds',
  weight: 'GSM',
  time: 'SMV',
  moq: 'pcs / colorway',
} as const;

/** Lead / CRM pipeline tuned for apparel sourcing */
export const LEAD_PIPELINE_STAGES = [
  { stage: 'New enquiry', count: 127, fill: '#57ACAF' },
  { stage: 'Tech pack / spec', count: 85, fill: '#6F83A7' },
  { stage: 'Sampling', count: 52, fill: '#EAB308' },
  { stage: 'Costing & quote', count: 28, fill: '#D0342C' },
  { stage: 'PO / onboarding', count: 12, fill: '#9333EA' },
];

export const MARBIM_PROMPTS = {
  leadDashboard:
    'As a garment ERP copilot, interpret our lead funnel (enquiry → tech pack → sampling → costing → PO). Which stages are bottlenecks for EU outerwear buyers and what actions should merchandising take this week?',
  leadTable:
    'Review these buyer leads for apparel manufacturing: score fit by category (knit/woven/denim), MOQ realism, and compliance expectations. Flag who to prioritize for sampling.',
  leadAutoScoring:
    'Explain how we should score apparel buyer leads: category/capacity fit, MOQ vs our MOQ, compliance load (GOTS/OEKO-TEX), sampling history, and engagement. What defines an A-grade lead for our factory?',
  leadHighFitNext:
    'Given our A-grade apparel leads, recommend the next best action per account: schedule tech pack review, push lap dip, send updated FOB by wash program, or book virtual factory tour.',
  leadColdReactivation:
    'Which dormant garment buyer leads deserve a season-specific reactivation (e.g. SS26, sustainable capsule) versus archive? Propose one concrete hook per prioritized lead.',
  leadCampaignEngagement:
    'For our buyer outreach campaigns, suggest optimal send windows and message angles referencing capacity, compliance packs, and FOB/costing transparency for apparel buyers.',
  leadAudienceBuilder:
    'Propose high-value audience segments for apparel CRM campaigns: by product category, region, sustainability tier, and trade-show source. Who to include in the next nurture wave?',
  leadMessageComposer:
    'Help compose buyer emails for garment manufacturing: reference tech packs, GSM, MOQ, ex-factory dates, and certifications while keeping high reply rates.',
  leadScheduleSend:
    'Optimize email/WhatsApp send times for apparel buyers across EU, US, and Asia for discussions on sampling, costing, and PO readiness.',
  leadCampaignAnalytics:
    'Interpret our apparel outreach campaign metrics. Which themes (capacity, certs, price ladders, sustainability) drive replies and movement to costing?',
  leadInboxIntent:
    'Define triage rules for garment buyer conversations: tag threads as tech pack, costing, compliance, sampling, or complaint — and priority order for merchandising vs costing teams.',
  leadInboxInsights:
    'Explain how conversation intent distribution should drive daily prioritization in an apparel export CRM.',
  leadInboxTriage:
    'Triage this high-intent garment buyer thread: recommend owner (merchandising, costing, compliance, production planning), SLA, and first-response bullets.',
  leadInboxDraftReply:
    'Draft a concise reply for this apparel buyer thread (RFQ, tech pack, costing, or compliance) with next steps and doc asks.',
  leadInboxReplyPlaybooks:
    'How should MARBIM suggest reply playbooks for garment buyer inboxes and route threads to the right team?',
  leadInboxFollowUpNudge:
    'Explain MARBIM auto-nudge for apparel buyer follow-ups: cadence, channel mix, personalization, and approval before send.',
  leadInboxChannelStats:
    'Summarize WhatsApp vs email vs LinkedIn performance for garment buyer conversations and what to change next week.',
  leadInboxSentimentTrends:
    'Interpret sentiment trends in buyer conversations for an apparel exporter and how to recover negative threads.',
  leadAnalyticsOverview:
    'Analyze lead and campaign performance for a garment factory: enquiry quality, speed to first quote, channel mix (email/WhatsApp/LinkedIn), and drop-off by pipeline stage.',
  buyerDirectory:
    'Analyze buyer health for an apparel exporter: payment behaviour, OTIF on ex-factory dates, quality claims (AQL), and seasonality. Summarize risk and upsell opportunities.',
  inventoryMaterials:
    'Review fabric, trims, and accessories stock for cut-make-trim operations: call out shortage risks by style allocation, suggest reorder timing vs lead times, and note consolidation opportunities.',
  defaultWorkspace:
    'You are MARBIM, copilot for a garment manufacturing ERP. Ground answers in apparel workflows: seasons, tech packs, GSM/MOQ, AQL, ex-factory, FOB/CIF, and line efficiency.',
} as const;

export const TOOLBAR_LABELS = {
  exportData: 'Export',
  exportLineSheet: 'Export line sheet',
  seasonFilter: 'Season / drop',
  refresh: 'Refresh',
  askMarbim: 'Ask MARBIM',
} as const;
