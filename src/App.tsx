import { useState, useEffect } from 'react';
import {
  MapPin,
  Search,
  Timer,
  ChevronRight,
  Plus,
  Shield,
  ChevronLeft,
  Heart,
  TrendingUp,
  Wallet,
  Send,
  MessageSquare,
  Mic,
  MicOff,
  Bell,
  Phone,
  ThumbsUp,
  Check,
  Gift,
  Briefcase,
  Clock,
  HelpCircle,
  Share2,
  MoreHorizontal,
  Home,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Award,
  Upload,
  ArrowRight,
  ShieldCheck,
  Users,
  Eye,
  Lock
} from 'lucide-react';
import { initialUser, initialTasks, initialMessages, initialDonations, initialLeaders } from './data';
import { Task, TaskCategory, TaskStatus, Message, DonationProject, User } from './types';

export default function App() {
  // Mobile Simulator State
  const [activeTab, setActiveTab] = useState<'home' | 'publish' | 'orders' | 'messages' | 'mine'>('home');
  const [activeRole, setActiveRole] = useState<'runner' | 'publisher'>('runner');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [user, setUser] = useState<User>(initialUser);
  const [donations, setDonations] = useState<DonationProject[]>(initialDonations);
  const [leaders] = useState(initialLeaders);
  
  // Custom Styles configurations corresponding to different visual mockups
  const [homeStyle, setHomeStyle] = useState<'standard' | 'alternative'>('standard');
  const [orderMarketStyle, setOrderMarketStyle] = useState<'standard' | 'alternative'>('standard');
  
  // Secondary views
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDonationPage, setShowDonationPage] = useState<boolean>(false);
  const [showPromoModal, setShowPromoModal] = useState<boolean>(false);
  const [showLoveRewardPopup, setShowLoveRewardPopup] = useState<boolean>(false);
  const [rewardsEarned, setRewardsEarned] = useState<number>(0);
  
  // Interactive publishing state
  const [publishCategory, setPublishCategory] = useState<TaskCategory>('install');
  const [publishTitle, setPublishTitle] = useState<string>('');
  const [publishDesc, setPublishDesc] = useState<string>('');
  const [publishAddress, setPublishAddress] = useState<string>('');
  const [publishTime, setPublishTime] = useState<string>('');
  const [publishBudget, setPublishBudget] = useState<number>(100);
  const [publishVerifyReq, setPublishVerifyReq] = useState<boolean>(false);
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [justPublished, setJustPublished] = useState<boolean>(false);
  
  // AI Interactive Floating Chat States
  const [showAiChat, setShowAiChat] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
    draft?: {
      title: string;
      category: TaskCategory;
      description: string;
      budget: number;
    } | null;
  }>>([
    {
      role: 'assistant',
      content: '老铁好！我是您的“快乐牛马-AI智囊”！无论你想找人【帮忙跑腿】、【清洁打扫】、【代遛毛孩子】还是【组装家具】，或者想学习怎么在平台快速抢高佣单子，直接把需求和问题输入发给我，我会秒级帮你自动润色并生成完美的发布单草稿！'
    }
  ]);
  const [aiChatInputValue, setAiChatInputValue] = useState<string>('');
  const [aiChatLoading, setAiChatLoading] = useState<boolean>(false);
  
  // Simulated State Engine Actions
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<TaskCategory | 'all'>('all');
  
  // Auto-scrolling simulated messages/tickers
  const [recentLiveNotification, setRecentLiveNotification] = useState<string>('恭喜“快乐牛马-小王”昨天成功提取首笔接单收益150.00元！');

  useEffect(() => {
    const notifications = [
      '系统安全提示：线下服务时请开启“全局录音”存证功能，保障人身安全！',
      '恭喜用户“张小牛”成功入驻，获得128爱心分积分！',
      '今日活跃：上海市静安区发布家政、跑腿任务共32单，求贤若渴中。',
      '爱心提示：每赞助10爱心分，“快乐牛马”基金会将为您采购一元实物资源送出！'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % notifications.length;
      setRecentLiveNotification(notifications[index]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Trigger real server-side AI Title generation by calling our Express /api/ai/generate API!
  const handleAiGenerate = async () => {
    setAiGenerating(true);
    const categoryLabels: Record<string, string> = {
      run: '跑腿代买',
      clean: '家政保洁',
      pet: '宠物代遛',
      install: '家修组装',
      writeup: '文案设计',
      tutor: '家教陪练',
      tech: '技术外包',
      queue: '排队占位',
      hospital: '陪诊陪办',
      photo: '拍照协助',
      help: '临时帮忙'
    };

    const label = categoryLabels[publishCategory] || '同城轻任务';

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryLabel: label }),
      });
      if (response.ok) {
        const data = await response.json();
        setPublishTitle(data.title || '');
        setPublishDesc(data.description || '');
      } else {
        throw new Error('Server generation error');
      }
    } catch (e) {
      console.warn('AI integration offline, using high-fidelity local mock data fallback.', e);
    } finally {
      setAiGenerating(false);
    }
  };

  // Sends interactive AI chat message to server to get intelligent custom drafts or advice
  const handleSendAiChatMessage = async (presetText?: string) => {
    const textToSend = presetText || aiChatInputValue;
    if (!textToSend.trim()) return;

    if (!presetText) {
      setAiChatInputValue('');
    }

    const newUserMessage = { role: 'user' as const, content: textToSend };
    const updatedMessages = [...aiChatMessages, newUserMessage];
    setAiChatMessages(updatedMessages);
    setAiChatLoading(true);

    try {
      const apiHistory = updatedMessages.map(m => ({
        role: m.role,
        content: m.content
      })).slice(-8);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiHistory })
      });

      if (response.ok) {
        const data = await response.json();
        setAiChatMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: data.text || '老铁刚才网络抖了，你再教教我怎么干！',
            draft: data.draft || null
          }
        ]);
      } else {
        throw new Error('AI responding failed');
      }
    } catch (e) {
      console.warn('AI Chat API offline error, using robust local intelligent mockup fallback.', e);
      let mockReply = {
        text: '铁子，网络稍微有点开小差！但我作为牛马智囊本地备用核心依然在线！打工虽然辛苦，但只要动脑筋起草好单子也相当解压。想写什么分类的单子（如搬家、代买、遛狗、文案、保洁等）直接对我说就行，我直接甩你一键应用的终极大模版！',
        draft: null as any
      };
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('排') || lower.includes('queue') || lower.includes('代拍') || lower.includes('代排')) {
        mockReply = {
          text: '代排队跑腿任务我给你润色好啦！最近天气多变，网红店一排就是一小时，雇主们很愿意出重金！点击下方直接“一键应用”到草稿即可发布：',
          draft: {
            title: '静安区网红甜品代排队半小时并送至恒隆',
            category: 'run',
            description: '帮忙去静安寺地下商城网红烘焙店代排队购买限购起司面包2盒。买到后请第一时间配送送达恒隆广场写字楼，保持面包酥脆温热。',
            budget: 45
          }
        };
      } else if (lower.includes('狗') || lower.includes('猫') || lower.includes('宠')) {
        mockReply = {
          text: '安排！毛孩子代遛不仅能赚兼职佣金还能免费撸狗，爽到飞起！起草如下优质遛狗模板，点击一键全自动填入发布：',
          draft: {
            title: '帮遛萨摩耶30分钟 (自带拾便袋/徐汇滨江)',
            category: 'pet',
            description: '徐汇滨江步道附近，帮遛一只体能充沛的萨摩耶。毛孩子喜欢疯跑！请拉紧牵绳，不给它吃路边的异物。回来前帮它用湿巾把四只脚和肚皮擦拭干净并倒上纯净温水。',
            budget: 35
          }
        };
      } else if (lower.includes('搬') || lower.includes('装') || lower.includes('维修') || lower.includes('移')) {
        mockReply = {
          text: '重活力气活来啦！雇主老哥通常舍得出钱。我准备了一个最常见的行李箱短途搬运和宜家家具拼装一体模板：',
          draft: {
            title: '普通白领行李短途搬移与宜家简易电脑桌拼装',
            category: 'install',
            description: '因周末更换住房，需要来一位靠谱老哥协助将3个大行李箱搬上无电梯3楼。并协助组装一款宜家小电脑桌，需要自备螺丝刀等工具。现场有详细纸质组装图纸。',
            budget: 110
          }
        };
      } else if (lower.includes('文') || lower.includes('写') || lower.includes('ppt') || lower.includes('设计') || lower.includes('打字')) {
        mockReply = {
          text: '白领老板急需智力牛马！这个模板优雅且预算充足，点击下方直接开始兼职：',
          draft: {
            title: '急需同城高手做一份5页餐饮项目汇报书PPT美化',
            category: 'writeup',
            description: '关于一份烘焙店创业计划书的５页大纲。现有原稿及多张精美食物图片，需要懂排版的伙伴美化成一套精美的简约商务风汇报演示PPT。',
            budget: 135
          }
        };
      } else if (lower.includes('保洁') || lower.includes('扫') || lower.includes('家政') || lower.includes('洗')) {
        mockReply = {
          text: '没问题，家政除尘做饭来啦！大白大净，雇主爽快：',
          draft: {
            title: '两室一厅周末基础家政除尘拖地',
            category: 'clean',
            description: '日常做卫生。主卧和客厅地板拖两遍、更换床上被套、丢弃厨卫两处垃圾。自带基本清洁剂，主人提供吸尘器和专业无纺拖布。全程请佩戴干净手套。',
            budget: 70
          }
        };
      }

      setAiChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: mockReply.text,
          draft: mockReply.draft
        }
      ]);
    } finally {
      setAiChatLoading(false);
    }
  };

  // Adopt the AI generated task draft automatically into state and navigate
  const handleAdoptDraft = (draft: { title: string, category: TaskCategory, description: string, budget: number }) => {
    setActiveTab('publish');
    setPublishCategory(draft.category || 'install');
    setPublishTitle(draft.title || '');
    setPublishDesc(draft.description || '');
    setPublishBudget(draft.budget || 50);
    setPublishAddress('上海市静安区静安寺商务大楼C座');
    setPublishTime('今天 18:00 之前');
    
    // Auto populate custom parameters
    setShowAiChat(false);
    alert(`🎉 任务草稿应用成功！\n\n【草稿标题】: ${draft.title}\n【建议价格】: ¥${draft.budget}\n\n已自动为您跳转至“发布”页面并填入！您可以进行二次润色，或者直接滑行到底部点击一键上链发布！`);
  };

  // Publisher submits a new Task
  const handlePublishTask = () => {
    if (!publishTitle.trim()) {
      alert('请先填写任务标题！');
      return;
    }

    const categoryLabels: Record<string, string> = {
      run: '跑腿',
      clean: '家政',
      pet: '宠物',
      install: '搬家',
      writeup: '文案',
      tutor: '家教',
      tech: '技术',
      queue: '排队',
      hospital: '陪诊',
      photo: '拍照',
      help: '帮忙'
    };

    const newTask: Task = {
      id: `task_custom_${Date.now()}`,
      publisherId: user.id,
      publisherName: user.name,
      publisherAvatar: user.avatar,
      publisherCredit: user.creditScore,
      publisherVerifyText: '已验证发单人',
      category: publishCategory,
      categoryLabel: categoryLabels[publishCategory] || '跑腿',
      title: publishTitle,
      description: publishDesc || '暂无更多补充说明。按图索骥即可。',
      addressText: publishAddress || '上海市黄浦区人民广场邻近写字楼',
      distance: '0.5km',
      pubTimeText: '刚刚发布',
      serviceTime: publishTime || '待协商协定',
      budget: publishBudget || 50,
      status: 'open',
      requirementsList: publishDesc ? [publishDesc] : ['1. 按平台约定流程，双方友好合作。'],
      imageUrl: publishCategory === 'install' ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt0ChC3moLt5Dghkq1EiVVJ1mF-yS9UpFJ2HWJ1nHmSlO4JfKgej0WBLCatoCNldHQA_9uQzdmJMfuuLzLDzzzY7hXf-1uEGnOGG7ANFmze0ehTp0WiLq101fWMPeIxIS5Yb6Wr6FESOXguvu2LotI9P3mo00JGJ7BIwYOqRdhXVkXzP1Y0FNuVaQzMzhdxpC09ldLyGPCGAuVB9jceykfpdKkjjx8b6ABGtSCoFxnimpiH1g8N8V6oc3TI3DQAG5MFHVqjy7PUIyu' : undefined
    };

    setTasks([newTask, ...tasks]);
    setJustPublished(true);
    setTimeout(() => {
      setJustPublished(false);
      setActiveTab('home');
      // Reset form
      setPublishTitle('');
      setPublishDesc('');
      setPublishAddress('');
      setPublishTime('');
      setPublishBudget(100);
    }, 1500);

    // Add task message notification
    const newMessage: Message = {
      id: `msg_pub_${Date.now()}`,
      title: '任务发布成功',
      description: `您刚刚发布的任务“${publishTitle}”已自动托管预算 ¥${publishBudget}，正等待接单人。`,
      timeText: '刚刚',
      type: 'order',
      read: false,
      relatedTaskId: newTask.id
    };
    setMessages([newMessage, ...messages]);
  };

  // Simulated state controls
  const triggerMockApplication = () => {
    // Inject a new runner application for the user's latest published task or select task
    const targetTask = tasks[0];
    if (!targetTask) return;
    
    const updated = tasks.map(t => {
      if (t.id === targetTask.id) {
        return {
          ...t,
          status: 'applied' as TaskStatus,
          appliedRunnerIds: ['user_runner_sm_1']
        };
      }
      return t;
    });
    setTasks(updated);

    const newMessage: Message = {
      id: `msg_apply_${Date.now()}`,
      title: '新申请人通知',
      description: `您的任务“${targetTask.title}”有新的牛马申请了，对方已实名认证且信用卓越。`,
      timeText: '14:20',
      type: 'order',
      read: false,
      relatedTaskId: targetTask.id
    };
    setMessages([newMessage, ...messages]);
    alert(`成功模拟应用！您的任务「${targetTask.title}」已收到接单申请。可前往“消息”或“订单”查看！`);
  };

  // Reset entire application database state
  const resetAllData = () => {
    setTasks(initialTasks);
    setMessages(initialMessages);
    setUser(initialUser);
    setDonations(initialDonations);
    setSelectedTask(null);
    setShowDonationPage(false);
    setIsRecording(false);
    alert('「快乐牛马」小程序模拟器数据库已重置为默认高保真状态。');
  };

  // Complete active task / simulate workflow state change
  const advanceTaskState = (taskId: string, currentStatus: TaskStatus) => {
    let nextStatus: TaskStatus = currentStatus;
    let titleMsg = '';
    let bodyMsg = '';

    if (currentStatus === 'open' || currentStatus === 'applied') {
      nextStatus = 'in_progress';
      titleMsg = '任务开始进行中';
      bodyMsg = '您的订单开始进行，双方已启动实时录音保障服务，祝工作顺利！';
    } else if (currentStatus === 'in_progress') {
      nextStatus = 'pending_confirm';
      titleMsg = '接单人提交完工';
      bodyMsg = '您接单的同城小事已成功提交完工凭证，等待发单人核对并一键确认奖励！';
    } else if (currentStatus === 'pending_confirm') {
      nextStatus = 'completed';
      titleMsg = '订单圆满完成';
      bodyMsg = '恭喜您完成了任务并获得报酬！您的1点爱心分已作为奖励入库，感谢您的奉献！';
      
      // Update balance & points
      const taskObj = tasks.find(t => t.id === taskId);
      const budgetValue = taskObj ? taskObj.budget : 20;
      setUser(prev => ({
        ...prev,
        loveScore: prev.loveScore + 1,
        walletBalance: prev.walletBalance + budgetValue,
        monthlyIncome: prev.monthlyIncome + budgetValue
      }));
      setRewardsEarned(1);
      setShowLoveRewardPopup(true);
    }

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: nextStatus, selectedRunnerId: 'user_cow_horse_99' };
      }
      return t;
    }));

    // Generate message
    const newMsg: Message = {
      id: `msg_workflow_${Date.now()}`,
      title: titleMsg,
      description: bodyMsg,
      timeText: '刚刚',
      type: 'order',
      read: false,
      relatedTaskId: taskId
    };
    setMessages([newMsg, ...messages]);

    // Update active selected task
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(prev => prev ? { ...prev, status: nextStatus, selectedRunnerId: 'user_cow_horse_99' } : null);
    }
  };

  // User donates credits to charity
  const handleDonatePoints = (projectId: string, amount: number = 10) => {
    if (user.loveScore < amount) {
      alert(`爱心分余额不足，需要赚取更多爱心分哦！目前余额: ${user.loveScore} 分`);
      return;
    }

    setUser(prev => ({ ...prev, loveScore: prev.loveScore - amount }));
    setDonations(prev => prev.map(proj => {
      if (proj.id === projectId) {
        const nextPoints = proj.currentPoints + amount;
        return {
          ...proj,
          currentPoints: nextPoints,
          progressPercent: Math.min(100, Math.round((nextPoints / proj.targetPoints) * 100))
        };
      }
      return proj;
    }));

    // Trigger sweet success message
    alert(`代捐赠成功！您为“${donations.find(p => p.id === projectId)?.title}”成功捐款了 ${amount} 个爱心分，积沙成塔，感谢您的倾囊相助！`);
  };

  // Filter nearby feed
  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryFilter === 'all' || t.category === activeCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row antialiased">
      
      {/* LEFT: SIMULATOR CONTROL CONSOLE (OUTSIDE PHONE VIEW) */}
      <aside className="w-full md:w-[32%] bg-slate-800 p-6 flex flex-col border-b md:border-r md:border-b-0 border-slate-700 overflow-y-auto shrink-0 select-none">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio Full-Stack Premium MVP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            <span>快乐牛马</span>
            <span className="text-xs bg-slate-700 px-2 py-0.5 rounded text-slate-300">V2.4.1</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            同城轻任务/零工智能帮扶小程序。拥有真实 <strong>Server-Side Google Gemini AI</strong> 意向任务大纲辅助，一键体验打工兼职、托管保障、发布申领到爱心奉献的全套闭环。
          </p>
        </div>

        {/* Dynamic Simulator Controllers */}
        <section className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 mb-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-teal-400" />
            <span>智能沙盒交互控制器</span>
          </h3>

          <div className="space-y-2.5">
            <div>
              <p className="text-xs text-slate-400 mb-1">1. 当前微信扮演角色切换：</p>
              <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg">
                <button
                  onClick={() => {
                    setActiveRole('runner');
                    setActiveTab('home');
                    setSelectedTask(null);
                  }}
                  className={`py-1.5 rounded text-xs font-medium transition-all ${
                    activeRole === 'runner'
                      ? 'bg-teal-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  接单人模式 (Runner)
                </button>
                <button
                  onClick={() => {
                    setActiveRole('publisher');
                    setActiveTab('home');
                    setSelectedTask(null);
                  }}
                  className={`py-1.5 rounded text-xs font-medium transition-all ${
                    activeRole === 'publisher'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  发单人模式 (Publisher)
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">2. 首页渲染风格变换：</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setHomeStyle('standard')}
                  className={`py-1.5 rounded text-xs px-2 text-center border font-medium ${
                    homeStyle === 'standard'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-slate-700 hover:border-slate-500 text-slate-400'
                  }`}
                >
                  大网格版 (Standard Grid)
                </button>
                <button
                  onClick={() => setHomeStyle('alternative')}
                  className={`py-1.5 rounded text-xs px-2 text-center border font-medium ${
                    homeStyle === 'alternative'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-slate-700 hover:border-slate-500 text-slate-400'
                  }`}
                >
                  分类芯片版 (View 10 Chips)
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">3. 接单市场保障选项：</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOrderMarketStyle('standard')}
                  className={`py-1.5 rounded text-xs px-2 text-center border font-medium ${
                    orderMarketStyle === 'standard'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-slate-700 hover:border-slate-500 text-slate-400'
                  }`}
                >
                  默认精简列表
                </button>
                <button
                  onClick={() => setOrderMarketStyle('alternative')}
                  className={`py-1.5 rounded text-xs px-2 text-center border font-medium ${
                    orderMarketStyle === 'alternative'
                      ? 'border-teal-500 bg-teal-500/10 text-teal-400'
                      : 'border-slate-700 hover:border-slate-500 text-slate-400'
                  }`}
                >
                  进阶保险卡片版
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={triggerMockApplication}
                className="w-full text-xs font-semibold py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg flex items-center justify-between border border-slate-700 transition-colors"
              >
                <span>🚀 模拟他人申请我发布的任务</span>
                <ArrowRight className="w-3 h-3 text-teal-400 animate-pulse" />
              </button>
              
              <button
                onClick={() => {
                  setUser(prev => ({ ...prev, loveScore: prev.loveScore + 10 }));
                  alert('成功赞助！您的累计爱心分 +10 分，可以去赞助助学公益项目啦！');
                }}
                className="w-full text-xs font-semibold py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-lg flex items-center justify-between border border-slate-700 transition-all active:scale-[0.98]"
              >
                <span>❤️ 劳有所得：直接派发10点爱心值</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              </button>

              <button
                onClick={resetAllData}
                className="w-full text-xs font-semibold py-2 px-3 bg-slate-800 hover:bg-rose-900/40 text-slate-300 rounded-lg flex items-center justify-between border border-slate-700 hover:border-rose-500/30 transition-colors"
              >
                <span>🔄 恢复并重置数据 (Reset Engine)</span>
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* Brand Core Values Checklist */}
        <section className="mt-auto bg-slate-900/30 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold tracking-wider text-slate-500 uppercase">小程序核心设计宗旨</h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span><strong>高安全性</strong>：未实名不得接单，深夜自动风控提示。</span>
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span><strong>爱心溢出</strong>：完成订单获分，代捐赠乡村助学。</span>
            </li>
            <li className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span><strong>全程存证</strong>：首创“全局录音”服务保障双方安全。</span>
            </li>
          </ul>
        </section>
      </aside>

      {/* CENTER & RIGHT: PHONE FRAME SIMULATOR */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-slate-950 overflow-y-auto">
        <div className="w-full max-w-[420px] bg-slate-900 rounded-[50px] shadow-2xl p-3 border-4 border-slate-800 relative z-10 flex flex-col scale-95 md:scale-100 transition-transform">
          
          {/* Top Notch Area */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-5 bg-slate-950 rounded-full flex items-center justify-between px-6 z-50">
            <div className="w-3.5 h-3.5 bg-slate-900 rounded-full border border-slate-800"></div>
            <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-blue-900/60 rounded-full"></div>
          </div>

          {/* INTERNAL SIMULATOR CONTENT CANVAS */}
          <div className="w-full bg-[#f0f2f5] text-slate-900 rounded-[40px] overflow-hidden flex flex-col font-sans h-[780px] relative select-none">
            
            {/* Custom WeChat Header Status Bar */}
            <header className="pt-7 px-5 pb-3 bg-white flex justify-between items-center z-20 shrink-0 border-b border-slate-100 select-none">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">上海</span>
                <MapPin className="w-3 h-3 text-[#006876] fill-[#006876]" />
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-tight text-[#006876] flex items-center gap-1">
                <span>快乐牛马</span>
                <span className="text-[10px] bg-teal-500/10 text-teal-700 px-1 py-0.2 rounded">小程序</span>
              </div>

              {/* Classic WeChat Controls Panel */}
              <div className="bg-slate-100/90 py-1 px-2.5 rounded-full border border-slate-200/50 flex items-center gap-3">
                <button onClick={() => alert('微信面板: 感谢您的信任！')} className="flex items-center">
                  <MoreHorizontal className="w-4 h-4 text-slate-700" />
                </button>
                <div className="w-px h-3 bg-slate-300"></div>
                <button onClick={resetAllData} className="flex items-center">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                  </div>
                </button>
              </div>
            </header>

            {/* Simulated Live Audio Banner at top when isRecording is on (View 7) */}
            {isRecording && (
              <div className="bg-teal-50 text-teal-800 px-4 py-2 flex items-center gap-2 z-10 text-xs shrink-0 animate-pulse border-b border-teal-100">
                <div className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-ping shrink-0" />
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>录音中：保障双方安全，交易中开启实时语音存证</span>
              </div>
            )}

            {/* INTERNAL ROUTE CANVAS AND VIEWS */}
            <div className="flex-1 overflow-y-auto pb-24 relative">
              
              {/* LOVE SCORE CHARITY DONATION SCREEN (View 3) */}
              {showDonationPage ? (
                <div className="bg-[#f0f2f5] animate-slideIn">
                  {/* Top Bar for Inner Section */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-30">
                    <button onClick={() => setShowDonationPage(false)} className="flex items-center text-[#006876]">
                      <ChevronLeft className="w-5 h-5 font-bold" />
                      <span className="text-xs font-semibold">返回</span>
                    </button>
                    <span className="font-bold text-sm">爱心捐赠</span>
                    <HelpCircle className="w-4 h-4 text-[#006876]" />
                  </div>

                  <div className="p-4 space-y-4">
                    {/* User Balance Credit Card */}
                    <div className="bg-gradient-to-r from-[#006876] to-[#00acc1] text-white p-5 rounded-2xl relative overflow-hidden shadow-md">
                      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
                      <p className="text-xs text-white/80 mb-1">我的爱心分余额</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight">{user.loveScore}</span>
                        <span className="text-xs text-white/80">分</span>
                      </div>
                      <div className="mt-4 bg-white/20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        <span>让每一分汗水更有温度</span>
                      </div>
                    </div>

                    {/* Impact Statement Info Card */}
                    <div className="bg-white rounded-2xl p-4 border border-teal-100 flex gap-3 shadow-sm">
                      <div className="bg-orange-100 p-2.5 rounded-xl text-[#ff9800] shrink-0 h-10 w-10 flex items-center justify-center">
                        <Award className="w-5 h-5 fill-[#ff9800]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 mb-1">什么是爱心分？</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          您的每一次辛劳工作所得的平台奖励，都可以转化为爱心分。每10爱心分将由“快乐牛马”基金会捐赠1元实物物资至下方相应的乡村公益项目。
                        </p>
                      </div>
                    </div>

                    {/* Donation Projects Section */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">公益赞助项目</h3>
                      
                      {donations.map(proj => (
                        <div key={proj.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                          <div className="h-32 relative">
                            <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 bg-[#006876] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">
                              官方认证
                            </span>
                          </div>
                          
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-slate-800">{proj.title}</h4>
                              <span className="text-xs px-2.5 py-0.5 bg-teal-50 text-teal-800 rounded font-semibold">{proj.tag}</span>
                            </div>
                            
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{proj.description}</p>
                            
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>筹款进度 {proj.progressPercent}%</span>
                                <span className="text-[#006876] font-semibold">{proj.currentPoints} / {proj.targetPoints} 分</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#00acc1] to-[#006876] rounded-full" style={{ width: `${proj.progressPercent}%` }} />
                              </div>
                            </div>

                            <button
                              onClick={() => handleDonatePoints(proj.id, 10)}
                              className="w-full bg-[#ff9800] hover:brightness-105 text-white py-2 rounded-xl text-xs font-bold shadow-sm active:scale-[0.98] transition-all"
                            >
                              立即捐赠 10 爱心分
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Leaderboard / History (View 3 bottom) */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>爱心贡献英雄榜</span>
                      </h3>

                      <div className="space-y-3.5">
                        {leaders.map(lead => (
                          <div key={lead.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img src={lead.avatar} alt={lead.name} className="w-8 h-8 rounded-full border border-slate-200" />
                                <span className={`absolute -top-1 -right-1 text-[8px] w-4 h-4 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${
                                  lead.rank === 1 ? 'bg-amber-500' : 'bg-slate-400'
                                }`}>
                                  {lead.rank}
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{lead.name}</p>
                                <p className="text-[10px] text-slate-400">累计已捐赠 {lead.points} 爱心分</p>
                              </div>
                            </div>
                            <Gift className="w-4 h-4 text-rose-500" />
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ) : selectedTask ? (
                
                /* TASK DETAIL PAGE (View 5 & 7) */
                <div className="bg-[#f0f2f5] animate-slideIn">
                  {/* Sticky Sub-Header */}
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100 sticky top-0 z-30">
                    <button onClick={() => setSelectedTask(null)} className="flex items-center text-[#006876]">
                      <ChevronLeft className="w-5 h-5 font-bold" />
                      <span className="text-xs font-semibold">返回市场</span>
                    </button>
                    <span className="font-bold text-sm">任务详情</span>
                    <div className="flex items-center gap-3 text-slate-600">
                      <Share2 className="w-4 h-4 cursor-pointer" />
                      <MoreHorizontal className="w-4 h-4 cursor-pointer" />
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Status Pill */}
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        selectedTask.status === 'open' ? 'bg-amber-50 text-amber-700' :
                        selectedTask.status === 'in_progress' ? 'bg-emerald-50 text-emerald-700' :
                        selectedTask.status === 'pending_confirm' ? 'bg-blue-50 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>{
                          selectedTask.status === 'open' ? '待接单' :
                          selectedTask.status === 'applied' ? '有人申领中' :
                          selectedTask.status === 'in_progress' ? '任务进行中' :
                          selectedTask.status === 'pending_confirm' ? '待审核结算' :
                          '已完成'
                        }</span>
                      </span>
                    </div>

                    <h1 className="text-lg font-bold text-slate-900 leading-tight mb-2">
                      {selectedTask.title}
                    </h1>

                    {/* Quick Info Bento Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 bg-[#fffcf5] p-4.5 rounded-[24px] border border-orange-200/60 flex justify-between items-center shadow-[0_4px_20px_rgba(255,152,0,0.03)] transition-all hover:bg-[#fffbf2]">
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold mb-0.5 tracking-wide">预计报酬奖励</p>
                          <div className="flex items-baseline text-[#e65100]">
                            <span className="text-sm font-black">￥</span>
                            <span className="text-3xl font-black tracking-tight">{selectedTask.budget}</span>
                            <span className="text-slate-400 text-[10px] font-normal ml-0.5"> / 次结清</span>
                          </div>
                        </div>
                        <div className="w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center shadow-xs shrink-0">
                          <Wallet className="w-5 h-5 text-[#ff9800]" />
                        </div>
                      </div>

                      <div className="bg-blue-50/75 p-4 rounded-[22px] border border-blue-100/70 shadow-[0_4px_15px_rgba(0,104,118,0.02)] flex flex-col justify-between hover:bg-blue-100/50 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-blue-200/50 flex items-center justify-center mb-2">
                          <Timer className="w-4 h-4 text-blue-800" />
                        </div>
                        <div>
                          <p className="text-[9px] text-blue-900/60 font-bold tracking-wide">预计派送距离</p>
                          <p className="text-sm font-black text-blue-950 mt-0.5">{selectedTask.distance}</p>
                        </div>
                      </div>

                      <div className="bg-[#fcf8ff] p-4 rounded-[22px] border border-purple-100/75 shadow-[0_4px_15px_rgba(107,33,168,0.02)] flex flex-col justify-between hover:bg-[#fcf5ff] transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-purple-100/50 flex items-center justify-center mb-2">
                          <Clock className="w-4 h-4 text-purple-800" />
                        </div>
                        <div>
                          <p className="text-[9px] text-purple-900/60 font-bold tracking-wide">期望服务完工时效</p>
                          <p className="text-sm font-black text-purple-950 mt-0.5">{selectedTask.serviceTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Requirements (具体要求) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
                        <span>具体要求</span>
                        <span className="text-[10px] text-slate-400 font-normal">托管保障中</span>
                      </h3>
                      
                      <div className="text-xs text-slate-600 space-y-2 leading-relaxed whitespace-pre-line">
                        {selectedTask.requirementsList ? (
                          selectedTask.requirementsList.map((req, idx) => (
                            <p key={idx}>{req}</p>
                          ))
                        ) : (
                          <p>{selectedTask.description}</p>
                        )}
                      </div>

                      {/* Display context image when present */}
                      {selectedTask.imageUrl && (
                        <div className="rounded-xl overflow-hidden mt-3 aspect-video relative shadow-inner">
                          <img src={selectedTask.imageUrl} alt="Context bento" className="w-full h-full object-cover" />
                          <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] px-2 py-0.5 rounded backdrop-blur">
                            示例照片
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Publisher profile info box */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3 border-l-4 border-[#00acc1]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {selectedTask.publisherAvatar ? (
                            <img src={selectedTask.publisherAvatar} alt="Publisher" className="w-10 h-10 rounded-full object-cover border" />
                          ) : (
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                              {selectedTask.publisherName.substring(0, 1)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{selectedTask.publisherName}</h4>
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-teal-50 text-[#00acc1] rounded mt-0.5">
                              <Shield className="w-2.5 h-2.5 fill-[#00acc1]" />
                              <span className="text-[9px] font-bold">信用分 {selectedTask.publisherCredit}</span>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => alert('已向发布人发送微信号好友申请')} className="text-xs text-[#006876] font-semibold hover:bg-slate-50 px-2 py-1 rounded">
                          查看详情
                        </button>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg flex items-center gap-2 text-[11px] text-slate-500">
                        <Shield className="w-3.5 h-3.5 text-[#00acc1] shrink-0" />
                        <span>资金已由快乐牛马平台全权托管，请放心承接。</span>
                      </div>
                    </div>

                    {/* Delivery Route / Map Placeholder (View 5 bottom) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>服务路线</span>
                        <span className="text-[#006876]">全图定位</span>
                      </div>
                      <div className="w-full h-32 rounded-lg overflow-hidden relative border border-slate-100">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8xwlEnXZzNzgrX6gskNI0YEh72xiQCp3CpiT6PvGyu7zacXFZMVtEAKOi8KU8Xx_HopDoxT3Dg3WQh2lK0Wu3LNjlo6oBUk3mEMyhAK3zazWmPofng28qTDoF4JCAkc1yg2oT6K6rlWhH8opuYxwwrIxhSnIYCVjSfvgSkwQRmoHxCLySReN1lrUnWiH_XFce0O_usQxU31hTb5TJWn9ZqDT0fcd-AVB0LYO9ObzNKMewYLKVqsq459YgzS2tW5SxgYnJQJ9B2EVW" alt="mockmap" className="w-full h-full object-cover grayscale opacity-75" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center">
                            <MapPin className="w-6 h-6 text-[#006876] fill-[#006876] animate-bounce" />
                            <div className="bg-white/95 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-slate-800 shadow border border-slate-200 mt-1">
                              静安/写字楼 A座
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA Actions */}
                    <div className="pt-4 pb-2 flex gap-3">
                      <button onClick={() => alert('模拟启动在线临时沟通聊天面板...')} className="flex-1 py-2.5 border border-[#00acc1] text-[#006876] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all bg-white shadow-sm">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>咨询发布人</span>
                      </button>

                      <button
                        onClick={() => advanceTaskState(selectedTask.id, selectedTask.status)}
                        className={`flex-[1.5] py-2.5 text-xs font-bold rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1 text-white ${
                          selectedTask.status === 'open' || selectedTask.status === 'applied' ? 'bg-[#ff9800]' :
                          selectedTask.status === 'in_progress' ? 'bg-teal-600' :
                          selectedTask.status === 'pending_confirm' ? 'bg-blue-600' : 'bg-slate-400 pointer-events-none'
                        }`}
                      >
                        {selectedTask.status === 'open' || selectedTask.status === 'applied' ? '申请抢单' :
                         selectedTask.status === 'in_progress' ? '提交完工' :
                         selectedTask.status === 'pending_confirm' ? '核对并确认完成' : '订单已全部结清'}
                      </button>
                    </div>

                  </div>
                </div>
              ) : (
                
                /* PRIMARY NAVIGATION ROUTER (Tabs) */
                <div>
                  
                  {/* TAB 1: HOMEPAGE (View 1 & 10) */}
                  {activeTab === 'home' && (
                    <div className="space-y-4">
                      
                      {/* Search Area */}
                      <div className="px-4 pt-3 shrink-0">
                        <div className="relative flex items-center">
                          <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-slate-100 rounded-xl pl-10 pr-4 text-xs focus:ring-1 focus:ring-[#00acc1] border-none outline-none text-slate-800 shrink-0"
                            placeholder="搜索你感兴趣的零工任务..."
                          />
                        </div>
                      </div>

                      {/* Live Ticker Notification Bar */}
                      <div className="mx-4 bg-amber-500/10 text-amber-800 text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-2 border border-amber-500/10 shrink-0 font-medium">
                        <Bell className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{recentLiveNotification}</span>
                      </div>

                      {/* Security Plan Banner (牛马保障计划) */}
                      <div className="px-4">
                        <div className="relative overflow-hidden bg-gradient-to-r from-[#006876] to-[#00acc1] text-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-teal-500/20">
                          <div className="z-10 flex-1">
                            <h2 className="text-sm font-bold mb-0.5">牛马保障计划</h2>
                            <p className="text-[10px] opacity-90">全程安全担保 · 极速结算入账</p>
                            <button onClick={() => alert('保障计划: 提供10万元线上意外险及纠纷法援保障。')} className="mt-2 text-[9px] bg-[#ff9800] text-white font-bold px-3 py-1 rounded-full shadow-sm active:scale-95 transition-all">
                              了解详情
                            </button>
                          </div>
                          <div className="absolute right-0 bottom-0 text-white/10 shrink-0 translate-y-3 translate-x-3">
                            <Shield className="w-24 h-24 stroke-[1]" />
                          </div>
                        </div>
                      </div>

                      {/* Premium AI Business Growth Promo Banner (20000+ AI Scenes) */}
                      <div className="px-4">
                        <div 
                          onClick={() => {
                            setActiveTab('publish');
                            setSelectedTask(null);
                            setTimeout(() => {
                              handleAiGenerate();
                            }, 100);
                          }}
                          className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-[#006876] text-white p-4 rounded-[22px] border border-cyan-500/30 shadow-[0_4px_25px_rgba(0,104,118,0.12)] cursor-pointer hover:scale-[1.01] transition-all duration-200 group"
                        >
                          {/* Glowing radial circles */}
                          <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#00acc1]/10 rounded-full blur-2xl group-hover:bg-[#00acc1]/15 transition-colors" />
                          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-teal-500/5 rounded-full blur-xl animate-pulse" />

                          <div className="relative z-10 flex justify-between items-center gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase animate-pulse">
                                  NEW UPGRADE
                                </span>
                                <span className="text-[9px] text-[#00acc1] font-extrabold tracking-wide">
                                  同城智慧商业赋能
                                </span>
                              </div>
                              <h3 className="text-xs font-black tracking-wide text-white leading-tight">
                                ✨ 20000+ AI应用场景已准备就绪
                              </h3>
                              <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                                一键激活你的商业增长力！智能匹配高佣单与精准话术
                              </p>
                            </div>

                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <div className="w-9 h-9 bg-gradient-to-tr from-[#006876] to-[#00acc1] border border-white/25 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
                                <Sparkles className="w-4.5 h-4.5 text-yellow-300" />
                              </div>
                              <span className="text-[7.5px] font-black text-slate-300 group-hover:text-[#00acc1] transition-colors leading-none mt-1">
                                立即激活
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Category Grid Section depending on HomeStyle selection */}
                      {homeStyle === 'standard' ? (
                        /* VIEW 1: Standard Bento Categorization */
                        <div className="px-4">
                          <div className="grid grid-cols-4 gap-2.5">
                            {[
                              { label: '跑腿代办', cat: 'run' as TaskCategory, icon: '🚀', desc: '同城跑跑 极速速达', gridClass: 'col-span-2 row-span-2 bg-blue-50/90 text-blue-900 border-blue-200/60', iconClass: 'text-2xl', labelClass: 'text-xs font-black' },
                              { label: '家政保洁', cat: 'clean' as TaskCategory, icon: '🧹', desc: '日常做饭 深度收纳', gridClass: 'col-span-2 bg-orange-50/90 text-orange-950 border-orange-200/50', iconClass: 'text-xl', labelClass: 'text-xs font-black' },
                              { label: '宠物代遛', cat: 'pet' as TaskCategory, icon: '🐾', desc: '爱犬遛弯 照顾猫狗', gridClass: 'col-span-1 bg-emerald-50 text-emerald-950 border-emerald-200/50', iconClass: 'text-xl', labelClass: 'text-[11px] font-black' },
                              { label: '家修组装', cat: 'install' as TaskCategory, icon: '🔧', desc: '宜家家具组装', gridClass: 'col-span-1 bg-purple-50 text-purple-950 border-purple-200/50', iconClass: 'text-xl', labelClass: 'text-[11px] font-black' },
                              { label: '文案设计', cat: 'writeup' as TaskCategory, icon: '✍️', desc: 'PPT排版 文稿宣传', gridClass: 'col-span-1 bg-yellow-50 text-yellow-950 border-yellow-200/50', iconClass: 'text-xl', labelClass: 'text-[10px] font-black' },
                              { label: '家教陪练', cat: 'tutor' as TaskCategory, icon: '📖', desc: '伴读纠错 课后指导', gridClass: 'col-span-1 bg-rose-50 text-rose-950 border-rose-200/50', iconClass: 'text-xl', labelClass: 'text-[10px] font-black' },
                              { label: '开发技术', cat: 'tech' as TaskCategory, icon: '💻', desc: '微信小程序 网站协作外包', gridClass: 'col-span-2 bg-cyan-50 text-cyan-950 border-cyan-200/50', iconClass: 'text-xl', labelClass: 'text-xs font-black' }
                            ].map((item, idx) => {
                              const isActive = activeCategoryFilter === item.cat;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setActiveCategoryFilter(isActive ? 'all' : item.cat)}
                                  className={`relative text-left p-3 rounded-[20px] border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs group ${item.gridClass} ${
                                    isActive
                                      ? 'ring-2 ring-[#006876] scale-[1.01] shadow-xs font-bold'
                                      : 'hover:scale-[1.01]'
                                  }`}
                                >
                                  <div className="flex justify-between items-start w-full">
                                    <span className={item.iconClass}>{item.icon}</span>
                                    {isActive && (
                                      <span className="w-2 h-2 rounded-full bg-[#006876] animate-pulse shrink-0" />
                                    )}
                                  </div>
                                  <div className="mt-2.5">
                                    <span className={`block text-slate-900 leading-tight ${item.labelClass}`}>{item.label}</span>
                                    {item.desc && (
                                      <span className="block text-[8px] opacity-75 truncate mt-0.5 max-w-[155px] font-medium leading-normal">{item.desc}</span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        /* VIEW 10: Alternative Category Chips */
                        <div className="px-4">
                          <div className="grid grid-cols-4 gap-2.5">
                            {[
                              { label: '跑腿代买', cat: 'run' as TaskCategory, icon: '🎁', bgClass: 'bg-blue-50 text-blue-950 border-blue-150' },
                              { label: '取送物品', cat: 'run' as TaskCategory, icon: '📦', bgClass: 'bg-cyan-50 text-cyan-950 border-cyan-150' },
                              { label: '搬东西', cat: 'install' as TaskCategory, icon: '🚛', bgClass: 'bg-emerald-50 text-emerald-950 border-emerald-150' },
                              { label: '排队占位', cat: 'queue' as TaskCategory, icon: '⏳', bgClass: 'bg-amber-50 text-amber-950 border-amber-150' },
                              { label: '陪诊陪办', cat: 'hospital' as TaskCategory, icon: '🏥', bgClass: 'bg-rose-50 text-rose-950 border-rose-150' },
                              { label: '拍照协助', cat: 'photo' as TaskCategory, icon: '📷', bgClass: 'bg-purple-50 text-purple-950 border-purple-150' },
                              { label: '宠物照看', cat: 'pet' as TaskCategory, icon: '🐱', bgClass: 'bg-teal-50 text-teal-950 border-teal-150' },
                              { label: '临时帮忙', cat: 'help' as TaskCategory, icon: '🤝', bgClass: 'bg-indigo-50 text-indigo-950 border-indigo-150' }
                            ].map((item, idx) => {
                              const isActive = activeCategoryFilter === item.cat;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => setActiveCategoryFilter(isActive ? 'all' : item.cat)}
                                  className={`flex flex-col items-center justify-between p-2.5 rounded-[18px] border text-center transition-all ${
                                    item.bgClass
                                  } ${
                                    isActive
                                      ? 'ring-2 ring-[#006876] scale-[1.04] font-bold shadow-xs'
                                      : 'hover:scale-[1.02]'
                                  }`}
                                >
                                  <div className="w-9 h-9 rounded-xl bg-white shadow-3xs flex items-center justify-center text-base shrink-0">
                                    {item.icon}
                                  </div>
                                  <span className="text-[9px] font-black text-slate-800 mt-1.5 leading-tight">{item.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Header Nearby Tasks and Style Filters */}
                      <div className="px-4 flex justify-between items-center bg-white/80 py-1.5 border-y border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-800">附近任务</span>
                          <span className="px-1.5 py-0.1 bg-rose-50 text-rose-600 text-[8px] rounded-full font-bold">New</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          {activeCategoryFilter !== 'all' && (
                            <button
                              onClick={() => setActiveCategoryFilter('all')}
                              className="text-[9px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full"
                            >
                              清除筛选
                            </button>
                          )}
                          <span className="text-[10px] text-slate-400">距离优先</span>
                        </div>
                      </div>

                      {/* Dynamic Tasks Feed Grid */}
                      <div className="px-4 space-y-3">
                        {filteredTasks.length === 0 ? (
                          <div className="text-center py-8 bg-white rounded-[24px] p-5 border border-dashed border-slate-200 shadow-sm">
                            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 font-bold">该分类下或者搜索词下暂无发布任务</p>
                            <button onClick={() => { setSearchQuery(''); setActiveCategoryFilter('all'); }} className="mt-2 text-xs text-[#006876] font-bold underline">
                              查看全部任务
                            </button>
                          </div>
                        ) : (
                          filteredTasks.map(task => {
                            // Style assignment for bento feel dependent on task's conditions
                            const isHighBudget = task.budget >= 100;
                            const cardBg = isHighBudget ? 'bg-gradient-to-br from-white to-[#fffef5]' : 'bg-white';
                            const cardBorder = isHighBudget ? 'border-[#ffe2b5]' : 'border-slate-100/90';
                            
                            return (
                              <div
                                key={task.id}
                                className={`${cardBg} rounded-[22px] p-4.5 shadow-[0_4px_22px_rgba(0,0,0,0.015)] border ${cardBorder} flex flex-col relative overflow-hidden active:scale-[0.99] transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.04)] cursor-pointer`}
                                onClick={() => setSelectedTask(task)}
                              >
                                {/* Top metadata */}
                                <div className="flex justify-between items-start mb-2.5">
                                  <span className="px-2 py-0.5 bg-teal-50 text-[#006876] text-[9px] font-black rounded-md border border-teal-100">
                                    {task.categoryLabel}
                                  </span>
                                  <div className="text-right">
                                    <span className="text-sm font-black text-orange-600">¥{task.budget}</span>
                                    <span className="text-[9px] text-slate-400 font-medium"> /次</span>
                                  </div>
                                </div>

                                <h3 className="text-xs font-black text-slate-900 leading-snug mb-2.5">
                                  {task.title}
                                </h3>

                                <div className="flex items-center gap-2.5 text-[10px] text-slate-400 mb-3.5">
                                  <span className="bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded">{task.distance}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span>{task.pubTimeText}</span>
                                </div>

                                {/* Footer publisher badge and Quick Grab button */}
                                <div className="border-t border-slate-100 pt-3 flex justify-between items-center w-full mt-1.5">
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                                    {task.publisherAvatar ? (
                                      <img src={task.publisherAvatar} alt="user avatar" className="w-5.5 h-5.5 rounded-full object-cover border border-slate-150" />
                                    ) : (
                                      <div className="w-5.5 h-5.5 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-800">
                                        {task.publisherName.substring(0, 1)}
                                      </div>
                                    )}
                                    <div className="flex flex-col">
                                      <span className="font-bold text-slate-700 truncate max-w-[80px] leading-tight">
                                        {task.publisherName}
                                      </span>
                                      <span className="text-[7.5px] text-[#00acc1] font-black tracking-wide">
                                        {task.publisherVerifyText}
                                      </span>
                                    </div>
                                  </div>

                                  <button
                                    className="bg-[#ff9800] text-white font-black text-[10.5px] px-4 py-1.5 rounded-xl shadow-xs hover:brightness-105 active:scale-95 transition-all text-center leading-normal"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedTask(task);
                                    }}
                                  >
                                    {task.status === 'open' ? '立即抢单' : '查看详情'}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: POST / PUBLISH PAGE (View 6 & 8) */}
                  {activeTab === 'publish' && (
                    <div className="p-4 space-y-4 animate-slideIn">
                      {/* Premium AI Scene Activation Ribbon */}
                      <div className="bg-gradient-to-r from-slate-900 to-[#006876] text-white p-4.5 rounded-[22px] border border-cyan-500/20 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#00acc1]/10 rounded-full blur-2xl" />
                        
                        <div className="relative z-10 flex gap-3.5 items-center">
                          <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center border border-white/15 animate-pulse">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                          </div>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="bg-amber-400 text-slate-950 text-[7px] font-black tracking-widest px-1.5 py-0.2 rounded-full uppercase leading-none">
                                商业版已激活
                              </span>
                              <span className="text-[9.5px] text-[#00acc1] font-extrabold tracking-wide">
                                20000+ AI应用场景
                              </span>
                            </div>
                            <h3 className="text-xs font-black tracking-wide text-white">
                              一键激活你的商业增长力！
                            </h3>
                            <p className="text-[8px] text-slate-300 leading-normal font-semibold">
                              已关联全场景同城代办语料模板。点击下方「AI智能一键排版」即可瞬间定制吸引海量接单人与好评的完美文案！
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
                        
                        {/* Select Category */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-slate-400">选择任务类型</label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: '搬家装配', val: 'install' as TaskCategory, icon: '🚛' },
                              { label: '跑腿代办', val: 'run' as TaskCategory, icon: '🚀' },
                              { label: '家政保洁', val: 'clean' as TaskCategory, icon: '🧹' },
                              { label: '维修改装', val: 'help' as TaskCategory, icon: '🔧' }
                            ].map(item => (
                              <button
                                key={item.val}
                                onClick={() => setPublishCategory(item.val)}
                                className={`p-2 rounded-xl flex flex-col items-center gap-1 border text-center transition-all ${
                                  publishCategory === item.val
                                    ? 'border-[#006876] bg-teal-50/50 text-[#006876]'
                                    : 'border-slate-100 hover:border-slate-200 text-slate-600'
                                }`}
                              >
                                <span className="text-sm">{item.icon}</span>
                                <span className="text-[9px] font-bold">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Task Title & AI Helper */}
                        <div className="space-y-1.5 relative">
                          <div className="flex justify-between items-baseline">
                            <label className="text-[10px] uppercase font-bold text-slate-400">任务头部标题</label>
                            
                            <button
                              onClick={handleAiGenerate}
                              disabled={aiGenerating}
                              className="text-[9px] text-[#00acc1] font-bold bg-[#E0F7F9] px-2 py-0.5 rounded-full flex items-center gap-1 hover:brightness-105 active:scale-95 transition-all"
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>{aiGenerating ? 'AI智能编写中...' : '点击AI智能一键排版'}</span>
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={publishTitle}
                              onChange={(e) => setPublishTitle(e.target.value)}
                              placeholder="点击上方AI生成或手动输入..."
                              className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs rounded-lg focus:ring-1 focus:ring-[#00acc1] text-slate-800"
                            />
                          </div>
                        </div>

                        {/* Task Details */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-slate-400">具体情况说明 (选填)</label>
                          <textarea
                            value={publishDesc}
                            onChange={(e) => setPublishDesc(e.target.value)}
                            placeholder="请描述您的具体要求，如重量、要求自带搬运配具等..."
                            className="w-full h-20 bg-slate-50 border border-slate-100 p-2.5 text-xs rounded-lg focus:ring-1 focus:ring-[#00acc1] text-slate-800 resize-none"
                          />
                        </div>

                        {/* Service Address */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-slate-400">服务具体地址</label>
                          <input
                            type="text"
                            value={publishAddress}
                            onChange={(e) => setPublishAddress(e.target.value)}
                            placeholder="请点击定位或者填写派送写字楼及房间号..."
                            className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs rounded-lg focus:ring-1 focus:ring-[#00acc1] text-slate-800"
                          />
                        </div>

                        {/* Time requirement */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-slate-400">期望完成期限</label>
                          <input
                            type="text"
                            value={publishTime}
                            onChange={(e) => setPublishTime(e.target.value)}
                            placeholder="例如：12:30 之前、今天 18:00 之前"
                            className="w-full bg-slate-50 border border-slate-100 p-2.5 text-xs rounded-lg focus:ring-1 focus:ring-[#00acc1] text-slate-800"
                          />
                        </div>

                        {/* Budget */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-slate-400">预估小费预算酬劳 (元)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bold text-slate-400">￥</span>
                            <input
                              type="number"
                              value={publishBudget}
                              onChange={(e) => setPublishBudget(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-100 py-2 pl-7 pr-3 text-sm font-bold text-orange-600 rounded-lg focus:ring-1 focus:ring-[#00acc1]"
                            />
                          </div>
                          <p className="text-[8px] text-slate-400">合理的劳务报酬能吸引更卓越的同城牛马快速承办接单哦！</p>
                        </div>
                      </div>

                      {/* Safety checkbox */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#006876]" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">要求实名跑腿</p>
                            <p className="text-[9px] text-slate-400">开启后仅且只允许进行双重人脸实名的伙伴接单。</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={publishVerifyReq}
                          onChange={(e) => setPublishVerifyReq(e.target.checked)}
                          className="w-4 h-4 text-[#006876] border-slate-300 focus:ring-[#006876] rounded"
                        />
                      </div>

                      {/* Submit action */}
                      <button
                        onClick={handlePublishTask}
                        disabled={justPublished}
                        className="w-full bg-[#ff9800] hover:brightness-105 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{justPublished ? '任务正在发布上链...' : '立即发布任务并由托管入账'}</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 3: ORDERS SECTION (View 5 Alternative list / standard view) */}
                  {activeTab === 'orders' && (
                    <div className="p-4 space-y-4 animate-slideIn">
                      <div className="flex justify-between items-center px-1">
                        <h2 className="font-bold text-sm">任务/订单中心</h2>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">实时网络连通</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setOrderMarketStyle('standard')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                            orderMarketStyle === 'standard' ? 'bg-[#00acc1]/10 text-[#006876] border-[#00acc1]/20' : 'bg-white border-slate-100 text-slate-500'
                          }`}
                        >
                          我发布的
                        </button>
                        <button
                          onClick={() => setOrderMarketStyle('alternative')}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border ${
                            orderMarketStyle === 'alternative' ? 'bg-[#00acc1]/10 text-[#006876] border-[#00acc1]/20' : 'bg-white border-slate-100 text-slate-500'
                          }`}
                        >
                          我接到的 ({tasks.filter(t => t.selectedRunnerId === 'user_cow_horse_99').length})
                        </button>
                      </div>

                      {/* Display high end bento blocks in alternative mode */}
                      {orderMarketStyle === 'alternative' && (
                        <div className="grid grid-cols-2 gap-2.5 animate-fadeIn">
                          <div onClick={() => alert('新手指南：在订单中实时开启录音能大幅降低纠纷率。')} className="bg-[#ff9800] hover:brightness-105 rounded-xl p-3.5 flex flex-col justify-between aspect-square relative overflow-hidden text-white cursor-pointer shadow-sm">
                            <span className="text-xs font-bold leading-tight">新牛马<br />进阶指南</span>
                            <span className="text-[8px] text-white/80">提升接单评分 / 获得勋章奖励</span>
                            <Award className="w-16 h-16 absolute -right-3 -bottom-3 text-white/10" />
                          </div>

                          <div onClick={() => alert('保障险说明：每台订单自动参保，提供高达5万元意外索赔额。')} className="bg-[#00acc1] hover:brightness-105 rounded-xl p-3.5 flex flex-col justify-between aspect-square relative overflow-hidden text-white cursor-pointer shadow-sm">
                            <span className="text-xs font-bold leading-tight">保险<br />服务保障</span>
                            <span className="text-[8px] text-white/80">全程安心无虞 / 守护每一次托付</span>
                            <Shield className="w-16 h-16 absolute -right-3 -bottom-3 text-white/10" />
                          </div>
                        </div>
                      )}

                      {/* Order Feed list inside the active state */}
                      <div className="space-y-3">
                        {tasks
                          .filter(t => orderMarketStyle === 'alternative' ? t.selectedRunnerId === 'user_cow_horse_99' : t.publisherId === user.id)
                          .map(task => (
                            <div key={task.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col space-y-3" onClick={() => setSelectedTask(task)}>
                              <div className="flex justify-between items-start border-b border-slate-50 pb-2.5">
                                <div>
                                  <span className="text-[10px] text-slate-400">订单号: #{task.id.slice(-6)}</span>
                                  <h3 className="text-xs font-bold text-slate-800 leading-tight mt-1">{task.title}</h3>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-bold text-orange-500 block">¥{task.budget}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                                    task.status === 'open' ? 'bg-amber-50 text-amber-600' :
                                    task.status === 'in_progress' ? 'bg-emerald-50 text-emerald-600' :
                                    task.status === 'pending_confirm' ? 'bg-blue-50 text-blue-600' :
                                    'bg-slate-50 text-slate-500'
                                  }`}>
                                    {task.status === 'open' ? '待接单' :
                                     task.status === 'applied' ? '待选定' :
                                     task.status === 'in_progress' ? '进行中' :
                                     task.status === 'pending_confirm' ? '待退还/确认' : '已结清'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-slate-500">
                                <p>距离: {task.distance}  |  类别: {task.categoryLabel}</p>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTask(task);
                                  }}
                                  className="text-[#006876] font-bold"
                                >
                                  查看进度
                                </button>
                              </div>
                            </div>
                          ))}

                        {tasks.filter(t => orderMarketStyle === 'alternative' ? t.selectedRunnerId === 'user_cow_horse_99' : t.publisherId === user.id).length === 0 && (
                          <div className="text-center py-12 bg-white rounded-2xl p-4 text-slate-400">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-slate-350" />
                            <p className="text-xs">暂无此方向订单记录</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: MESSAGES LOG (View 11) */}
                  {activeTab === 'messages' && (
                    <div className="p-4 space-y-4 animate-slideIn">
                      
                      {/* Top Action Category Bars */}
                      <div className="flex gap-2 shrink-0 overflow-x-auto pb-1.5">
                        <button onClick={() => alert('通知: 暂无新订单系统提示')} className="flex-1 flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[90px]">
                          <div className="w-9 h-9 rounded-full bg-teal-50 flex items-center justify-center mb-1 text-teal-700 font-bold text-xs">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] text-[#006876] font-bold">订单通知</span>
                        </button>

                        <button onClick={() => alert('公告: 为提供多地域合规结算，保障险将自动投保')} className="flex-1 flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[90px]">
                          <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center mb-1 text-amber-700 font-bold text-xs animate-bounce">
                            <Bell className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] text-slate-600">系统公告</span>
                        </button>

                        <button onClick={() => alert('客服: 官方客服正在努力备岗，请点击页面反馈。')} className="flex-1 flex flex-col items-center justify-center bg-white p-3 rounded-xl shadow-sm border border-slate-100 min-w-[90px]">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center mb-1 text-blue-700 font-bold text-xs">
                            <Phone className="w-4 h-4" />
                          </div>
                          <span className="text-[10px] text-slate-600">客服消息</span>
                        </button>
                      </div>

                      {/* Header bar and Quick mark read actions */}
                      <div className="flex justify-between items-center text-xs px-1">
                        <span className="font-bold text-slate-800">最近消息</span>
                        <button onClick={() => {
                          setMessages(prev => prev.map(m => ({ ...m, read: true })));
                          alert('平台状态：所有订单留言与提示已被标记为已读！');
                        }} className="text-[#006876] hover:underline text-[10px]">
                          全部已读
                        </button>
                      </div>

                      {/* Messages Flow Feed */}
                      <div className="space-y-3">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-3 relative transition-all active:scale-[0.99] cursor-pointer ${
                              !msg.read ? 'border-l-4 border-l-[#006876]' : ''
                            }`}
                            onClick={() => {
                              // Read message
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
                              if (msg.relatedTaskId) {
                                const rel = tasks.find(t => t.id === msg.relatedTaskId);
                                if (rel) {
                                  setSelectedTask(rel);
                                }
                              } else {
                                alert(`系统提示：「${msg.title}」\n${msg.description}`);
                              }
                            }}
                          >
                            <div className="shrink-0 w-11 h-11 bg-slate-50 border rounded-lg flex items-center justify-center relative">
                              {msg.type === 'order' ? (
                                <Briefcase className="w-5 h-5 text-[#006876]" />
                              ) : msg.type === 'announcement' ? (
                                <Bell className="w-5 h-5 text-amber-500" />
                              ) : (
                                <Phone className="w-5 h-5 text-blue-500" />
                              )}
                              {!msg.read && (
                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="text-xs font-bold text-slate-800 truncate pr-2">{msg.title}</h4>
                                <span className="text-[9px] text-slate-400 shrink-0">{msg.timeText}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{msg.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Invitation Promotion Link Banner (View 11 bottom) */}
                      <div className="relative overflow-hidden rounded-2xl h-28 flex items-center p-4 bg-gradient-to-r from-[#006876] to-[#00acc1] text-white">
                        <div className="relative z-10 w-2/3">
                          <h4 className="text-xs font-bold mb-1 flex items-center gap-1">
                            <Gift className="w-3.5 h-3.5 text-amber-300" />
                            <span>邀请好友领抵扣包</span>
                          </h4>
                          <p className="text-[9px] text-white/90 leading-relaxed mb-2">成功邀请一位好同伴加入“快乐牛马”，自动派发 10 元托管抵扣包！</p>
                          <button onClick={() => alert('点击右上角转发、群发此小程序即可赚取推荐小费奖励！')} className="bg-[#ff9800] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-sm hover:brightness-105 active:scale-95 transition-transform">
                            立即邀请
                          </button>
                        </div>
                        <div className="absolute right-0 bottom-0 text-white/10 -translate-y-2 translate-x-2">
                          <Gift className="w-24 h-24 stroke-[1]" />
                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB 5: USER PROFILE / MINE SECTION (View 2 & 4 page) */}
                  {activeTab === 'mine' && (
                    <div className="p-4 space-y-4 animate-slideIn">
                      
                      {/* User Header Profile */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={user.avatar} alt="User avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[#00acc1] shadow" />
                            <div className="absolute bottom-0 right-0 bg-[#00acc1] text-white p-0.5 rounded-full flex items-center justify-center shadow-inner">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          
                          <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-tight">{user.name}</h2>
                            <p className="text-[10px] text-slate-400 mt-0.5">ID: 8829401</p>
                            
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {/*实名认证 tag */}
                              <span className="inline-flex items-center bg-teal-50 text-teal-800 px-2 py-0.5 rounded text-[8px] font-bold border border-teal-100">
                                <Shield className="w-2.5 h-2.5 mr-0.5 text-teal-600" />
                                <span>实名已认证</span>
                              </span>

                              {/* 爱心值 tag clickable */}
                              <button
                                onClick={() => setShowDonationPage(true)}
                                className="inline-flex items-center bg-rose-50 text-rose-800 px-2 py-0.5 rounded text-[8px] font-bold border border-rose-100 active:scale-95 transition-transform shrink-0"
                              >
                                <Heart className="w-2.5 h-2.5 mr-0.5 text-rose-600 fill-rose-600" />
                                <span>爱心分 {user.loveScore}</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Top quick state toggle */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                            <button
                              onClick={() => {
                                setActiveRole('runner');
                                alert('模式已成功切换为“接单人”模式');
                              }}
                              className={`text-[9px] font-extrabold px-2 py-1 rounded ${
                                activeRole === 'runner' ? 'bg-white text-[#006876] shadow' : 'text-slate-500'
                              }`}
                            >
                              接单
                            </button>
                            <button
                              onClick={() => {
                                setActiveRole('publisher');
                                alert('模式已成功切换为“发单人”模式');
                              }}
                              className={`text-[9px] font-extrabold px-2 py-1 rounded ${
                                activeRole === 'publisher' ? 'bg-white text-[#006876] shadow' : 'text-slate-500'
                              }`}
                            >
                              发单
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Wallet Card Portfolio (Bento styled card) */}
                      <div className="bg-gradient-to-tr from-[#006876] to-[#00acc1] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-[-20px] right-[-20px] w-28 h-28 bg-white/10 rounded-full blur-xl"></div>
                        <div className="relative z-10 flex justify-between items-center">
                          <div>
                            <p className="text-[10px] text-white/80">账户余额 (元)</p>
                            <h3 className="text-2xl font-bold tracking-tight mt-1">¥ {user.walletBalance.toFixed(2)}</h3>
                          </div>
                          
                          <button
                            onClick={() => {
                              if (user.walletBalance <= 0) {
                                alert('余额为空，需要先完成更多接单任务获得收益或充值！');
                                return;
                              }
                              const amountToWithdraw = user.walletBalance;
                              setUser(prev => ({ ...prev, walletBalance: 0 }));
                              alert(`提现请求成功受理！您账户中的 ¥${amountToWithdraw.toFixed(2)} 正在转入您的绑定微信零钱，预计 5 分钟到账。`);
                            }}
                            className="bg-[#ff9800] hover:brightness-105 select-none text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-md active:scale-95 transition-all text-center"
                          >
                            提现
                          </button>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 mt-4 pt-3 border-t border-white/20 select-none">
                          <div>
                            <p className="text-[9px] text-white/70">本月收入 (已结)</p>
                            <p className="text-xs font-bold">+ ¥{user.monthlyIncome.toFixed(2)}</p>
                          </div>
                          <div className="border-l border-white/20 pl-4">
                            <p className="text-[9px] text-white/70">冻结保障金金额</p>
                            <p className="text-xs font-bold">¥ {user.frozenAmount.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>

                      {/* My Orders status block (View 2 & 4 bottom list) */}
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 space-y-3">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                          <span>我的订单任务</span>
                          <button onClick={() => { setActiveTab('orders'); setSelectedTask(null); }} className="text-slate-400 font-normal flex items-center text-[10px]">
                            <span>查看全部</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.2" />
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-center select-none">
                          {[
                            { label: '待处理', icon: 'pending_actions', count: 2, isActive: true },
                            { label: '进行中', icon: 'potted_plant', count: 0, isActive: false },
                            { label: '已完成', icon: 'task_alt', count: 0, isActive: false },
                            { label: '争议/售后', icon: 'gavel', count: 0, isActive: false }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setActiveTab('orders'); setSelectedTask(null); }}
                              className="flex flex-col items-center gap-1 p-1 hover:bg-slate-50 rounded-xl transition-all"
                            >
                              <div className="relative p-1">
                                <Clock className="w-6 h-6 text-slate-500" />
                                {item.count > 0 && (
                                  <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {item.count}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 font-medium">{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Main Utility List Menu (Bento elements) */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">
                        {[
                          { title: '实名认证', label: 'Verified', badgeStyle: 'bg-teal-50 text-[#006876]' },
                          { title: '接单认证', label: 'To be certified', badgeStyle: 'bg-rose-50 text-rose-800' },
                          { title: '我的评价', label: '4.9/5.0分', badgeStyle: 'text-slate-500 bg-slate-50' }
                        ].map((menu, idx) => (
                          <div
                            key={idx}
                            onClick={() => alert(`安全认证：功能模块「${menu.title}」已由快乐牛马链上保护。`)}
                            className="flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-xs"
                          >
                            <span className="font-semibold text-slate-700">{menu.title}</span>
                            
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${menu.badgeStyle}`}>
                                {menu.label}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Safety Rules lists */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-[#eeeef0] overflow-hidden">
                        {[
                          { title: '安全中心', desc: '行程守护与紧急求助' },
                          { title: '客服中心', desc: '24小时贴心解答' },
                          { title: '平台规则', desc: '快乐牛马服务使用指南' }
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => alert(`帮助提示：您已开启 ${item.title} 行程保障。`)}
                            className="p-3.5 flex justify-between items-center text-xs hover:bg-slate-50 cursor-pointer"
                          >
                            <div>
                              <p className="font-semibold text-slate-700">{item.title}</p>
                              <p className="text-[8px] text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>

                      {/* Interactive Promotional & Growth Strategy Card (宣传引流策划) */}
                      <div 
                        onClick={() => setShowPromoModal(true)} 
                        className="bg-gradient-to-tr from-[#006876] via-[#00acc1] to-[#3dbfc0] rounded-2xl p-4 text-white shadow-md relative overflow-hidden cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all"
                      >
                        <div className="flex justify-between items-center z-10 relative">
                          <div className="space-y-1">
                            <span className="bg-white/20 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
                              官方引流秘籍
                            </span>
                            <h4 className="text-xs font-black tracking-wide">🔥 项目推广宣传与爆红获客实操方案</h4>
                            <p className="text-[9px] text-white/90 font-medium">查看低成本拉新裂变、自媒体营销与口碑塑造全套方案 →</p>
                          </div>
                          <TrendingUp className="w-5 h-5 text-white shrink-0 animate-pulse" />
                        </div>
                        <div className="absolute right-0 bottom-[-10px] opacity-10">
                          <Share2 className="w-20 h-20" />
                        </div>
                      </div>

                      {/* Log out / Switch profiles buttons */}
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            if (window.confirm('您确定要退出并在本模拟器清除授权登录信息吗？')) {
                              setUser({
                                ...initialUser,
                                loveScore: 0,
                                walletBalance: 0
                              });
                              alert('模拟退出登录：您的资料卡已重置。重新开始赚取爱心分吧！');
                            }
                          }}
                          className="w-full bg-white select-none text-rose-600 font-bold border border-rose-100 hover:bg-rose-50 py-3 rounded-xl text-xs shadow-sm active:scale-95 transition-all text-center"
                        >
                          退出登录
                        </button>
                        <p className="text-center text-[8px] text-slate-400/60 font-semibold py-1">
                          版本号 2.4.1 (Stable Release Built-in)
                        </p>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* FLOATING ACTION BUTTON (FAB): QUICK POST TASK (View 1 & 10) */}
            {activeTab === 'home' && !selectedTask && !showDonationPage && (
              <button
                onClick={() => {
                  setActiveTab('publish');
                  setSelectedTask(null);
                }}
                className="absolute bottom-20 right-5 w-12 h-12 bg-[#ff9800] text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-transform"
                title="发布任务"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            )}

            {/* AI HOVER BUTTON (AI 悬浮智囊): Positioned directly above the yellow "+" button */}
            {activeTab === 'home' && !selectedTask && !showDonationPage && (
              <div className="absolute bottom-34 right-5 z-40 flex flex-col items-center">
                <button
                  onClick={() => {
                    setActiveTab('publish');
                    setSelectedTask(null);
                    setTimeout(() => {
                      handleAiGenerate();
                    }, 100);
                  }}
                  className="w-12 h-12 bg-gradient-to-tr from-[#006876] via-[#00acc1] to-emerald-500 text-white rounded-full shadow-[0_4px_15px_rgba(0,104,118,0.35)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-bounce"
                  title="智能一键排版发单"
                >
                  <Sparkles className="w-5.5 h-5.5 text-yellow-150" />
                </button>
                <span className="mt-1.5 bg-[#006876] text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-md leading-none whitespace-nowrap animate-pulse">
                  点击立即加入
                </span>
              </div>
            )}

            {/* AI CHAT POPUP DRAWER/PANEL */}
            {showAiChat && (
              <div className="absolute inset-x-0 bottom-0 top-0 bg-slate-950/60 backdrop-blur-xs z-[100] flex flex-col justify-end">
                <div 
                  className="bg-white rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[85%] animate-slideUp"
                  style={{ height: '580px' }}
                >
                  {/* Top bar header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-[#006876] to-[#00acc1] text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center relative">
                        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black leading-tight">快乐牛马 AI 智囊导师</h3>
                        <p className="text-[8px] text-white/80 mt-0.5 font-bold">全能同城小事助理 · 活跃在线</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowAiChat(false)}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white font-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Message body */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f5f6f8]">
                    {aiChatMessages.map((msg, index) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div key={index} className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                            isUser ? 'bg-orange-100 text-orange-800 font-bold font-mono' : 'bg-teal-50 text-teal-800'
                          }`}>
                            {isUser ? '我' : '🤖'}
                          </div>

                          {/* Chat bubble body */}
                          <div className="space-y-2 max-w-[75%]">
                            <div className={`p-3 rounded-[20px] text-xs leading-relaxed shadow-xs ${
                              isUser 
                                ? 'bg-[#ff9800] text-white rounded-tr-none font-bold' 
                                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                            }`}>
                              {msg.content.split('\n').map((line, lIdx) => (
                                <p key={lIdx} className="mb-1 last:mb-0 whitespace-pre-wrap">{line}</p>
                              ))}
                            </div>

                            {/* Optional Draft Presentation card */}
                            {msg.draft && (
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-4 rounded-[22px] border border-orange-200/60 shadow-xs space-y-3">
                                <div className="flex items-center gap-1.5 text-[9px] text-orange-700 font-black uppercase tracking-wider">
                                  <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                                  <span>AI 任务完美润色草稿</span>
                                </div>

                                <div className="space-y-1.5 bg-white p-3 rounded-xl border border-orange-100 text-slate-800">
                                  <h4 className="text-xs font-black text-slate-900 border-b border-slate-50 pb-1.5">{msg.draft.title}</h4>
                                  <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">{msg.draft.description}</p>
                                  <div className="flex justify-between items-baseline pt-1">
                                    <span className="text-[9px] text-slate-400 font-bold">建议报酬收益</span>
                                    <span className="text-sm font-black text-orange-600">￥{msg.draft.budget} /结清</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleAdoptDraft(msg.draft!)}
                                  className="w-full bg-[#ff9800] hover:bg-orange-500 text-white font-black text-[10.5px] py-2.5 rounded-xl text-center shadow-xs transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <span>🌟 一键采纳导入并去发布</span>
                                </button>
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })}

                    {/* Loader */}
                    {aiChatLoading && (
                      <div className="flex gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center text-xs">
                          🤖
                        </div>
                        <div className="bg-white px-4 py-3 rounded-[20px] rounded-tl-none border border-slate-100 shadow-xs flex items-center justify-center gap-1 w-20">
                          <span className="w-1.5 h-1.5 bg-[#006876] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#006876] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-[#006876] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Suggestion Bubbles Panel */}
                  <div className="px-3.5 py-2.5 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto select-none no-scrollbar shrink-0">
                    {[
                      { short: '🐾 帮遛萨摩耶', text: '我想发布一个遛狗单，在徐汇滨江步道遛大型萨摩耶狗30分钟，预算35元，请帮我润色' },
                      { short: '🚀 网红店代排队', text: '写个在久光百货代排队买排队限购网红甜品的跑腿单，预算50，需要三十分钟送恒隆' },
                      { short: '🚛 搬箱组装家具', text: '写个搬家打杂任务：需要老哥帮忙搬3个重箱子，并帮忙组装一个宜家简易衣架柜，预算110' },
                      { short: '📖 伴读课后辅导', text: '写个家教陪练订单，辅导学子二年级基础寒暑假拼音算数，每次2小时，报酬120元' }
                    ].map((s_item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendAiChatMessage(s_item.text)}
                        className="bg-slate-50 hover:bg-[#00acc1]/10 px-3 py-1.5 rounded-full border border-slate-150 text-[10px] text-slate-600 font-bold whitespace-nowrap active:scale-95 transition-all outline-none cursor-pointer"
                      >
                        {s_item.short}
                      </button>
                    ))}
                  </div>

                  {/* Input bottom bar */}
                  <div className="p-3 bg-white border-t border-slate-150 flex gap-2.5 items-center shrink-0 pb-5">
                    <input
                      type="text"
                      value={aiChatInputValue}
                      onChange={(e) => setAiChatInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendAiChatMessage();
                        }
                      }}
                      placeholder="打字告诉智囊您的需求，如“写个搞保洁的”..."
                      className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-2xl text-xs font-bold focus:ring-1 focus:ring-[#00acc1] text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSendAiChatMessage()}
                      className="w-10 h-10 bg-[#006876] active:bg-[#00acc1] text-white rounded-2xl flex items-center justify-center shadow-xs shrink-0 active:scale-95 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* FLOATING MIC FOR GLOBAL AUDIO RECORDING SYSTEM (View 7) */}
            {selectedTask && (
              <div className="absolute bottom-24 right-4 z-40 flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    setIsRecording(!isRecording);
                    alert(isRecording ? '平台实时录音安全存证服务已安全挂断并处理上传。' : '平台录音系统已安全启动：双方整个线下服务交互会实时高压缩录音存证加密。');
                  }}
                  className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                    isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-[#00acc1] text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <span className="bg-slate-800 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow">
                  {isRecording ? '存证录音中' : '全局录音'}
                </span>
              </div>
            )}

            {/* CORE WECHAT NAV BOTTOM TAB BAR */}
            <nav className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50 py-2.5 pb-5 flex justify-around select-none">
              {[
                { tab: 'home' as const, label: '首页', icon: Home },
                { tab: 'publish' as const, label: '发布', icon: Plus },
                { tab: 'orders' as const, label: '订单', icon: Briefcase },
                { tab: 'messages' as const, label: '消息', icon: MessageSquare },
                { tab: 'mine' as const, label: '我的', icon: UserIcon }
              ].map(item => {
                const IconComp = item.icon;
                const isActive = activeTab === item.tab && !selectedTask && !showDonationPage;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      setSelectedTask(null);
                      setShowDonationPage(false);
                    }}
                    className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all outline-none border-none select-none duration-150 ${
                      isActive
                        ? 'text-[#006876] scale-105 font-extrabold'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <IconComp className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                    <span className="text-[9px] mt-1 tracking-tight">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* THANK YOU APPRECIATION POPUP MODAL (View 9) */}
            {showLoveRewardPopup && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 transition-opacity duration-300">
                <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                  
                  {/* Bouncing Animation container */}
                  <div className="relative mb-4">
                    <div className="w-18 h-18 bg-rose-50 rounded-full flex items-center justify-center animate-bounce">
                      <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="absolute -top-1 -right-3 bg-[#ff9800] text-white px-2.5 py-0.5 rounded-full font-bold text-xs rotate-12 shadow-sm">
                      +{rewardsEarned}爱心分
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-950 mb-1.5">感谢您的辛勤付出</h3>
                  
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    打卡完成度：100%。本次高标合规佣金已成功入账至您的平台余额，1 点爱心分存量已归档！
                  </p>

                  <div className="flex items-center gap-1 bg-teal-50 text-[#006876] font-bold px-4 py-2 rounded-xl text-xs mb-5 w-full justify-center">
                    <Award className="w-4 h-4 text-[#00acc1]" />
                    <span>当前累计爱心积分：{user.loveScore} 分</span>
                  </div>

                  <button
                    onClick={() => setShowLoveRewardPopup(false)}
                    className="w-full py-2.5 bg-[#006876] hover:bg-[#00acc1] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    我知道了
                  </button>
                </div>
              </div>
            )}

            {/* VIRAL ACQUISITION AND PROMOTION STRATEGY MODAL (牛马官方引流宣传中心) */}
            {showPromoModal && (
              <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs z-[110] flex flex-col justify-end">
                <div className="bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden max-h-[92%] animate-slideUp" style={{ height: '580px' }}>
                  
                  {/* Top Header */}
                  <div className="px-5 py-4 bg-gradient-to-r from-[#006876] to-[#00acc1] text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-yellow-300 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black leading-tight">快乐牛马 · 同城增长与引流秘密</h3>
                        <p className="text-[8px] text-white/80 mt-0.5 font-bold">轻投入 · 强情绪 · 爆拉精准流量</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setShowPromoModal(false)}
                      className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors text-white font-black text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Container */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
                    
                    {/* Welcome Intro */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#006876]">
                        <Award className="w-4 h-4 text-[#00acc1]" />
                        <span>项目定位 & 增长突破口</span>
                      </div>
                      <p className="text-[10.5px] text-slate-600 leading-relaxed">
                        《快乐牛马》本质上是一个<strong>极致贴近年轻打工人与社区居民</strong>的同城代办互助社群。要实现流量无成本爆发，必须利用<strong>“打工人情绪共鸣”</strong>以及<strong>“社区中老年发单福利”</strong>进行双端并推，以下四大板块组合拳是实现低成本冷启动的核心引流秘笈：
                      </p>
                    </div>

                    {/* Method 1: Short Video Content */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span className="bg-orange-100 text-orange-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                          自媒体爆款短视频（最强情绪引流）
                        </span>
                        <span className="text-[8px] bg-orange-50 text-orange-600 px-1.5 py-0.2 rounded font-extrabold uppercase">最高转化</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        利用抖音、小红书和视频号，做“打工人干饭与代办日常”剧情。
                      </p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2 text-[9.5px]">
                        <p className="font-bold text-[#006876]">💡 爆款脚本规划：</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          <li><strong>「当代牛马打工系列」</strong>：实拍代客户遛最疯狂的萨摩耶（拖着人飞奔）、去排队3小时买顶级网红烘焙（在风中瑟瑟发抖并吃冷风），极具笑点与社会共鸣。</li>
                          <li><strong>「解压清扫系列」</strong>：通过沉浸式ASMR声音和视觉震撼视频展示重度脏乱房间大扫除、家具极限拼装过程。</li>
                          <li><strong>「爱心互助纪实」</strong>：给社区孤寡老人低价代办买米并积攒爱心值的温暖瞬间，引流高素质接单员与高信任度雇主。</li>
                        </ul>
                      </div>
                    </div>

                    {/* Method 2: Community & Charity Incentives */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span className="bg-teal-100 text-teal-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">2</span>
                          “以劳换分，以积分换大米”社区地推裂变
                        </span>
                        <span className="text-[8px] bg-teal-50 text-teal-600 px-1.5 py-0.2 rounded font-extrabold uppercase">最低成本</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        解决平台冷启动中“中老年老板不信任”及“有闲阶层不知情”的问题。
                      </p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2 text-[9.5px]">
                        <p className="font-bold text-[#006876]">💡 落地实操话术：</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          <li><strong>居委会联动合作</strong>：与老旧住宅小区居委会或物业联合。允许平台接单员提供低收费家修/保洁，服务完成后，发单老人只要在平台给予好评，该订单对应累积的<strong>“爱心分”</strong>即可直接在社区爱心驿站兑换酱油、鸡蛋、食用油。</li>
                          <li><strong>福利基金赞助</strong>：引入地区爱心商家购买冠名爱心基金，为老年人补贴家修小费，直接撬动居委会帮你通过大喇叭和业主微信群免费推广。</li>
                        </ul>
                      </div>
                    </div>

                    {/* Method 3: SEO Matrix Postings */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span className="bg-amber-100 text-amber-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">3</span>
                          SEO 矩阵式小红书排版引流
                        </span>
                        <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.2 rounded font-extrabold uppercase">高精准度</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        通过长尾关键词，全自动捕捉高净值客户（养宠、高薪忙碌人群）的互助需求。
                      </p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2 text-[9.5px]">
                        <p className="font-bold text-[#006876]">💡 入站策略：</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          <li><strong>关键词矩阵</strong>：每日发布包含“上海静安代遛狗”、“北京短途简易搬运”、“宜家电竞桌拼装”等精确标题的图文笔记。</li>
                          <li><strong>一键生成模板截屏展示</strong>：直接截屏本App中的『AI一键精美排版』功能，告诉客户：“发单无门？只需要告诉我一句话，快乐牛马AI立刻帮你排版最得体、接单率最高的单子，无溢价、提款秒到账！”以此倒流用户。</li>
                        </ul>
                      </div>
                    </div>

                    {/* Method 4: Double-End Referral program */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <span className="bg-rose-100 text-rose-600 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">4</span>
                          双端裂变与“牛马合伙人”推介机制
                        </span>
                        <span className="text-[8px] bg-rose-50 text-rose-600 px-1.5 py-0.2 rounded font-extrabold uppercase">病毒分裂</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        用社交推荐激励让用户带新用户，形成闭环雪崩增长。
                      </p>
                      
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-2 text-[9.5px]">
                        <p className="font-bold text-[#006876]">💡 病毒式玩法：</p>
                        <ul className="list-disc pl-4 space-y-1 text-slate-600">
                          <li><strong>老带新合伙人</strong>：凡每介绍一位同城牛马好友注册并成功承接首单任务，推荐人即可永久获得该受邀者前3单小费的3%佣金补贴。</li>
                          <li><strong>第一单免单券</strong>：新雇主注册自动获得“免单5元小费券”，该5元由平台爱心补贴托底，诱导雇主发出首单尝试服务。</li>
                        </ul>
                      </div>
                    </div>

                    {/* Final CTA Action */}
                    <div className="p-4 bg-gradient-to-tr from-[#006876] to-[#00acc1] text-white rounded-2xl text-center space-y-1.5">
                      <h4 className="text-xs font-black">用“情绪共鸣与安全信任”筑起高强度的护城河</h4>
                      <p className="text-[9px] text-white/95 leading-relaxed font-semibold">
                        推广同城互助不要走高大上的路子，快乐牛马名字接地气的亲和能量就是最大资产。用有趣短视频建立第一眼记忆，用居委会换大米的地推解决信任痛点，这套闭环在长三角及国内各大一二线核心小区必将获得奇效。
                      </p>
                    </div>

                  </div>

                  {/* Bottom confirmation action */}
                  <div className="p-4 bg-white border-t border-slate-100 shrink-0 flex gap-2">
                    <button 
                      onClick={() => {
                        setShowPromoModal(false);
                        alert('🎉 增长计划已锁定！您可以通过各大新媒体平台将“快乐牛马 AI一键智能排版发单”作为特色功能，大肆宣传吸纳流量了！');
                      }}
                      className="flex-1 bg-gradient-to-tr from-[#006876] to-[#00acc1] text-white py-3 rounded-2xl text-xs font-black shadow-md text-center active:scale-95 transition-all cursor-pointer"
                    >
                      学到了，立即去推广牛马！
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </main>

    </div>
  );
}
