import React, { useState } from 'react';
import { ChevronLeft, Flame, Award, CheckCircle2, Code2, ExternalLink, TrendingUp, BarChart3, Terminal } from 'lucide-react';
import { sound } from '../services/sound';

export function LeetCodeApp({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'topics'>('overview');

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

  const topicTags = [
    { name: 'Arrays & Two Pointers', count: 48, icon: '🧮' },
    { name: 'Dynamic Programming', count: 32, icon: '⚡' },
    { name: 'Trees & BSTs', count: 29, icon: '🌲' },
    { name: 'Graphs & BFS/DFS', count: 24, icon: '🕸️' },
    { name: 'Stack & Monotonic Queue', count: 26, icon: '📚' },
    { name: 'Bit Manipulation & Math', count: 25, icon: '⚙️' },
  ];

  const featuredSolutions = [
    {
      id: 'lru-cache',
      title: '146. LRU Cache',
      difficulty: 'Medium',
      color: '#ffc01e',
      lang: 'Python3',
      runtime: '94.2% faster',
      memory: '88.5% better',
      complexity: 'O(1) Get & Put with Doubly Linked List + HashMap',
      codeSnippet: `class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {} # key -> node
        self.head, self.tail = Node(0, 0), Node(0, 0)
        self.head.next, self.tail.prev = self.tail, self.head

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.val
        return -1`,
    },
    {
      id: 'trapping-rain-water',
      title: '42. Trapping Rain Water',
      difficulty: 'Hard',
      color: '#ff375f',
      lang: 'C / Python',
      runtime: '98.1% faster',
      memory: '91.4% better',
      complexity: 'O(N) Time, O(1) Space with Two Pointers',
      codeSnippet: `int trap(int* height, int heightSize) {
    if (heightSize <= 2) return 0;
    int left = 0, right = heightSize - 1;
    int leftMax = 0, rightMax = 0, total = 0;
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= leftMax) leftMax = height[left];
            else total += leftMax - height[left];
            left++;
        } else {
            if (height[right] >= rightMax) rightMax = height[right];
            else total += rightMax - height[right];
            right--;
        }
    }
    return total;
}`,
    },
  ];

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
          Key Solutions
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
                    <small>KL University · CSE</small>
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
                        <span className="lc-count-ratio">{b.count} <small>/ {b.total}</small></span>
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
                Consistent daily practice focused on asymptotic space/time complexity optimization, recursive backtracking, dynamic programming state transitions, and memory allocation in C.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="lc-topics-container">
            <h3 className="lc-section-title">Problem Solving Distribution</h3>
            <div className="lc-topics-grid">
              {topicTags.map((t) => (
                <div key={t.name} className="lc-topic-card">
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
            {featuredSolutions.map((sol) => (
              <div key={sol.id} className="lc-solution-card">
                <div className="lc-sol-header">
                  <div>
                    <span className="lc-sol-diff" style={{ color: sol.color, borderColor: sol.color }}>
                      {sol.difficulty}
                    </span>
                    <h4 className="lc-sol-title">{sol.title}</h4>
                  </div>
                  <span className="lc-lang-pill">{sol.lang}</span>
                </div>

                <div className="lc-sol-badges">
                  <span className="perf-badge">🚀 {sol.runtime}</span>
                  <span className="perf-badge">💾 {sol.memory}</span>
                </div>

                <p className="lc-sol-complexity">{sol.complexity}</p>

                <div className="lc-code-viewer">
                  <pre>
                    <code>{sol.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
