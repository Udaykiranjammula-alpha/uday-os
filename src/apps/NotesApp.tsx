import React, { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Calendar, BookOpen, Sparkles, ChevronLeft } from 'lucide-react';
import type { NoteEntry } from '../types';
import { initialNotes } from '../data/notes';

const USER_NOTES_KEY = 'uday-os-user-notes';

interface NotesAppProps {
  onBack?: () => void;
}

export function NotesApp({ onBack }: NotesAppProps) {
  const [activeTab, setActiveTab] = useState<'dev' | 'scratchpad'>('dev');
  const [selectedNote, setSelectedNote] = useState<NoteEntry | null>(initialNotes[0]);
  const [userNotes, setUserNotes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(USER_NOTES_KEY);
      return saved ? (JSON.parse(saved) as string[]) : ['Loved the interactive in-phone architecture!'];
    } catch {
      return ['Loved the interactive in-phone architecture!'];
    }
  });
  const [newNoteText, setNewNoteText] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(USER_NOTES_KEY, JSON.stringify(userNotes));
    } catch {
      // Ignore
    }
  }, [userNotes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setUserNotes([newNoteText.trim(), ...userNotes]);
    setNewNoteText('');
  };

  const handleDeleteUserNote = (index: number) => {
    setUserNotes(userNotes.filter((_, i) => i !== index));
  };

  return (
    <div className="phone-screen-content notes-layout">
      {/* iOS App Navigation Header */}
      <header className="ios-page-header">
        <button
          type="button"
          className="ios-back-chevron"
          onClick={onBack}
          aria-label="Back to Home Screen"
        >
          <ChevronLeft size={20} />
          <span>Home</span>
        </button>
        <span className="ios-page-title">Notes</span>
        <div style={{ width: 48 }} />
      </header>
      {/* Tab Switcher */}
      <div className="notes-tab-bar" role="tablist">
        <button
          type="button"
          className={`notes-tab ${activeTab === 'dev' ? 'active' : ''}`}
          onClick={() => setActiveTab('dev')}
          role="tab"
          aria-selected={activeTab === 'dev'}
        >
          <BookOpen size={14} />
          <span>Dev Log ({initialNotes.length})</span>
        </button>

        <button
          type="button"
          className={`notes-tab ${activeTab === 'scratchpad' ? 'active' : ''}`}
          onClick={() => setActiveTab('scratchpad')}
          role="tab"
          aria-selected={activeTab === 'scratchpad'}
        >
          <StickyNote size={14} />
          <span>Visitor Scratchpad ({userNotes.length})</span>
        </button>
      </div>

      {activeTab === 'dev' ? (
        <div className="dev-notes-container">
          {/* Note List / Selector */}
          <div className="dev-notes-strip">
            {initialNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;
              return (
                <button
                  type="button"
                  key={note.id}
                  className={`dev-note-pill ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedNote(note)}
                >
                  <span className="pill-category">{note.category}</span>
                  <strong className="pill-title">{note.title}</strong>
                </button>
              );
            })}
          </div>

          {/* Active Note Reader */}
          {selectedNote && (
            <article className="active-note-reader">
              <div className="reader-header">
                <span className="reader-category">{selectedNote.category}</span>
                <h3 className="reader-title">{selectedNote.title}</h3>
                <div className="reader-date-row">
                  <Calendar size={12} />
                  <span>{selectedNote.date}</span>
                </div>
              </div>

              <div className="reader-content-body">
                {selectedNote.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </article>
          )}
        </div>
      ) : (
        <div className="scratchpad-container">
          <div className="scratchpad-header">
            <span className="eyebrow-accent">LOCAL PERSISTENCE</span>
            <h3>Leave a Quick Note</h3>
            <p className="muted-text">
              Type thoughts or feedback. Notes are stored in your browser&apos;s localStorage.
            </p>
          </div>

          {/* New Note Form */}
          <form onSubmit={handleAddNote} className="new-note-form">
            <input
              type="text"
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="e.g. Impressive project architecture..."
              className="note-input"
              aria-label="New note text"
            />
            <button type="submit" className="add-note-btn" aria-label="Save note">
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          {/* User Notes List */}
          <div className="user-notes-list">
            {userNotes.map((text, idx) => (
              <div key={idx} className="user-note-card">
                <div className="note-pin-row">
                  <Sparkles size={12} className="text-cyan" />
                  <span>Visitor Note #{userNotes.length - idx}</span>
                  <button
                    type="button"
                    className="delete-note-btn"
                    onClick={() => handleDeleteUserNote(idx)}
                    aria-label="Delete note"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <p className="note-text-body">{text}</p>
              </div>
            ))}

            {userNotes.length === 0 && (
              <p className="empty-scratchpad-text">No notes yet. Add one above!</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
