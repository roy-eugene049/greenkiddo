import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Target, Trophy, Calendar, Award } from 'lucide-react';
import { Challenge, Quest } from '../types/gamification';
import { getUserChallenges, getUserQuests, completeChallenge } from '../services/gamificationService';
import { ChallengeCard } from '../components/gamification/ChallengeCard';
import { QuestCard } from '../components/gamification/QuestCard';

const Challenges = () => {
  const { user } = useUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'quests'>('challenges');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [challengesData, questsData] = await Promise.all([
          getUserChallenges(user.id),
          getUserQuests(user.id),
        ]);
        setChallenges(challengesData);
        setQuests(questsData);
      } catch (error) {
        console.error('Error loading challenges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const handleChallengeComplete = async (challengeId: string) => {
    if (!user) return;
    
    try {
      await completeChallenge(user.id, challengeId);
      // Reload challenges
      const updatedChallenges = await getUserChallenges(user.id);
      setChallenges(updatedChallenges);
    } catch (error) {
      console.error('Error completing challenge:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Please sign in to view challenges</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading challenges...</div>
      </div>
    );
  }

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);
  const activeQuests = quests.filter(q => q.unlocked && !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  const lockedQuests = quests.filter(q => !q.unlocked);

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-green-ecco" />
            <h1 className="text-3xl font-bold">Challenges & Quests</h1>
          </div>
          <p className="text-gray-400">Complete challenges and quests to earn points, XP, and badges!</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`
              px-6 py-3 font-semibold border-b-2 transition-colors
              ${activeTab === 'challenges'
                ? 'border-green-ecco text-green-ecco'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Challenges
            </div>
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`
              px-6 py-3 font-semibold border-b-2 transition-colors
              ${activeTab === 'quests'
                ? 'border-green-ecco text-green-ecco'
                : 'border-transparent text-gray-400 hover:text-gray-300'
              }
            `}
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Quests
            </div>
          </button>
        </div>

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {/* Active Challenges */}
            {activeChallenges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-ecco" />
                  Active Challenges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onComplete={handleChallengeComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Challenges */}
            {completedChallenges.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Completed Challenges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onComplete={handleChallengeComplete}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeChallenges.length === 0 && completedChallenges.length === 0 && (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No challenges available yet</p>
              </div>
            )}
          </div>
        )}

        {/* Quests Tab */}
        {activeTab === 'quests' && (
          <div className="space-y-6">
            {/* Active Quests */}
            {activeQuests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-ecco" />
                  Active Quests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}

            {/* Locked Quests */}
            {lockedQuests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-500" />
                  Locked Quests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lockedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Quests */}
            {completedQuests.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Completed Quests
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedQuests.map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </div>
            )}

            {activeQuests.length === 0 && lockedQuests.length === 0 && completedQuests.length === 0 && (
              <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No quests available yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;

