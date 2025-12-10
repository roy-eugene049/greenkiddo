import { ForumCategory, ForumPost, ForumComment } from '../types/forum';

// Mock Forum Categories
export const mockForumCategories: ForumCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Discuss anything related to sustainability and green living',
    icon: '💬',
    color: '#34f63a',
    postCount: 24
  },
  {
    id: 'course-qa',
    name: 'Course Q&A',
    description: 'Ask questions about course content and get help from the community',
    icon: '❓',
    color: '#3b82f6',
    postCount: 18
  },
  {
    id: 'sustainability-tips',
    name: 'Sustainability Tips',
    description: 'Share and discover practical tips for sustainable living',
    icon: '💡',
    color: '#f59e0b',
    postCount: 32
  },
  {
    id: 'projects',
    name: 'Projects & Ideas',
    description: 'Showcase your sustainability projects and get feedback',
    icon: '🌱',
    color: '#10b981',
    postCount: 15
  },
  {
    id: 'news',
    name: 'News & Updates',
    description: 'Latest news about climate change, sustainability, and technology',
    icon: '📰',
    color: '#8b5cf6',
    postCount: 12
  }
];

// Mock Forum Posts
export const mockForumPosts: ForumPost[] = [
  {
    id: 'post-1',
    categoryId: 'sustainability-tips',
    title: '10 Easy Ways to Reduce Plastic Waste at Home',
    content: 'I\'ve been working on reducing my plastic waste and here are some practical tips that have worked really well for me:\n\n1. Use reusable shopping bags\n2. Switch to a bamboo toothbrush\n3. Buy in bulk to reduce packaging\n4. Use glass containers instead of plastic\n5. Make your own cleaning products\n\nWhat are your favorite tips?',
    author: {
      id: 'user-1',
      name: 'Eco Warrior',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EcoWarrior',
      badges: ['Sustainability Expert']
    },
    upvotes: 45,
    downvotes: 2,
    commentCount: 12,
    views: 234,
    isPinned: true,
    isLocked: false,
    tags: ['plastic', 'waste-reduction', 'tips'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    lastActivityAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 'post-2',
    categoryId: 'course-qa',
    title: 'Question about Renewable Energy Basics - Solar Panel Efficiency',
    content: 'I\'m taking the Renewable Energy Basics course and I have a question about solar panel efficiency. The lesson mentions that most panels are around 20% efficient, but I\'ve seen some newer panels claiming 25%+. Can someone explain what factors affect efficiency?',
    author: {
      id: 'user-2',
      name: 'Curious Learner',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Curious',
      badges: []
    },
    upvotes: 8,
    downvotes: 0,
    commentCount: 5,
    views: 67,
    isPinned: false,
    isLocked: false,
    tags: ['renewable-energy', 'solar', 'question'],
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    lastActivityAt: '2024-01-16T11:30:00Z',
    courseId: 'course-2'
  },
  {
    id: 'post-3',
    categoryId: 'general',
    title: 'How Digitalization Affects Our Environment - Let\'s Discuss',
    content: 'I\'ve been thinking a lot about how our increasing reliance on digital technology impacts the environment. On one hand, it reduces paper use and enables remote work, but on the other hand, data centers consume massive amounts of energy.\n\nWhat are your thoughts on finding the balance?',
    author: {
      id: 'user-3',
      name: 'Tech Thinker',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechThinker',
      badges: ['Week Warrior']
    },
    upvotes: 23,
    downvotes: 1,
    commentCount: 18,
    views: 145,
    isPinned: false,
    isLocked: false,
    tags: ['digitalization', 'climate', 'discussion'],
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    lastActivityAt: '2024-01-16T15:00:00Z'
  },
  {
    id: 'post-4',
    categoryId: 'projects',
    title: 'My Zero-Waste Kitchen Project - Before & After',
    content: 'I\'ve been working on making my kitchen completely zero-waste over the past 3 months. Here\'s what I\'ve done:\n\n✅ Switched to glass storage containers\n✅ Started composting food scraps\n✅ Made my own cleaning products\n✅ Buy produce from local farmers market (bring my own bags)\n✅ Use reusable beeswax wraps instead of plastic wrap\n\nI\'ve reduced my kitchen waste by about 80%! Happy to answer any questions.',
    author: {
      id: 'user-4',
      name: 'Green Chef',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GreenChef',
      badges: ['Sustainability Expert', 'Quiz Master']
    },
    upvotes: 67,
    downvotes: 0,
    commentCount: 24,
    views: 312,
    isPinned: false,
    isLocked: false,
    tags: ['zero-waste', 'kitchen', 'project'],
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
    lastActivityAt: '2024-01-16T10:15:00Z'
  },
  {
    id: 'post-5',
    categoryId: 'news',
    title: 'New Study: Renewable Energy Now Cheaper Than Fossil Fuels',
    content: 'Just read an interesting article about how renewable energy costs have dropped significantly. Solar and wind are now cheaper than coal and gas in most parts of the world. This is great news for the transition to clean energy!\n\nLink: [article URL]\n\nWhat do you think this means for the future?',
    author: {
      id: 'user-5',
      name: 'News Reader',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NewsReader',
      badges: []
    },
    upvotes: 34,
    downvotes: 0,
    commentCount: 9,
    views: 189,
    isPinned: false,
    isLocked: false,
    tags: ['renewable-energy', 'news', 'climate'],
    createdAt: '2024-01-15T08:20:00Z',
    updatedAt: '2024-01-15T08:20:00Z',
    lastActivityAt: '2024-01-15T20:10:00Z'
  },
  {
    id: 'post-6',
    categoryId: 'course-qa',
    title: 'Help with Climate Change & Digitalization Course - Assignment',
    content: 'I\'m working on the final assignment for the Climate Change & Digitalization course and I\'m stuck on the part about calculating carbon footprint of digital services. Has anyone completed this? Any tips?',
    author: {
      id: 'user-6',
      name: 'Student Helper',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Student',
      badges: []
    },
    upvotes: 5,
    downvotes: 0,
    commentCount: 3,
    views: 42,
    isPinned: false,
    isLocked: false,
    tags: ['climate-change', 'assignment', 'help'],
    createdAt: '2024-01-16T13:00:00Z',
    updatedAt: '2024-01-16T13:00:00Z',
    lastActivityAt: '2024-01-16T14:45:00Z',
    courseId: 'course-4'
  }
];

// Mock Comments
export const mockComments: ForumComment[] = [
  {
    id: 'comment-1',
    postId: 'post-1',
    content: 'Great tips! I\'ve also found that using a safety razor instead of disposable razors makes a huge difference. It\'s a one-time purchase and the blades are recyclable.',
    author: {
      id: 'user-7',
      name: 'Eco Enthusiast',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EcoEnthusiast',
      badges: []
    },
    upvotes: 12,
    downvotes: 0,
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'comment-2',
    postId: 'post-1',
    content: 'Thanks for sharing! I\'m going to try making my own cleaning products this weekend. Do you have any favorite recipes?',
    author: {
      id: 'user-8',
      name: 'Newbie Green',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Newbie',
      badges: []
    },
    upvotes: 5,
    downvotes: 0,
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-15T12:30:00Z'
  },
  {
    id: 'comment-3',
    postId: 'post-2',
    content: 'Great question! Solar panel efficiency is affected by several factors:\n\n1. **Material quality**: Monocrystalline panels are more efficient than polycrystalline\n2. **Temperature**: Panels are less efficient in hot weather\n3. **Angle and orientation**: Optimal positioning matters a lot\n4. **Shading**: Even partial shading can significantly reduce output\n5. **Age**: Efficiency degrades slightly over time (about 0.5% per year)\n\nThe newer high-efficiency panels use advanced cell technologies like PERC (Passivated Emitter Rear Cell) or bifacial designs.',
    author: {
      id: 'user-9',
      name: 'Solar Expert',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SolarExpert',
      badges: ['Sustainability Expert']
    },
    upvotes: 15,
    downvotes: 0,
    isAccepted: true,
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z'
  },
  {
    id: 'comment-4',
    postId: 'post-4',
    content: 'This is amazing! How did you handle the transition? I\'m finding it hard to give up some convenience items.',
    author: {
      id: 'user-10',
      name: 'Transition Helper',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Transition',
      badges: []
    },
    upvotes: 8,
    downvotes: 0,
    createdAt: '2024-01-13T14:00:00Z',
    updatedAt: '2024-01-13T14:00:00Z'
  }
];

// Helper functions
export const getCategoryById = (categoryId: string): ForumCategory | undefined => {
  return mockForumCategories.find(cat => cat.id === categoryId);
};

export const getPostsByCategory = (categoryId: string): ForumPost[] => {
  if (categoryId === 'all') {
    return mockForumPosts;
  }
  return mockForumPosts.filter(post => post.categoryId === categoryId);
};

export const getPostById = (postId: string): ForumPost | undefined => {
  return mockForumPosts.find(post => post.id === postId);
};

export const getCommentsByPostId = (postId: string): ForumComment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

export const searchPosts = (query: string): ForumPost[] => {
  const lowerQuery = query.toLowerCase();
  return mockForumPosts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Service class for forum operations
export class ForumService {
  static async getCategories(): Promise<ForumCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockForumCategories;
  }

  static async getPosts(categoryId?: string, searchQuery?: string): Promise<ForumPost[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let posts = categoryId ? getPostsByCategory(categoryId) : mockForumPosts;
    
    if (searchQuery) {
      posts = searchPosts(searchQuery);
    }
    
    // Sort by pinned first, then by last activity
    return posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime();
    });
  }

  static async getPostById(postId: string): Promise<ForumPost | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = getPostById(postId);
    return post || null;
  }

  static async getComments(postId: string): Promise<ForumComment[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getCommentsByPostId(postId);
  }

  static async createPost(post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'views' | 'upvotes' | 'downvotes' | 'commentCount'>): Promise<ForumPost> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPost: ForumPost = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      isPinned: false,
      isLocked: false
    };
    mockForumPosts.unshift(newPost);
    return newPost;
  }

  static async createComment(comment: Omit<ForumComment, 'id' | 'createdAt' | 'updatedAt' | 'upvotes' | 'downvotes'>): Promise<ForumComment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newComment: ForumComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0
    };
    mockComments.push(newComment);
    
    // Update post comment count
    const post = mockForumPosts.find(p => p.id === comment.postId);
    if (post) {
      post.commentCount += 1;
      post.lastActivityAt = new Date().toISOString();
    }
    
    return newComment;
  }

  static async votePost(postId: string, userId: string, vote: 'upvote' | 'downvote' | null): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = mockForumPosts.find(p => p.id === postId);
    if (post) {
      // In a real app, you'd track user votes to prevent double voting
      if (vote === 'upvote') {
        post.upvotes += 1;
      } else if (vote === 'downvote') {
        post.downvotes += 1;
      }
      return true;
    }
    return false;
  }

  static async voteComment(commentId: string, userId: string, vote: 'upvote' | 'downvote' | null): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const comment = mockComments.find(c => c.id === commentId);
    if (comment) {
      if (vote === 'upvote') {
        comment.upvotes += 1;
      } else if (vote === 'downvote') {
        comment.downvotes += 1;
      }
      return true;
    }
    return false;
  }
}

