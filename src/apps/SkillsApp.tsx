import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Terminal, Globe, Cpu, Database, Sparkles, Layers } from 'lucide-react';

interface SkillsAppProps {
  onBack?: () => void;
}

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  category: 'Python' | 'Web' | 'Systems' | 'AI' | 'Data';
  icon: React.ComponentType<any>;
  color: string;
}

const TOOLS_DATABASE: ToolItem[] = [
  // Python & Core
  { id: 'py', name: 'Python 3', desc: 'Core language, algorithms & scripting', category: 'Python', icon: Terminal, color: '#3b82f6' },
  { id: 'dsa', name: 'Data Structures', desc: 'Trees, graphs, dynamic programming', category: 'Python', icon: Layers, color: '#6366f1' },
  { id: 'oop', name: 'OOP Principles', desc: 'Design patterns & modular class architecture', category: 'Python', icon: Terminal, color: '#8b5cf6' },
  
  // Systems & Embedded
  { id: 'c', name: 'C Language', desc: 'Systems programming & pointer arithmetic', category: 'Systems', icon: Cpu, color: '#0ea5e9' },
  { id: 'esp32', name: 'ESP32 & Microcontrollers', desc: 'FreeRTOS, GPIO telemetry, SPI/I2C buses', category: 'Systems', icon: Cpu, color: '#f59e0b' },
  { id: 'iot', name: 'IoT Telemetry', desc: 'Real-time WebSocket & MQTT pipelines', category: 'Systems', icon: Cpu, color: '#10b981' },
  { id: 'embedded-ml', name: 'Edge ML / INT8', desc: 'Quantized neural inference on low-power chips', category: 'Systems', icon: Sparkles, color: '#ec4899' },
  
  // Web & Frontend
  { id: 'react', name: 'React 18 / 19', desc: 'Component architecture, hooks, concurrent mode', category: 'Web', icon: Globe, color: '#06b6d4' },
  { id: 'ts', name: 'TypeScript', desc: 'Strict typing, generics, robust contracts', category: 'Web', icon: Globe, color: '#3b82f6' },
  { id: 'tailwind', name: 'Tailwind CSS', desc: 'Utility-first modern interface styling', category: 'Web', icon: Globe, color: '#0ea5e9' },
  { id: 'vite', name: 'Vite & Tooling', desc: 'Lightning-fast ESM builds & HMR bundles', category: 'Web', icon: Globe, color: '#a855f7' },
  
  // AI & Reasoning
  { id: 'llm', name: 'LLM Orchestration', desc: 'Prompt architecture, agent workflows, tools', category: 'AI', icon: Sparkles, color: '#a855f7' },
  { id: 'rag', name: 'RAG Pipelines', desc: 'Semantic retrieval, chunking & embeddings', category: 'AI', icon: Sparkles, color: '#8b5cf6' },
  { id: 'agents', name: 'Multi-Agent Systems', desc: 'Autonomous planner and worker topologies', category: 'AI', icon: Sparkles, color: '#ec4899' },

  // Data & Backend
  { id: 'sql', name: 'SQL & Relational DBs', desc: 'Schema design, joins, query optimization', category: 'Data', icon: Database, color: '#f97316' },
  { id: 'node', name: 'Node.js & REST APIs', desc: 'Microservices, Express, server endpoints', category: 'Data', icon: Database, color: '#10b981' },
  { id: 'git', name: 'Git & GitHub Workflows', desc: 'Branching strategies, CI/CD actions, PRs', category: 'Data', icon: Terminal, color: '#f43f5e' },
];

export function SkillsApp({ onBack }: SkillsAppProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Python', 'Systems', 'Web', 'AI', 'Data'];

  const filteredTools = useMemo(() => {
    return TOOLS_DATABASE.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || tool.name.toLowerCase().includes(q) || tool.desc.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="personal-app toolkit-native-page">
      {/* Top Navigation */}
      <header className="personal-nav">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="toolkit-nav-right-label">Tools & technologies</span>
      </header>

      {/* Main Title Block */}
      <div className="personal-large-header">
        <h1 className="personal-large-title">Toolkit</h1>
        <p className="personal-sub-desc">
          {TOOLS_DATABASE.length} tools · Python, Systems, Web & AI
        </p>
      </div>

      {/* Search Bar */}
      <div className="toolkit-search-wrap">
        <Search size={14} className="toolkit-search-icon" />
        <input
          type="text"
          className="toolkit-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tools and technologies"
          aria-label="Search tools"
        />
      </div>

      {/* Category Pills Filter Strip */}
      <div className="toolkit-pills-strip" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`toolkit-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
            role="tab"
            aria-selected={selectedCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Group Count Header */}
      <div className="toolkit-group-header">
        <span className="group-title">{selectedCategory}</span>
        <span className="group-count">{filteredTools.length}</span>
      </div>

      {/* Grouped Tool Items */}
      <div className="personal-group toolkit-tools-group">
        {filteredTools.map((tool) => {
          const IconComp = tool.icon;
          return (
            <div key={tool.id} className="toolkit-tool-row">
              <div className="tool-icon-box" style={{ color: tool.color, background: `${tool.color}18` }}>
                <IconComp size={18} />
              </div>

              <div className="tool-text-info">
                <strong className="tool-title-name">{tool.name}</strong>
                <p className="tool-desc-text">{tool.desc}</p>
              </div>

              <ChevronRight size={15} className="tool-chevron-icon" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
