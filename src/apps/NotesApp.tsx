import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  Search,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  BookOpen,
  Edit3,
  Check,
  X,
  FileText,
  Tag,
} from 'lucide-react';
import type { NoteEntry } from '../types';
import { initialNotes } from '../data/notes';
import { sound } from '../services/sound';

const STORAGE_KEY = 'uday-os-notes-v3';

const CATEGORIES = [
  'All',
  'Architecture',
  'Algorithms',
  'KL University',
  'Visitor Notes',
];

interface NotesAppProps {
  onBack?: () => void;
  onNavigate?: (route: string) => void;
}

export function NotesApp({ onBack }: NotesAppProps) {
  // Load notes from localStorage or fallback to initialNotes
  const [notes, setNotes] = useState<NoteEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return initialNotes;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Draft state for note editing
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCategory, setDraftCategory] = useState('Architecture');
  const [draftBody, setDraftBody] = useState('');

  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // Ignore
    }
  }, [notes]);

  // Active note lookup
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // Real-time filtered notes
  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return notes.filter((note) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' ||
        note.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchesCategory) return false;

      if (!q) return true;

      // Text query search across title, content, category, and excerpt
      const inTitle = note.title.toLowerCase().includes(q);
      const inCategory = note.category.toLowerCase().includes(q);
      const inExcerpt = note.excerpt.toLowerCase().includes(q);
      const inContent = note.content.some((paragraph) =>
        paragraph.toLowerCase().includes(q)
      );

      return inTitle || inCategory || inExcerpt || inContent;
    });
  }, [notes, searchQuery, selectedCategory]);

  // Open note in reader / editor
  const handleOpenNote = (note: NoteEntry) => {
    sound.playTapSound();
    setActiveNoteId(note.id);
    setDraftTitle(note.title);
    setDraftCategory(note.category);
    setDraftBody(note.content.join('\n\n'));
    setIsEditing(false);
  };

  // Create brand new note
  const handleCreateNewNote = () => {
    sound.playTapSound();
    const newId = `note-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const newNote: NoteEntry = {
      id: newId,
      title: 'New Note',
      category: selectedCategory === 'All' ? 'Architecture' : selectedCategory,
      date: dateStr,
      excerpt: 'Empty note...',
      content: [''],
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newId);
    setDraftTitle(newNote.title);
    setDraftCategory(newNote.category);
    setDraftBody('');
    setIsEditing(true);

    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 50);
  };

  // Save changes
  const handleSaveDraft = () => {
    sound.playTapSound();
    if (!activeNoteId) return;

    const trimmedTitle = draftTitle.trim() || 'Untitled Note';
    const paragraphs = draftBody
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const firstParagraph = paragraphs[0] || 'No additional text.';
    const excerpt =
      firstParagraph.length > 90
        ? firstParagraph.slice(0, 90) + '...'
        : firstParagraph;

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === activeNoteId
          ? {
              ...note,
              title: trimmedTitle,
              category: draftCategory,
              excerpt,
              content: paragraphs.length > 0 ? paragraphs : [''],
            }
          : note
      )
    );
    setIsEditing(false);
  };

  // Delete note
  const handleDeleteNote = (idToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTapSound();

    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== idToDelete));
    if (activeNoteId === idToDelete) {
      setActiveNoteId(null);
      setIsEditing(false);
    }
  };

  // Back to note list
  const handleBackToList = () => {
    sound.playTapSound();
    if (isEditing) {
      handleSaveDraft();
    }
    setActiveNoteId(null);
    setIsEditing(false);
  };

  return (
    <div className="phone-screen-content notes-master-page">
      {/* ================= VIEW 1: NOTE LIST & SEARCH ================= */}
      {!activeNoteId ? (
        <div className="notes-list-view">
          {/* iOS Top Bar */}
          <header className="notes-top-bar">
            <button
              type="button"
              className="notes-back-pill"
              onClick={() => {
                sound.playTapSound();
                onBack?.();
              }}
              aria-label="Back to Home Screen"
            >
              <ChevronLeft size={18} />
              <span>Home</span>
            </button>

            <span className="notes-header-title">Notes</span>

            <button
              type="button"
              className="notes-compose-btn"
              onClick={handleCreateNewNote}
              title="Compose New Note"
              aria-label="Create New Note"
            >
              <Edit3 size={17} />
            </button>
          </header>

          {/* iOS Style Real-Time Search Bar */}
          <div className="notes-search-container">
            <div className="notes-search-box">
              <Search size={14} className="notes-search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all notes..."
                className="notes-search-input"
                aria-label="Search notes"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="notes-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear Search"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="notes-category-bar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`notes-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  sound.playTapSound();
                  setSelectedCategory(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Notes Count & Kicker */}
          <div className="notes-list-kicker">
            <span>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
            </span>
          </div>

          {/* Notes Scrollable List */}
          <div className="notes-items-scroll">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="note-row-card"
                onClick={() => handleOpenNote(note)}
                role="button"
                tabIndex={0}
              >
                <div className="note-card-main">
                  <div className="note-card-header">
                    <strong className="note-card-title">{note.title}</strong>
                    <span className="note-card-badge">{note.category}</span>
                  </div>

                  <div className="note-card-sub">
                    <span className="note-card-date">{note.date}</span>
                    <span className="note-card-excerpt">{note.excerpt}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="note-card-del-btn"
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  title="Delete Note"
                  aria-label="Delete Note"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            {filteredNotes.length === 0 && (
              <div className="notes-empty-state">
                <FileText size={32} className="notes-empty-icon" />
                <strong>No Notes Found</strong>
                <p>
                  {searchQuery
                    ? `No notes match "${searchQuery}".`
                    : 'Tap the compose icon in the top right to write a new note.'}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    className="notes-clear-filter-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= VIEW 2: NOTE DETAIL / EDITOR ================= */
        <div className="notes-detail-view">
          {/* Detail Header */}
          <header className="notes-top-bar">
            <button
              type="button"
              className="notes-back-pill"
              onClick={handleBackToList}
              aria-label="Back to Notes List"
            >
              <ChevronLeft size={18} />
              <span>Notes</span>
            </button>

            <div className="notes-editor-actions">
              <button
                type="button"
                className="note-action-icon-btn del"
                onClick={() => handleDeleteNote(activeNoteId)}
                title="Delete Note"
                aria-label="Delete Note"
              >
                <Trash2 size={16} />
              </button>

              {isEditing ? (
                <button
                  type="button"
                  className="note-done-btn"
                  onClick={handleSaveDraft}
                  aria-label="Done editing"
                >
                  Done
                </button>
              ) : (
                <button
                  type="button"
                  className="note-done-btn"
                  onClick={() => {
                    sound.playTapSound();
                    setIsEditing(true);
                  }}
                  aria-label="Edit note"
                >
                  Edit
                </button>
              )}
            </div>
          </header>

          {/* Note Editor Body */}
          <div className="notes-editor-scroll">
            {/* Category Selector */}
            <div className="notes-category-select-row">
              <Tag size={13} style={{ color: '#ff9500' }} />
              <select
                value={draftCategory}
                onChange={(e) => {
                  setDraftCategory(e.target.value);
                  setIsEditing(true);
                }}
                className="notes-category-dropdown"
              >
                <option value="Architecture">Architecture</option>
                <option value="Algorithms">Algorithms</option>
                <option value="KL University">KL University</option>
                <option value="Visitor Notes">Visitor Notes</option>
                <option value="Personal">Personal</option>
              </select>

              <span className="notes-detail-date">
                <Calendar size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
                {activeNote?.date || 'Today'}
              </span>
            </div>

            {/* Title Input */}
            <input
              ref={titleInputRef}
              type="text"
              value={draftTitle}
              onChange={(e) => {
                setDraftTitle(e.target.value);
                setIsEditing(true);
              }}
              placeholder="Note Title"
              className="notes-detail-title-input"
              aria-label="Note title"
            />

            {/* Note Content Textarea */}
            <textarea
              value={draftBody}
              onChange={(e) => {
                setDraftBody(e.target.value);
                setIsEditing(true);
              }}
              placeholder="Start typing your thoughts, algorithms, or project notes here..."
              className="notes-detail-body-textarea"
              aria-label="Note content body"
            />
          </div>
        </div>
      )}
    </div>
  );
}