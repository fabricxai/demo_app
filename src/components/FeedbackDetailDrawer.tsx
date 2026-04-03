import { motion, AnimatePresence } from 'motion/react';
import { fabricRightDrawerClassWithZ } from './fabric/drawerChrome';
import { X, MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, Clock, User, Calendar, Mail, Phone, Building2, Target, AlertTriangle, CheckCircle2, Sparkles, Send, FileText, History, Lightbulb, BarChart3, Activity, Star, Zap, ArrowRight, Eye, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { MarbimAIButton } from './MarbimAIButton';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface FeedbackDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  feedback: any;
  onAskMarbim: (prompt: string) => void;
}

export function FeedbackDetailDrawer({ isOpen, onClose, feedback, onAskMarbim }: FeedbackDetailDrawerProps) {
  if (!feedback) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Drawer - NO BACKDROP */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={fabricRightDrawerClassWithZ('max-w-[1000px]', 'z-[101]')}
          >
            {/* Header */}
            <div className="relative border-b border-white/10 bg-gradient-to-r from-[#57ACAF]/5 via-transparent to-[#EAB308]/5">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }} />

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#57ACAF] to-[#57ACAF]/60 flex items-center justify-center shadow-lg shadow-[#57ACAF]/20">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl text-white mb-1">Feedback Details</h2>
                      <div className="flex items-center gap-3">
                        <Badge className={`border-none ${
                          feedback.sentiment === 'Positive' 
                            ? 'bg-[#57ACAF]/10 text-[#57ACAF]' 
                            : feedback.sentiment === 'Negative'
                            ? 'bg-[#D0342C]/10 text-[#D0342C]'
                            : 'bg-[#EAB308]/10 text-[#EAB308]'
                        }`}>
                          {feedback.sentiment}
                        </Badge>
                        <span className="text-sm text-[#6F83A7]">Survey ID: {feedback.id}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-180"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-0.5">Satisfaction</div>
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-[#EAB308]" />
                      <span className="text-lg text-white">{feedback.rating}/5</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-0.5">Response Time</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-[#57ACAF]" />
                      <span className="text-lg text-white">{feedback.responseTime || '2.3h'}</span>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-0.5">Category</div>
                    <div className="text-lg text-white">{feedback.category}</div>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <div className="text-xs text-[#6F83A7] mb-0.5">Date</div>
                    <div className="text-lg text-white">{feedback.date}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 pt-4">
              <Tabs defaultValue="overview" className="w-full">
                <div className="relative bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 mb-2 shadow-lg shadow-black/20">
                  <TabsList className="w-full grid grid-cols-4 bg-transparent gap-1.5 p-0 h-auto">
                    <TabsTrigger 
                      value="overview"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sentiment"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-xs">Sentiment</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <History className="w-4 h-4" />
                      <span className="text-xs">Response History</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="ai-recommendations"
                      className="relative flex items-center justify-center gap-2.5 py-3 px-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#EAB308] data-[state=active]:to-[#EAB308]/80 data-[state=active]:text-black data-[state=active]:shadow-lg data-[state=active]:shadow-[#EAB308]/30 text-[#6F83A7] data-[state=active]:font-medium rounded-xl transition-all duration-300"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs">AI Recommendations</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-420px)]">
                    <div className="px-1 pb-6">
                      {/* Overview Tab */}
                      <TabsContent value="overview" className="space-y-6 mt-0">
                    {/* Buyer Information */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#57ACAF]" />
                        Buyer Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-0.5">Buyer Name</div>
                              <div className="text-white">{feedback.buyer}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-0.5">Email</div>
                              <div className="text-white">{feedback.buyer.toLowerCase().replace(/\s+/g, '.')}@company.com</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Phone className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-0.5">Phone</div>
                              <div className="text-white">+1 (555) 123-4567</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-[#6F83A7] mt-0.5" />
                            <div>
                              <div className="text-xs text-[#6F83A7] mb-0.5">Feedback Date</div>
                              <div className="text-white">{feedback.date}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#EAB308]" />
                        Feedback Content
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-[#6F83A7] mb-2">Survey Question</div>
                          <div className="text-white mb-4">How satisfied are you with our recent delivery and product quality?</div>
                        </div>
                        <div>
                          <div className="text-sm text-[#6F83A7] mb-2">Buyer Response</div>
                          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-white leading-relaxed">
                              {feedback.comment || "The recent shipment arrived on time and the fabric quality met our expectations. However, we noticed some minor color variations in batch #3452 that we'd like to discuss. Overall, we're satisfied with the partnership and look forward to continued collaboration."}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-2">Satisfaction Rating</div>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-5 h-5 ${
                                    star <= parseInt(feedback.rating)
                                      ? 'text-[#EAB308] fill-[#EAB308]'
                                      : 'text-[#6F83A7]'
                                  }`}
                                />
                              ))}
                              <span className="text-white ml-2">{feedback.rating}/5</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[#6F83A7] mb-2">Feedback Category</div>
                            <Badge className="bg-[#57ACAF]/10 text-[#57ACAF] border border-[#57ACAF]/20">
                              {feedback.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Extract key insights from feedback content
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Analyze this buyer feedback from ${feedback.buyer} (${feedback.rating}/5 rating, ${feedback.sentiment} sentiment, category: ${feedback.category}): Extract 1) Key satisfaction drivers, 2) Specific concerns or issues mentioned, 3) Actionable improvement areas, 4) Relationship health indicators, 5) Recommended next steps to address feedback.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Related Context */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#57ACAF]" />
                        Related Context
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Recent Orders</div>
                          <div className="text-2xl text-white mb-1">8</div>
                          <div className="text-xs text-[#57ACAF]">Last 90 days</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Previous Feedback</div>
                          <div className="text-2xl text-white mb-1">12</div>
                          <div className="text-xs text-[#6F83A7]">All time</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Avg Satisfaction</div>
                          <div className="text-2xl text-white mb-1">4.2/5</div>
                          <div className="text-xs text-[#57ACAF]">+0.3 this quarter</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Open Issues</div>
                          <div className="text-2xl text-white mb-1">1</div>
                          <div className="text-xs text-[#EAB308]">Low priority</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <Button 
                        className="w-full bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                        onClick={() => toast.success('Opening response composer')}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                        onClick={() => toast.info('Creating follow-up task')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Create Follow-up
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Sentiment Analysis Tab */}
                  <TabsContent value="sentiment" className="space-y-6">
                    {/* Overall Sentiment Score */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#EAB308]" />
                        Overall Sentiment Score
                      </h3>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Positive</span>
                            <span className="text-sm text-[#57ACAF]">78%</span>
                          </div>
                          <Progress value={78} className="h-2 mb-3" />
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Neutral</span>
                            <span className="text-sm text-[#EAB308]">15%</span>
                          </div>
                          <Progress value={15} className="h-2 mb-3" />
                          
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6F83A7]">Negative</span>
                            <span className="text-sm text-[#D0342C]">7%</span>
                          </div>
                          <Progress value={7} className="h-2" />
                        </div>
                        <div className="text-center">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            feedback.sentiment === 'Positive' 
                              ? 'bg-[#57ACAF]/20 border-2 border-[#57ACAF]' 
                              : feedback.sentiment === 'Negative'
                              ? 'bg-[#D0342C]/20 border-2 border-[#D0342C]'
                              : 'bg-[#EAB308]/20 border-2 border-[#EAB308]'
                          }`}>
                            {feedback.sentiment === 'Positive' ? (
                              <ThumbsUp className="w-10 h-10 text-[#57ACAF]" />
                            ) : feedback.sentiment === 'Negative' ? (
                              <ThumbsDown className="w-10 h-10 text-[#D0342C]" />
                            ) : (
                              <Activity className="w-10 h-10 text-[#EAB308]" />
                            )}
                          </div>
                          <div className={`mt-2 ${
                            feedback.sentiment === 'Positive' ? 'text-[#57ACAF]' :
                            feedback.sentiment === 'Negative' ? 'text-[#D0342C]' :
                            'text-[#EAB308]'
                          }`}>
                            {feedback.sentiment}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Analyze sentiment breakdown and emotional tone
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Perform detailed sentiment analysis on feedback from ${feedback.buyer} (${feedback.sentiment}, ${feedback.rating}/5): 1) Break down sentiment by topic (quality, delivery, communication, etc.), 2) Identify emotional tone and intensity, 3) Detect subtle concerns hidden in positive language, 4) Compare to buyer's historical sentiment pattern, 5) Assess relationship health trajectory.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Key Topics Mentioned */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#57ACAF]" />
                        Key Topics Mentioned
                      </h3>
                      <div className="space-y-3">
                        {[
                          { topic: 'Product Quality', sentiment: 'positive', confidence: 92, mentions: 3 },
                          { topic: 'Delivery Timeliness', sentiment: 'positive', confidence: 88, mentions: 2 },
                          { topic: 'Color Consistency', sentiment: 'negative', confidence: 76, mentions: 2 },
                          { topic: 'Communication', sentiment: 'neutral', confidence: 68, mentions: 1 },
                        ].map((item, index) => (
                          <div key={index} className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${
                            item.sentiment === 'positive'
                              ? 'bg-[#57ACAF]/5 border-[#57ACAF]/20'
                              : item.sentiment === 'negative'
                              ? 'bg-[#D0342C]/5 border-[#D0342C]/20'
                              : 'bg-[#EAB308]/5 border-[#EAB308]/20'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white">{item.topic}</span>
                              <div className="flex items-center gap-2">
                                <Badge className={`border-none text-xs ${
                                  item.sentiment === 'positive'
                                    ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                                    : item.sentiment === 'negative'
                                    ? 'bg-[#D0342C]/10 text-[#D0342C]'
                                    : 'bg-[#EAB308]/10 text-[#EAB308]'
                                }`}>
                                  {item.sentiment}
                                </Badge>
                                <Badge className="bg-white/10 text-white border-none text-xs">
                                  {item.mentions}x mentioned
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <Progress value={item.confidence} className="h-1" />
                              </div>
                              <span className="text-xs text-[#6F83A7]">{item.confidence}% confidence</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Extract and analyze all topics with context
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Analyze all topics mentioned in ${feedback.buyer}'s feedback: 1) Extract every topic/theme with sentiment classification, 2) Identify which topics are most important to this buyer, 3) Compare to industry benchmarks and other buyers, 4) Detect emerging concerns before they escalate, 5) Recommend specific actions for each topic area.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emotional Indicators */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#EAB308]" />
                        Emotional Indicators
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                          <div className="text-sm text-[#6F83A7] mb-2">Satisfaction</div>
                          <div className="flex items-center gap-2">
                            <Progress value={82} className="flex-1 h-2" />
                            <span className="text-white">82%</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="text-sm text-[#6F83A7] mb-2">Trust</div>
                          <div className="flex items-center gap-2">
                            <Progress value={76} className="flex-1 h-2" />
                            <span className="text-white">76%</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                          <div className="text-sm text-[#6F83A7] mb-2">Enthusiasm</div>
                          <div className="flex items-center gap-2">
                            <Progress value={68} className="flex-1 h-2" />
                            <span className="text-white">68%</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-[#D0342C]/5 border border-[#D0342C]/20">
                          <div className="text-sm text-[#6F83A7] mb-2">Frustration</div>
                          <div className="flex items-center gap-2">
                            <Progress value={24} className="flex-1 h-2" />
                            <span className="text-white">24%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sentiment Trend */}
                    <div className="bg-gradient-to-br from-[#57ACAF]/10 to-[#57ACAF]/5 border border-[#57ACAF]/20 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-[#57ACAF]/20 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="w-5 h-5 text-[#57ACAF]" />
                        </div>
                        <div>
                          <div className="text-white mb-1">Positive Sentiment Trend</div>
                          <p className="text-sm text-[#6F83A7]">
                            This buyer's sentiment has improved by 15% over the last 3 months, primarily driven by delivery time improvements.
                          </p>
                        </div>
                      </div>
                    </div>
                      </TabsContent>

                      {/* Response History Tab */}
                      <TabsContent value="history" className="space-y-6 mt-0">
                    {/* Previous Responses */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-[#57ACAF]" />
                        Communication History with {feedback.buyer}
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            date: 'Oct 15, 2024',
                            type: 'Email Response',
                            subject: 'Re: Quality feedback on Order #3452',
                            status: 'Sent',
                            preview: 'Thank you for your feedback. We have reviewed the color variation issue...'
                          },
                          {
                            date: 'Sep 28, 2024',
                            type: 'Survey Follow-up',
                            subject: 'Thank you for your September feedback',
                            status: 'Sent',
                            preview: 'We appreciate your positive feedback on our recent improvements...'
                          },
                          {
                            date: 'Sep 10, 2024',
                            type: 'Issue Resolution',
                            subject: 'Resolution: Sample delay concern',
                            status: 'Resolved',
                            preview: 'We have expedited your sample request and implemented process improvements...'
                          },
                        ].map((item, index) => (
                          <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-[#57ACAF]" />
                                <span className="text-white">{item.subject}</span>
                              </div>
                              <Badge className={`border-none text-xs ${
                                item.status === 'Sent' 
                                  ? 'bg-[#57ACAF]/10 text-[#57ACAF]'
                                  : 'bg-[#EAB308]/10 text-[#EAB308]'
                              }`}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[#6F83A7] mb-2">
                              <span>{item.type}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>
                            <p className="text-sm text-[#6F83A7]">{item.preview}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Analyze communication effectiveness and patterns
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Analyze all communication history with ${feedback.buyer}: 1) Evaluate response effectiveness and buyer satisfaction with our replies, 2) Identify communication patterns and preferences, 3) Assess response time performance, 4) Highlight what communication approaches worked best, 5) Recommend improvements for future interactions.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Communication Metrics */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4">Communication Metrics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Avg Response Time</div>
                          <div className="text-2xl text-white mb-1">2.3h</div>
                          <div className="text-xs text-[#57ACAF]">Better than avg</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Total Interactions</div>
                          <div className="text-2xl text-white mb-1">24</div>
                          <div className="text-xs text-[#6F83A7]">Last 12 months</div>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-xs text-[#6F83A7] mb-1">Resolution Rate</div>
                          <div className="text-2xl text-white mb-1">96%</div>
                          <div className="text-xs text-[#57ACAF]">Excellent</div>
                        </div>
                      </div>
                    </div>

                    {/* Response Template Suggestions */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#EAB308]" />
                        Quick Response Templates
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: 'Acknowledge & Thank', action: 'Use Template' },
                          { title: 'Address Concern', action: 'Use Template' },
                          { title: 'Schedule Follow-up', action: 'Use Template' },
                        ].map((template, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-between border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                            onClick={() => toast.info(`Loading template: ${template.title}`)}
                          >
                            <span>{template.title}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                    </div>
                      </TabsContent>

                      {/* AI Recommendations Tab */}
                      <TabsContent value="ai-recommendations" className="space-y-6 mt-0">
                    {/* Recommended Actions */}
                    <div className="bg-gradient-to-br from-[#EAB308]/10 to-[#EAB308]/5 border border-[#EAB308]/20 rounded-xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EAB308] to-[#EAB308]/80 flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#EAB308]/30">
                          <Sparkles className="w-6 h-6 text-black" />
                        </div>
                        <div>
                          <div className="text-white mb-1">AI-Powered Action Recommendations</div>
                          <p className="text-sm text-[#6F83A7]">
                            MARBIM has analyzed this feedback and generated specific, prioritized actions to improve buyer satisfaction.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            priority: 'High',
                            action: 'Address Color Variation Concern',
                            description: 'Schedule quality review meeting to discuss batch #3452 color variations',
                            impact: 'Prevents potential quality issue escalation',
                            timeline: 'Within 48 hours',
                            color: 'orange'
                          },
                          {
                            priority: 'Medium',
                            action: 'Send Personalized Thank You',
                            description: 'Acknowledge positive feedback on delivery improvements',
                            impact: 'Reinforces relationship and encourages continued feedback',
                            timeline: 'Within 24 hours',
                            color: 'yellow'
                          },
                          {
                            priority: 'Medium',
                            action: 'Update Quality Control Process',
                            description: 'Implement additional color consistency checks for this buyer',
                            impact: 'Prevents similar issues in future orders',
                            timeline: 'This week',
                            color: 'yellow'
                          },
                          {
                            priority: 'Low',
                            action: 'Share Success Story',
                            description: 'Highlight delivery time improvements in next quarterly review',
                            impact: 'Demonstrates commitment to continuous improvement',
                            timeline: 'Next month',
                            color: 'green'
                          },
                        ].map((rec, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border transition-all hover:scale-[1.01] ${
                              rec.color === 'orange'
                                ? 'bg-[#EAB308]/5 border-[#EAB308]/20'
                                : rec.color === 'yellow'
                                ? 'bg-[#EAB308]/5 border-[#EAB308]/20'
                                : 'bg-[#57ACAF]/5 border-[#57ACAF]/20'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={`border-none text-xs ${
                                  rec.color === 'orange' || rec.color === 'yellow'
                                    ? 'bg-[#EAB308]/10 text-[#EAB308]'
                                    : 'bg-[#57ACAF]/10 text-[#57ACAF]'
                                }`}>
                                  {rec.priority} Priority
                                </Badge>
                                <span className="text-white">{rec.action}</span>
                              </div>
                              <Button
                                size="sm"
                                className="bg-white/10 hover:bg-white/20 text-white border-none"
                                onClick={() => toast.success('Action added to task list')}
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Add Task
                              </Button>
                            </div>
                            <p className="text-sm text-[#6F83A7] mb-2">{rec.description}</p>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-[#6F83A7]">
                                <Zap className="w-3 h-3" />
                                <span>{rec.impact}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[#6F83A7]">
                                <Clock className="w-3 h-3" />
                                <span>{rec.timeline}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Generate comprehensive action plan with detailed steps
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Create comprehensive action plan for ${feedback.buyer}'s feedback (${feedback.rating}/5, ${feedback.sentiment}): 1) Prioritize all necessary actions by urgency and impact, 2) Provide detailed execution steps for each action, 3) Assign resource requirements and ownership, 4) Create timeline with milestones, 5) Define success metrics, 6) Develop buyer communication strategy, 7) Set up follow-up and monitoring plan.`}
                            onAskMarbim={onAskMarbim}
                            size="lg"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Suggested Response */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Send className="w-5 h-5 text-[#57ACAF]" />
                        AI-Generated Response Draft
                      </h3>
                      <div className="mb-4">
                        <Textarea
                          className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-[#6F83A7] resize-none"
                          defaultValue={`Dear ${feedback.buyer} team,

Thank you for taking the time to share your valuable feedback with us. We're delighted to hear that our recent delivery performance and product quality have met your expectations.

Regarding the color variations you mentioned in batch #3452, we take this concern very seriously. Our Quality Control team will conduct a thorough review of this batch, and I'd like to schedule a brief call with you this week to discuss the details and ensure we address this matter to your complete satisfaction.

We truly value our partnership with you and remain committed to continuous improvement. Your feedback helps us deliver even better service.

I'll reach out separately to schedule that call at your convenience.

Best regards,
Customer Success Team`}
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          className="flex-1 bg-gradient-to-r from-[#57ACAF] to-[#57ACAF]/80 text-white hover:from-[#57ACAF]/90 hover:to-[#57ACAF]/70 shadow-lg shadow-[#57ACAF]/20"
                          onClick={() => toast.success('Response sent successfully')}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Response
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/10 text-white hover:bg-white/5 bg-[rgba(255,255,255,0)]"
                          onClick={() => toast.info('Editing response')}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#57ACAF] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Generate customized response based on buyer history
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Generate a personalized, professional response to ${feedback.buyer}'s feedback: 1) Acknowledge their specific points (on-time delivery, quality satisfaction, color variation concern), 2) Match their communication style and tone, 3) Address the color variation issue with specific next steps, 4) Reference our relationship history and past positive interactions, 5) Include appropriate follow-up actions and timeline, 6) Close with forward-looking partnership language.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Related Insights */}
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6">
                      <h3 className="text-white mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-[#EAB308]" />
                        Related Insights
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-[#57ACAF]/5 border border-[#57ACAF]/20">
                          <div className="flex items-start gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-[#57ACAF] mt-0.5" />
                            <div className="text-white text-sm">Similar buyers also value delivery speed</div>
                          </div>
                          <p className="text-xs text-[#6F83A7]">
                            3 other buyers in the same segment mentioned delivery improvements as a key satisfaction driver this month.
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-[#EAB308]/5 border border-[#EAB308]/20">
                          <div className="flex items-start gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-[#EAB308] mt-0.5" />
                            <div className="text-white text-sm">Color variation is an emerging concern</div>
                          </div>
                          <p className="text-xs text-[#6F83A7]">
                            2 additional buyers reported similar color consistency issues in the past 14 days. Consider system-wide quality review.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 mt-4">
                        <div className="flex items-start gap-2 justify-between">
                          <div className="flex items-start gap-2 flex-1">
                            <Sparkles className="w-4 h-4 text-[#EAB308] flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-[#6F83A7]">
                              Identify cross-buyer patterns and system-wide improvements
                            </div>
                          </div>
                          <MarbimAIButton
                            marbimPrompt={`Analyze ${feedback.buyer}'s feedback in context of all buyer feedback: 1) Identify patterns shared with other buyers, 2) Determine if issues are buyer-specific or systemic, 3) Compare this buyer's concerns to industry benchmarks, 4) Recommend system-wide process improvements vs. buyer-specific actions, 5) Prioritize improvements by impact on overall buyer satisfaction.`}
                            onAskMarbim={onAskMarbim}
                            size="sm"
                          />
                        </div>
                      </div>
                      </div>
                      </TabsContent>
                    </div>
                  </ScrollArea>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}