
export enum AppTab {
  HOME = '首页',
  DISCOVER = '发现',
  MESSAGES = '消息',
  ME = '我的',
  USER_PROFILE = '用户资料',
  CHAT = '聊天详情',
  EDIT_PROFILE = '编辑资料',
  MEMBER_PURCHASE = '会员购买',
  CARD_SETTINGS = '开卡设置',
  SETTINGS = '系统设置',
  ADD_FRIENDS = '加好友',
  SEARCH = '搜索',
  CREATE_POST = '发布动态',
  VISITORS = '访客记录',
  SYSTEM_MESSAGES = '系统消息',
  MUTUAL_FOLLOWS = '互相关注'
}

export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  gift?: { id: string; name: string; icon: string; price: number };
  duration?: number;
  timestamp: string;
  status?: MessageStatus;
  transcription?: string;
  isSystem?: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  age?: number;
  gender?: '男' | '女';
  location?: string;
  education?: string;
  height?: number;
  weight?: number;
  income?: string;
  occupation?: string;
  bio?: string;
  isOnline: boolean;
  isMember?: boolean;
  hasUnread?: number;
  lastMessage?: string;
  time?: string;
  distance?: string;
  isAI?: boolean;
  mood?: { emoji: string; text: string; color: string };
  // 认证状态
  authStatus?: {
    isRealPerson: boolean;
    isRealName: boolean;
    isPhoneLinked: boolean;
  };
  // 礼物统计
  giftStats?: Record<string, number>;
}

export interface Visitor {
  id: string;
  user: User;
  time: string;
}

export interface Post {
  id: string;
  author: string;
  authorId: string;
  avatar: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  time: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
}
