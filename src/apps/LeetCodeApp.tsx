import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Flame,
  Award,
  CheckCircle2,
  Code2,
  ExternalLink,
  TrendingUp,
  Search,
  Copy,
  Check,
  Cpu,
  Clock,
  Layers,
} from 'lucide-react';
import { sound } from '../services/sound';

interface SolutionProblem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color: string;
  topic: 'Arrays' | 'Strings' | 'Trees' | 'Graphs' | 'Dynamic Programming' | 'Data Structures';
  timeComplexity: string;
  spaceComplexity: string;
  runtime: string;
  memory: string;
  pythonCode: string;
  cppCode: string;
}

export function LeetCodeApp({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'topics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [langPerProblem, setLangPerProblem] = useState<Record<string, 'python' | 'cpp'>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = {
    totalSolved: 184,
    totalProblems: 3100,
    acceptanceRate: '68.4%',
    streak: 128,
    contestRating: 1684,
    globalRank: 'Top 8.5%',
    breakdown: [
      { level: 'Easy', count: 85, total: 820, color: '#00b8a3', percent: 65 },
      { level: 'Medium', count: 78, total: 1720, color: '#ffc01e', percent: 54 },
      { level: 'Hard', count: 21, total: 710, color: '#ff375f', percent: 28 },
    ],
  };

  const topicDistribution = [
    { name: 'Arrays & Two Pointers', key: 'Arrays', count: 48, icon: '🧮' },
    { name: 'Strings & Window', key: 'Strings', count: 36, icon: '🔤' },
    { name: 'Dynamic Programming', key: 'Dynamic Programming', count: 32, icon: '⚡' },
    { name: 'Trees & BSTs', key: 'Trees', count: 29, icon: '🌲' },
    { name: 'Graphs & BFS/DFS', key: 'Graphs', count: 24, icon: '🕸️' },
    { name: 'Data Structures & Queues', key: 'Data Structures', count: 15, icon: '📚' },
  ];

  const solutionsList: SolutionProblem[] = [
    {
      id: 'trapping-rain-water',
      number: 42,
      title: 'Trapping Rain Water',
      difficulty: 'Hard',
      color: '#ff375f',
      topic: 'Arrays',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      runtime: '98.1% faster',
      memory: '91.4% better',
      pythonCode: `def trap(height: list[int]) -> int:
    if len(height) <= 2:
        return 0
    left, right = 0, len(height) - 1
    left_max, right_max = height[left], height[right]
    water = 0
    while left < right:
        if height[left] < height[right]:
            left += 1
            left_max = max(left_max, height[left])
            water += left_max - height[left]
        else:
            right -= 1
            right_max = max(right_max, height[right])
            water += right_max - height[right]
    return water`,
      cppCode: `int trap(vector<int>& height) {
    if (height.size() <= 2) return 0;
    int left = 0, right = height.size() - 1;
    int leftMax = 0, rightMax = 0, total = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = max(leftMax, height[left]);
            total += leftMax - height[left];
            left++;
        } else {
            rightMax = max(rightMax, height[right]);
            total += rightMax - height[right];
            right--;
        }
    }
    return total;
}`,
    },
    {
      id: 'longest-substring',
      number: 3,
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      color: '#ffc01e',
      topic: 'Strings',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(min(N, M))',
      runtime: '95.8% faster',
      memory: '89.2% better',
      pythonCode: `def lengthOfLongestSubstring(s: str) -> int:
    char_map = {} # char -> last seen index
    left = max_len = 0
    for right, ch in enumerate(s):
        if ch in char_map and char_map[ch] >= left:
            left = char_map[ch] + 1
        char_map[ch] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      cppCode: `int lengthOfLongestSubstring(string s) {
    vector<int> charIndex(128, -1);
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); ++right) {
        if (charIndex[s[right]] >= left) {
            left = charIndex[s[right]] + 1;
        }
        charIndex[s[right]] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    },
    {
      id: 'binary-tree-max-path',
      number: 124,
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      color: '#ff375f',
      topic: 'Trees',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(H)',
      runtime: '97.4% faster',
      memory: '93.6% better',
      pythonCode: `class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        max_sum = float('-inf')
        def dfs(node):
            nonlocal max_sum
            if not node: return 0
            left_gain = max(dfs(node.left), 0)
            right_gain = max(dfs(node.right), 0)
            current_path = node.val + left_gain + right_gain
            max_sum = max(max_sum, current_path)
            return node.val + max(left_gain, right_gain)
        dfs(root)
        return max_sum`,
      cppCode: `class Solution {
    int maxSum = INT_MIN;
    int dfs(TreeNode* node) {
        if (!node) return 0;
        int leftGain = max(dfs(node->left), 0);
        int rightGain = max(dfs(node->right), 0);
        maxSum = max(maxSum, node->val + leftGain + rightGain);
        return node->val + max(leftGain, rightGain);
    }
public:
    int maxPathSum(TreeNode* root) {
        dfs(root);
        return maxSum;
    }
};`,
    },
    {
      id: 'number-of-islands',
      number: 200,
      title: 'Number of Islands',
      difficulty: 'Medium',
      color: '#ffc01e',
      topic: 'Graphs',
      timeComplexity: 'O(M × N)',
      spaceComplexity: 'O(M × N)',
      runtime: '94.6% faster',
      memory: '90.1% better',
      pythonCode: `def numIslands(grid: list[list[str]]) -> int:
    if not grid: return 0
    m, n = len(grid), len(grid[0])
    count = 0
    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0' # Mark visited in-place
        dfs(r + 1, c); dfs(r - 1, c)
        dfs(r, c + 1); dfs(r, c - 1)
    for r in range(m):
        for c in range(n):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      cppCode: `class Solution {
    void dfs(vector<vector<char>>& grid, int r, int c) {
        if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != '1')
            return;
        grid[r][c] = '0';
        dfs(grid, r+1, c); dfs(grid, r-1, c);
        dfs(grid, r, c+1); dfs(grid, r, c-1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < grid.size(); ++r) {
            for (int c = 0; c < grid[0].size(); ++c) {
                if (grid[r][c] == '1') { count++; dfs(grid, r, c); }
            }
        }
        return count;
    }
};`,
    },
    {
      id: 'longest-increasing-subsequence',
      number: 300,
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      color: '#ffc01e',
      topic: 'Dynamic Programming',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      runtime: '99.2% faster',
      memory: '94.5% better',
      pythonCode: `from bisect import bisect_left

def lengthOfLIS(nums: list[int]) -> int:
    tails = []
    for x in nums:
        idx = bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`,
      cppCode: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int x : nums) {
        auto it = lower_bound(tails.begin(), tails.end(), x);
        if (it == tails.end()) tails.push_back(x);
        else *it = x;
    }
    return tails.size();
}`,
    },
    {
      id: 'lru-cache',
      number: 146,
      title: 'LRU Cache',
      difficulty: 'Medium',
      color: '#ffc01e',
      topic: 'Data Structures',
      timeComplexity: 'O(1) Get & Put',
      spaceComplexity: 'O(Capacity)',
      runtime: '96.5% faster',
      memory: '91.0% better',
      pythonCode: `class Node:
    def __init__(self, key=0, val=0):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.head, self.tail = Node(), Node()
        self.head.next, self.tail.prev = self.tail, self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1`,
      cppCode: `class LRUCache {
    int cap;
    list<pair<int, int>> lru;
    unordered_map<int, list<pair<int, int>>::iterator> cache;
public:
    LRUCache(int capacity) : cap(capacity) {}
    int get(int key) {
        if (cache.find(key) == cache.end()) return -1;
        lru.splice(lru.begin(), lru, cache[key]);
        return cache[key]->second;
    }
    void put(int key, int value) {
        if (cache.count(key)) {
            lru.splice(lru.begin(), lru, cache[key]);
            cache[key]->second = value;
            return;
        }
        if (lru.size() == cap) {
            cache.erase(lru.back().first);
            lru.pop_back();
        }
        lru.emplace_front(key, value);
        cache[key] = lru.begin();
    }
};`,
    },
    {
      id: 'two-sum',
      number: 1,
      title: 'Two Sum',
      difficulty: 'Easy',
      color: '#00b8a3',
      topic: 'Arrays',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      runtime: '99.4% faster',
      memory: '88.7% better',
      pythonCode: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {} # value -> index
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cppCode: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) return {seen[complement], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    },
    {
      id: 'reverse-linked-list',
      number: 206,
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      color: '#00b8a3',
      topic: 'Data Structures',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      runtime: '100% faster',
      memory: '96.2% better',
      pythonCode: `def reverseList(head: Optional[ListNode]) -> Optional[ListNode]:
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
      cppCode: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}`,
    },
  ];

  const filteredSolutions = useMemo(() => {
    return solutionsList.filter((sol) => {
      const matchSearch =
        searchQuery === '' ||
        sol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sol.number.toString().includes(searchQuery) ||
        sol.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDifficulty =
        selectedDifficulty === 'All' || sol.difficulty === selectedDifficulty;

      const matchTopic = selectedTopic === 'All' || sol.topic === selectedTopic;

      return matchSearch && matchDifficulty && matchTopic;
    });
  }, [solutionsList, searchQuery, selectedDifficulty, selectedTopic]);

  const copyCode = (id: string, code: string) => {
    sound.playTapSound();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="leetcode-page">
      {/* Top Header */}
      <header className="leetcode-header">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
          <span>Home</span>
        </button>

        <div className="leetcode-title-box">
          <span className="leetcode-brand-badge">LC</span>
          <span>LeetCode Profile</span>
        </div>

        <a
          href="https://leetcode.com"
          target="_blank"
          rel="noreferrer"
          className="lc-external-btn"
          aria-label="Open LeetCode in browser"
        >
          <ExternalLink size={16} />
        </a>
      </header>

      {/* Tabs */}
      <div className="leetcode-tabs-bar">
        <button
          type="button"
          className={`lc-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('overview');
          }}
        >
          Overview
        </button>
        <button
          type="button"
          className={`lc-tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('topics');
          }}
        >
          Topics
        </button>
        <button
          type="button"
          className={`lc-tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
          onClick={() => {
            sound.playTapSound();
            setActiveTab('solutions');
          }}
        >
          Solutions ({solutionsList.length})
        </button>
      </div>

      {/* Body Content */}
      <div className="leetcode-body-scroll">
        {activeTab === 'overview' && (
          <div className="lc-overview-container">
            {/* Main Stats Card */}
            <div className="lc-hero-card">
              <div className="lc-hero-header">
                <div className="lc-user-badge">
                  <div className="lc-avatar">UK</div>
                  <div>
                    <strong>Uday Kiran Jammula</strong>
                    <small>KL University · CSE '27</small>
                  </div>
                </div>
                <div className="lc-streak-chip">
                  <Flame size={14} className="text-amber" />
                  <span>{stats.streak} Day Streak</span>
                </div>
              </div>

              {/* Progress Circle & Solved Numbers */}
              <div className="lc-solved-summary-row">
                <div className="lc-radial-solved">
                  <div className="lc-big-number">{stats.totalSolved}</div>
                  <span className="lc-sub-label">Solved</span>
                </div>

                <div className="lc-difficulty-bars">
                  {stats.breakdown.map((b) => (
                    <div key={b.level} className="lc-level-bar-row">
                      <div className="lc-level-label-wrap">
                        <span style={{ color: b.color, fontWeight: 700 }}>{b.level}</span>
                        <span className="lc-count-ratio">
                          {b.count} <small>/ {b.total}</small>
                        </span>
                      </div>
                      <div className="lc-track-bar">
                        <div
                          className="lc-fill-bar"
                          style={{ width: `${b.percent}%`, backgroundColor: b.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contest & Acceptance Stats */}
              <div className="lc-kpis-grid">
                <div className="lc-kpi-box">
                  <TrendingUp size={16} className="text-cyan" />
                  <div>
                    <span className="kpi-value">{stats.contestRating}</span>
                    <span className="kpi-label">Contest Rating</span>
                  </div>
                </div>
                <div className="lc-kpi-box">
                  <CheckCircle2 size={16} className="text-emerald" />
                  <div>
                    <span className="kpi-value">{stats.acceptanceRate}</span>
                    <span className="kpi-label">Acceptance Rate</span>
                  </div>
                </div>
                <div className="lc-kpi-box">
                  <Award size={16} className="text-amber" />
                  <div>
                    <span className="kpi-value">{stats.globalRank}</span>
                    <span className="kpi-label">Global Rank</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Skills Callout */}
            <div className="lc-section-box">
              <h3 className="lc-section-title">Verified Core Competencies</h3>
              <p className="lc-section-desc">
                Consistent daily practice focused on asymptotic space/time complexity optimization, recursive backtracking, dynamic programming state transitions, and memory allocation in C & C++.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="lc-topics-container">
            <h3 className="lc-section-title">Topic Distribution (184 Solved)</h3>
            <div className="lc-topics-grid">
              {topicDistribution.map((t) => (
                <div
                  key={t.name}
                  className="lc-topic-card"
                  onClick={() => {
                    setSelectedTopic(t.key);
                    setActiveTab('solutions');
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="topic-emoji">{t.icon}</span>
                  <div className="topic-text">
                    <strong>{t.name}</strong>
                    <span>{t.count} Solved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="lc-solutions-container">
            {/* Search Input */}
            <div className="lc-search-wrap">
              <Search size={14} className="lc-search-icon" />
              <input
                type="text"
                placeholder="Search solutions by name, # or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="lc-search-input"
              />
            </div>

            {/* Filter Chips */}
            <div className="lc-filters-row">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className={`lc-filter-chip ${selectedDifficulty === diff ? 'active' : ''}`}
                  onClick={() => {
                    sound.playTapSound();
                    setSelectedDifficulty(diff);
                  }}
                >
                  {diff}
                </button>
              ))}
              {(['All', 'Arrays', 'Strings', 'Trees', 'Graphs', 'Dynamic Programming'] as const).map(
                (topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={`lc-filter-chip ${selectedTopic === topic ? 'active' : ''}`}
                    onClick={() => {
                      sound.playTapSound();
                      setSelectedTopic(topic);
                    }}
                  >
                    {topic}
                  </button>
                )
              )}
            </div>

            {/* Solutions List */}
            {filteredSolutions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: 12 }}>
                No solutions found matching your filters.
              </div>
            ) : (
              filteredSolutions.map((sol) => {
                const currentLang = langPerProblem[sol.id] || 'python';
                const codeToShow = currentLang === 'python' ? sol.pythonCode : sol.cppCode;

                return (
                  <div key={sol.id} className="lc-solution-card">
                    {/* Header */}
                    <div className="lc-sol-header">
                      <div>
                        <span
                          className="lc-sol-diff"
                          style={{ color: sol.color, borderColor: sol.color }}
                        >
                          {sol.difficulty}
                        </span>
                        <h4 className="lc-sol-title">
                          {sol.number}. {sol.title}
                        </h4>
                      </div>
                    </div>

                    {/* Metric Badges */}
                    <div className="lc-metric-pills">
                      <span className="lc-metric-pill time">
                        <Clock size={11} /> Time: {sol.timeComplexity}
                      </span>
                      <span className="lc-metric-pill space">
                        <Cpu size={11} /> Space: {sol.spaceComplexity}
                      </span>
                      <span className="lc-metric-pill topic">
                        <Layers size={11} /> {sol.topic}
                      </span>
                      <span className="perf-badge">🚀 {sol.runtime}</span>
                    </div>

                    {/* Code Header Bar with Language Switch & Copy Button */}
                    <div className="lc-code-header-bar">
                      <div className="lc-lang-switch">
                        <button
                          type="button"
                          className={`lc-lang-tab ${currentLang === 'python' ? 'active' : ''}`}
                          onClick={() => {
                            sound.playTapSound();
                            setLangPerProblem((prev) => ({ ...prev, [sol.id]: 'python' }));
                          }}
                        >
                          Python 3
                        </button>
                        <button
                          type="button"
                          className={`lc-lang-tab ${currentLang === 'cpp' ? 'active' : ''}`}
                          onClick={() => {
                            sound.playTapSound();
                            setLangPerProblem((prev) => ({ ...prev, [sol.id]: 'cpp' }));
                          }}
                        >
                          C++
                        </button>
                      </div>

                      <button
                        type="button"
                        className="lc-copy-btn"
                        onClick={() => copyCode(sol.id, codeToShow)}
                        title="Copy solution code"
                      >
                        {copiedId === sol.id ? (
                          <>
                            <Check size={12} className="text-emerald" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code Viewer */}
                    <div className="lc-code-viewer">
                      <pre>
                        <code>{codeToShow}</code>
                      </pre>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
