
import React, { useState, useEffect, useCallback } from 'react';
import { AppTab, Post, User, Comment, Message } from './types';
import MessagesView from './views/MessagesView';
import HomeView from './views/HomeView';
import DiscoverView from './views/DiscoverView';
import ProfileView from './views/ProfileView';
import UserProfileView from './views/UserProfileView';
import ChatView from './views/ChatView';
import EditProfileView from './views/EditProfileView';
import MemberPurchaseView from './views/MemberPurchaseView';
import CardSettingsView from './views/CardSettingsView';
import SettingsView from './views/SettingsView';
import AddFriendsView from './views/AddFriendsView';
import SearchView from './views/SearchView';
import CreatePostView from './views/CreatePostView';
import VisitorRecordsView from './views/VisitorRecordsView';
import SystemMessagesView from './views/SystemMessagesView';
import MutualFollowsView from './views/MutualFollowsView';
import BottomNav from './components/BottomNav';
import VideoMatch from './components/VideoMatch';

const STORAGE_KEY = 'MIAOHUI_APP_STATE';

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: '克洛伊 · 西蒙斯',
    authorId: 'u1',
    avatar: 'https://picsum.photos/seed/chloe/200',
    time: '中午 12:40',
    content: '建筑的沉默。极简主义的美不在于缺失，而在于每样事物的分量都恰到好处。',
    image: 'https://picsum.photos/seed/arch/800/1000',
    likes: 520,
    isLiked: false,
    comments: [
      { id: 'c1', user: '詹姆斯', text: '非常有张力。' }
    ]
  },
  {
    id: '2',
    author: '詹姆斯 · 威尔逊',
    authorId: 'u2',
    avatar: 'https://picsum.photos/seed/james/200',
    time: '上午 09:15',
    content: '城市肌理。探索城市网格中的每一个细节。',
    image: 'https://picsum.photos/seed/citygrid/800/800',
    likes: 211,
    isLiked: true,
    comments: []
  }
];

const App: React.FC = () => {
  const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<AppTab[]>([]);
  
  const [posts, setPosts] = useState<Post[]>(savedState.posts || INITIAL_POSTS);
  const [messageCount, setMessageCount] = useState(savedState.messageCount || 0);
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>(savedState.chatHistories || {});
  const [currentUser, setCurrentUser] = useState<User & { tags: string[] }>(savedState.currentUser || {
    id: '8829304',
    name: '亚历克斯 · 约翰逊',
    avatar: 'https://picsum.photos/seed/user-me/300',
    gender: '男',
    age: 26,
    location: '上海 · 静安区',
    education: '硕士研究生',
    height: 182,
    weight: 74,
    income: '50w - 100w',
    occupation: '资深交互设计师',
    bio: '在城市的每一个网格中发现被忽略的美。',
    isOnline: true,
    isMember: false,
    tags: ['艺术家', '摄影师', '数码爱好者'],
    mood: { emoji: '🔥', text: '热血', color: 'bg-red-500' },
    authStatus: {
      isRealPerson: true,
      isRealName: true,
      isPhoneLinked: true
    },
    giftStats: {
      '即刻咖啡': 12,
      '灵魂火箭': 2,
      '黑金钻戒': 0
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ posts, messageCount, currentUser, chatHistories }));
  }, [posts, messageCount, currentUser, chatHistories]);

  const navigateTo = (tab: AppTab, userId: string | null = null) => {
    setNavigationHistory(prev => [...prev, activeTab]);
    setSelectedUserId(userId);
    setActiveTab(tab);
  };

  const goBack = () => {
    if (navigationHistory.length > 0) {
      const prev = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prevH => prevH.slice(0, -1));
      setActiveTab(prev);
    } else {
      setActiveTab(AppTab.HOME);
    }
  };

  const handleUpdateProfile = (updates: Partial<User & { tags: string[] }>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const handleAddPost = (content: string, image?: string, video?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser.name,
      authorId: 'me',
      avatar: currentUser.avatar,
      time: '刚刚',
      content,
      image,
      video,
      likes: 0,
      isLiked: false,
      comments: []
    };
    setPosts([newPost, ...posts]);
    setActiveTab(AppTab.HOME);
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now().toString(), user: '我', text }]
        };
      }
      return p;
    }));
  };

  const handleUpdateChatHistory = useCallback((uid: string, newMessages: Message[]) => {
    setChatHistories(prev => {
      // Basic check to avoid infinite loops if the arrays are identical
      if (prev[uid] && JSON.stringify(prev[uid]) === JSON.stringify(newMessages)) return prev;
      return { ...prev, [uid]: newMessages };
    });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.HOME:
        return (
          <HomeView 
            posts={posts} 
            onLike={handleLike} 
            onAddPost={(content) => handleAddPost(content)} 
            onAvatarClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)}
            onAddComment={handleAddComment}
            onCreatePost={() => navigateTo(AppTab.CREATE_POST)}
            userMood={currentUser.mood}
            currentUserAvatar={currentUser.avatar}
            isMember={currentUser.isMember}
          />
        );
      case AppTab.DISCOVER:
        return <DiscoverView onUserClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} />;
      case AppTab.MESSAGES:
        return (
          <MessagesView 
            onChatClick={(uid) => navigateTo(AppTab.CHAT, uid)} 
            onAvatarClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)}
            onAddFriendsClick={() => navigateTo(AppTab.ADD_FRIENDS)}
            onSearchClick={() => navigateTo(AppTab.SEARCH)}
            onSystemMessagesClick={() => navigateTo(AppTab.SYSTEM_MESSAGES)}
            onMutualFollowsClick={() => navigateTo(AppTab.MUTUAL_FOLLOWS)}
          />
        );
      case AppTab.ME:
        return (
          <ProfileView 
            user={currentUser}
            onEditProfile={() => navigateTo(AppTab.EDIT_PROFILE)} 
            onSettings={() => navigateTo(AppTab.SETTINGS)}
            onMemberPurchase={() => navigateTo(AppTab.MEMBER_PURCHASE)}
            onUpdateMood={(mood) => handleUpdateProfile({ mood })}
            onViewVisitors={() => navigateTo(AppTab.VISITORS)}
          />
        );
      case AppTab.USER_PROFILE:
        return (
          <UserProfileView 
            userId={selectedUserId} 
            onBack={goBack} 
            onMessage={() => navigateTo(AppTab.CHAT, selectedUserId)} 
            onZap={() => setIsMatching(true)}
            isMember={currentUser.isMember}
          />
        );
      case AppTab.CHAT:
        return (
          <ChatView 
            key={selectedUserId} // CRITICAL: Reset component state when switching users
            userId={selectedUserId} 
            onBack={goBack} 
            isMember={currentUser.isMember}
            messageCount={messageCount}
            onMessageSent={() => setMessageCount(prev => prev + 1)}
            onPurchaseMember={() => navigateTo(AppTab.MEMBER_PURCHASE)}
            history={selectedUserId ? chatHistories[selectedUserId] : []}
            onUpdateHistory={(msgs) => selectedUserId && handleUpdateChatHistory(selectedUserId, msgs)}
          />
        );
      case AppTab.EDIT_PROFILE:
        return (
          <EditProfileView 
            user={currentUser} 
            onBack={goBack} 
            onUpdate={handleUpdateProfile} 
          />
        );
      case AppTab.MEMBER_PURCHASE:
        return (
          <MemberPurchaseView 
            onBack={goBack} 
            isCurrentlyMember={currentUser.isMember} 
            onActivate={() => handleUpdateProfile({ isMember: true })}
          />
        );
      case AppTab.VISITORS:
        return <VisitorRecordsView onBack={goBack} onUserClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} isMember={currentUser.isMember} onPurchaseMember={() => navigateTo(AppTab.MEMBER_PURCHASE)} />;
      case AppTab.SYSTEM_MESSAGES:
        return <SystemMessagesView onBack={goBack} />;
      case AppTab.MUTUAL_FOLLOWS:
        return <MutualFollowsView onBack={goBack} onUserClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} onChatClick={(uid) => navigateTo(AppTab.CHAT, uid)} />;
      case AppTab.CARD_SETTINGS:
        return <CardSettingsView onBack={goBack} />;
      case AppTab.SETTINGS:
        return <SettingsView onBack={goBack} isMember={currentUser.isMember} />;
      case AppTab.ADD_FRIENDS:
        return <AddFriendsView onBack={goBack} onUserClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} />;
      case AppTab.SEARCH:
        return <SearchView onBack={goBack} onUserClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} />;
      case AppTab.CREATE_POST:
        return <CreatePostView onBack={goBack} onPost={handleAddPost} />;
      default:
        return <HomeView posts={posts} isMember={currentUser.isMember} onLike={handleLike} onAddPost={(content) => handleAddPost(content)} onAvatarClick={(uid) => navigateTo(AppTab.USER_PROFILE, uid)} onAddComment={handleAddComment} onCreatePost={() => navigateTo(AppTab.CREATE_POST)} userMood={currentUser.mood} currentUserAvatar={currentUser.avatar} />;
    }
  };

  const isFullView = [
    AppTab.CHAT, AppTab.USER_PROFILE, AppTab.EDIT_PROFILE, 
    AppTab.MEMBER_PURCHASE, AppTab.CARD_SETTINGS, AppTab.SETTINGS,
    AppTab.ADD_FRIENDS, AppTab.SEARCH, AppTab.CREATE_POST, AppTab.VISITORS,
    AppTab.SYSTEM_MESSAGES, AppTab.MUTUAL_FOLLOWS
  ].includes(activeTab);

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-white shadow-xl relative overflow-hidden flex flex-col border-x border-black select-none">
      <main className="flex-1 overflow-y-auto pb-24 bg-white">
        {renderContent()}
      </main>

      {!isFullView && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setNavigationHistory([]);
            setActiveTab(tab);
          }} 
          onLightningClick={() => setIsMatching(true)}
        />
      )}

      {isMatching && <VideoMatch onClose={() => setIsMatching(false)} isMember={currentUser.isMember} />}
    </div>
  );
};

export default App;
