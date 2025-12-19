import {
  StudyGroup,
  StudyGroupMember,
  StudyGroupPost,
  Message,
  Conversation,
  GroupProject,
  CollaborativeNote,
  StudyBuddy,
  StudyBuddyProfile,
  GroupChallenge,
  SocialFeedPost,
} from '../types/social';

const STORAGE_KEY_PREFIX = 'greenkiddo_social_';

/**
 * Study Groups
 */
export const getStudyGroups = async (userId?: string): Promise<StudyGroup[]> => {
  const key = `${STORAGE_KEY_PREFIX}study_groups`;
  const stored = localStorage.getItem(key);
  const groups: StudyGroup[] = stored ? JSON.parse(stored) : [];

  if (userId) {
    // Filter to groups user is member of or public groups
    return groups.filter(
      g => g.isPublic || g.members.some(m => m.userId === userId)
    );
  }

  return groups.filter(g => g.isPublic);
};

export const getStudyGroupById = async (groupId: string): Promise<StudyGroup | null> => {
  const groups = await getStudyGroups();
  return groups.find(g => g.id === groupId) || null;
};

export const createStudyGroup = async (
  group: Omit<StudyGroup, 'id' | 'createdAt' | 'updatedAt' | 'lastActivityAt' | 'members'>
): Promise<StudyGroup> => {
  const key = `${STORAGE_KEY_PREFIX}study_groups`;
  const groups = await getStudyGroups();
  
  const newGroup: StudyGroup = {
    ...group,
    id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    members: [{
      userId: group.createdBy.id,
      userName: group.createdBy.name,
      userAvatar: group.createdBy.avatar,
      role: 'owner',
      joinedAt: new Date().toISOString(),
      status: 'active',
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };

  groups.push(newGroup);
  localStorage.setItem(key, JSON.stringify(groups));
  return newGroup;
};

export const joinStudyGroup = async (groupId: string, userId: string, userName: string, userAvatar?: string): Promise<void> => {
  const groups = await getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  
  if (!group) throw new Error('Group not found');
  if (group.members.some(m => m.userId === userId)) return; // Already a member
  if (group.maxMembers && group.members.length >= group.maxMembers) {
    throw new Error('Group is full');
  }

  group.members.push({
    userId,
    userName,
    userAvatar,
    role: 'member',
    joinedAt: new Date().toISOString(),
    status: 'active',
  });

  group.updatedAt = new Date().toISOString();
  group.lastActivityAt = new Date().toISOString();

  const key = `${STORAGE_KEY_PREFIX}study_groups`;
  localStorage.setItem(key, JSON.stringify(groups));
};

export const leaveStudyGroup = async (groupId: string, userId: string): Promise<void> => {
  const groups = await getStudyGroups();
  const group = groups.find(g => g.id === groupId);
  
  if (!group) throw new Error('Group not found');
  
  group.members = group.members.filter(m => m.userId !== userId);
  group.updatedAt = new Date().toISOString();
  group.lastActivityAt = new Date().toISOString();

  const key = `${STORAGE_KEY_PREFIX}study_groups`;
  localStorage.setItem(key, JSON.stringify(groups));
};

/**
 * Messages
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  const key = `${STORAGE_KEY_PREFIX}conversations_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const key = `${STORAGE_KEY_PREFIX}messages_${conversationId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
  type: 'text' | 'file' | 'image' = 'text'
): Promise<Message> => {
  // Get or create conversation
  const conversations = await getConversations(senderId);
  let conversation = conversations.find(
    c => c.participants.some(p => p.userId === receiverId) && c.type === 'direct'
  );

  if (!conversation) {
    conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [
        { userId: senderId, userName: 'You', isOnline: true },
        { userId: receiverId, userName: 'User', isOnline: false },
      ],
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      type: 'direct',
    };
    conversations.push(conversation);
  }

  const message: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    conversationId: conversation.id,
    senderId,
    receiverId,
    content,
    type,
    read: false,
    createdAt: new Date().toISOString(),
  };

  // Save message
  const messages = await getMessages(conversation.id);
  messages.push(message);
  const messagesKey = `${STORAGE_KEY_PREFIX}messages_${conversation.id}`;
  localStorage.setItem(messagesKey, JSON.stringify(messages));

  // Update conversation
  conversation.lastMessage = message;
  conversation.updatedAt = new Date().toISOString();
  const convKey = `${STORAGE_KEY_PREFIX}conversations_${senderId}`;
  localStorage.setItem(convKey, JSON.stringify(conversations));

  return message;
};

/**
 * Group Projects
 */
export const getGroupProjects = async (groupId: string): Promise<GroupProject[]> => {
  const key = `${STORAGE_KEY_PREFIX}projects_${groupId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const createGroupProject = async (
  project: Omit<GroupProject, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'tasks'>
): Promise<GroupProject> => {
  const newProject: GroupProject = {
    ...project,
    id: `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    members: [{
      userId: project.createdBy.id,
      userName: project.createdBy.name,
      userAvatar: project.createdBy.avatar,
      role: 'leader',
      tasksAssigned: [],
      joinedAt: new Date().toISOString(),
    }],
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const projects = await getGroupProjects(project.groupId);
  projects.push(newProject);
  const key = `${STORAGE_KEY_PREFIX}projects_${project.groupId}`;
  localStorage.setItem(key, JSON.stringify(projects));

  return newProject;
};

/**
 * Collaborative Notes
 */
export const getCollaborativeNotes = async (userId: string): Promise<CollaborativeNote[]> => {
  const key = `${STORAGE_KEY_PREFIX}collab_notes_${userId}`;
  const stored = localStorage.getItem(key);
  const allNotes: CollaborativeNote[] = stored ? JSON.parse(stored) : [];
  
  // Return notes user owns or is a collaborator on
  return allNotes.filter(
    note => note.createdBy.id === userId || note.collaborators.some(c => c.userId === userId)
  );
};

export const createCollaborativeNote = async (
  note: Omit<CollaborativeNote, 'id' | 'version' | 'versions' | 'createdAt' | 'updatedAt' | 'collaborators'>
): Promise<CollaborativeNote> => {
  const newNote: CollaborativeNote = {
    ...note,
    id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    version: 1,
    versions: [{
      version: 1,
      content: note.content,
      editedBy: note.createdBy,
      editedAt: new Date().toISOString(),
    }],
    collaborators: [{
      userId: note.createdBy.id,
      userName: note.createdBy.name,
      userAvatar: note.createdBy.avatar,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const notes = await getCollaborativeNotes(note.createdBy.id);
  notes.push(newNote);
  const key = `${STORAGE_KEY_PREFIX}collab_notes_${note.createdBy.id}`;
  localStorage.setItem(key, JSON.stringify(notes));

  return newNote;
};

/**
 * Study Buddy Matching
 */
export const getStudyBuddyProfile = async (userId: string): Promise<StudyBuddyProfile | null> => {
  const key = `${STORAGE_KEY_PREFIX}buddy_profile_${userId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
};

export const createStudyBuddyProfile = async (profile: StudyBuddyProfile): Promise<void> => {
  const key = `${STORAGE_KEY_PREFIX}buddy_profile_${profile.userId}`;
  localStorage.setItem(key, JSON.stringify(profile));
};

export const findStudyBuddies = async (userId: string): Promise<StudyBuddy[]> => {
  const userProfile = await getStudyBuddyProfile(userId);
  if (!userProfile) return [];

  // Get all profiles
  const keys = Object.keys(localStorage);
  const profiles: StudyBuddyProfile[] = [];
  
  keys.forEach(key => {
    if (key.startsWith(`${STORAGE_KEY_PREFIX}buddy_profile_`) && !key.endsWith(userId)) {
      const profile = localStorage.getItem(key);
      if (profile) {
        profiles.push(JSON.parse(profile));
      }
    }
  });

  // Calculate compatibility
  const matches: StudyBuddy[] = [];
  
  profiles.forEach(profile => {
    if (profile.lookingFor === 'study-buddy' || profile.lookingFor === 'both') {
      const commonInterests = userProfile.interests.filter(i => profile.interests.includes(i));
      const commonCourses = userProfile.courses.filter(c => profile.courses.includes(c));
      const compatibility = Math.min(
        (commonInterests.length / Math.max(userProfile.interests.length, 1)) * 50 +
        (commonCourses.length / Math.max(userProfile.courses.length, 1)) * 50,
        100
      );

      if (compatibility >= 30) { // Minimum 30% compatibility
        matches.push({
          id: `buddy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId,
          matchedUserId: profile.userId,
          userName: userProfile.userName,
          matchedUserName: profile.userName,
          userAvatar: userProfile.userAvatar,
          matchedUserAvatar: profile.userAvatar,
          compatibility: Math.round(compatibility),
          commonInterests,
          commonCourses,
          status: 'pending',
          matchedAt: new Date().toISOString(),
        });
      }
    }
  });

  return matches.sort((a, b) => b.compatibility - a.compatibility);
};

/**
 * Group Challenges
 */
export const getGroupChallenges = async (groupId: string): Promise<GroupChallenge[]> => {
  const key = `${STORAGE_KEY_PREFIX}group_challenges_${groupId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

export const createGroupChallenge = async (
  challenge: Omit<GroupChallenge, 'id' | 'createdAt' | 'participants' | 'leaderboard' | 'status'>
): Promise<GroupChallenge> => {
  const newChallenge: GroupChallenge = {
    ...challenge,
    id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    participants: [{
      userId: challenge.createdBy.id,
      userName: challenge.createdBy.name,
      userAvatar: challenge.createdBy.avatar,
      progress: 0,
      joinedAt: new Date().toISOString(),
    }],
    leaderboard: [],
    status: new Date(challenge.startDate) <= new Date() ? 'active' : 'upcoming',
    createdAt: new Date().toISOString(),
  };

  const challenges = await getGroupChallenges(challenge.groupId);
  challenges.push(newChallenge);
  const key = `${STORAGE_KEY_PREFIX}group_challenges_${challenge.groupId}`;
  localStorage.setItem(key, JSON.stringify(challenges));

  return newChallenge;
};

/**
 * Social Feed
 */
export const getSocialFeed = async (userId: string, limit: number = 20): Promise<SocialFeedPost[]> => {
  const key = `${STORAGE_KEY_PREFIX}social_feed`;
  const stored = localStorage.getItem(key);
  const allPosts: SocialFeedPost[] = stored ? JSON.parse(stored) : [];

  // Return posts from user's groups, friends, or public posts
  return allPosts
    .filter(post => {
      // Include posts from user's study groups, buddies, or public posts
      return true; // Simplified for now
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const createSocialFeedPost = async (
  post: Omit<SocialFeedPost, 'id' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isShared' | 'createdAt' | 'updatedAt'>
): Promise<SocialFeedPost> => {
  const newPost: SocialFeedPost = {
    ...post,
    id: `feed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    likes: 0,
    comments: [],
    shares: 0,
    isLiked: false,
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const posts = await getSocialFeed(post.author.id, 1000);
  posts.push(newPost);
  const key = `${STORAGE_KEY_PREFIX}social_feed`;
  localStorage.setItem(key, JSON.stringify(posts));

  return newPost;
};

