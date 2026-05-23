export type TaskCategory =
  | 'run'        // 跑腿代办 / 跑腿代买
  | 'clean'      // 家政保洁
  | 'pet'        // 宠物代遛 / 宠物照看
  | 'install'    // 家修组装 / 搬东西 / 搬家
  | 'writeup'    // 文案设计
  | 'tutor'      // 家教陪练
  | 'tech'       // 技术外包
  | 'queue'      // 排队占位
  | 'hospital'   // 陪诊陪办
  | 'photo'      // 拍照协助 / 摄影展拍照
  | 'help'       // 临时帮忙 / 搬家 / 其它
  | 'more';

export type TaskStatus =
  | 'open'            // 待接单
  | 'applied'         // 有人申请
  | 'in_progress'     // 进行中 (也开启实时录音存证)
  | 'pending_confirm' // 待确认 (当接单人上传或申请完成)
  | 'completed'       // 已完成 (弹起感谢弹窗)
  | 'canceled';       // 已取消

export interface User {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  creditScore: number;
  rating: number;
  completeCount: number;
  loveScore: number; // 爱心分, default 128
  walletBalance: number; // 2840.50
  monthlyIncome: number; // 1200.00
  frozenAmount: number; // 150.00
}

export interface Task {
  id: string;
  publisherId: string;
  publisherName: string;
  publisherAvatar: string;
  publisherCredit: number; // e.g. 750 (信用分)
  publisherVerifyText: string; // e.g. "已认证", "已实名"
  category: TaskCategory;
  categoryLabel: string;
  title: string;
  description: string;
  addressText?: string;
  distance: string; // e.g., "0.8km", "1.2km"
  pubTimeText: string; // e.g., "10分钟前发布", "2小时前发布"
  serviceTime: string; // e.g., "12:30", "今天 18:00 前"
  budget: number; // e.g., 280, 45, 120, 35
  status: TaskStatus;
  requirementsList?: string[];
  imageUrl?: string;
  hasVoiceRecording?: boolean; // System recording check
  appliedRunnerIds?: string[];
  selectedRunnerId?: string | null;
}

export interface Message {
  id: string;
  title: string;
  description: string;
  timeText: string;
  type: 'order' | 'announcement' | 'support';
  read: boolean;
  relatedTaskId?: string;
  avatarIcon?: string; // Material icon or URL
}

export interface DonationProject {
  id: string;
  title: string;
  tag: string;
  description: string;
  progressPercent: number;
  currentPoints: number;
  targetPoints: number;
  imageUrl: string;
}

export interface DonationLeader {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
}
