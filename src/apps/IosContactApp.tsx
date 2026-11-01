import React, { useState } from 'react';
import { ChevronLeft, ArrowUp, Instagram, Github, Linkedin, ExternalLink, Sparkles } from 'lucide-react';
import { profile } from '../data/profile';
import { sound } from '../services/sound';

interface IosContactAppProps {
  onBack: () => void;
  onOpenNameDrop?: () => void;
}

export function IosContactApp({ onBack, onOpenNameDrop }: IosContactAppProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = () => {
    const mailSubject = subject.trim() || 'Portfolio Inquiry';
    const mailBody = body.trim() || 'Hi Uday,\n\n';
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
    window.location.href = mailto;
  };

  return (
    <div className="mail-native-app">
      {/* Top Navigation Bar matching Apple Mail */}
      <header className="mail-native-nav">
        <button
          type="button"
          className="mail-nav-back-pill"
          onClick={onBack}
          aria-label="Back to Home"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="mail-nav-title">New Message</span>

        <button
          type="button"
          className="mail-send-circle-btn"
          onClick={handleSend}
          aria-label="Send Email"
          title="Send Email"
        >
          <ArrowUp size={18} strokeWidth={2.5} />
        </button>
      </header>

      {/* Main Mail Form Body */}
      <div className="mail-compose-scroll">
        <h1 className="mail-page-heading">New Message</h1>

        {/* To: Recipient Row */}
        <div className="mail-header-field">
          <span className="mail-field-label">To:</span>
          <div className="mail-recipient-chip">
            <span>{profile.name}</span>
          </div>
        </div>

        {/* Recipient Email Line */}
        <div className="mail-email-subline">
          <span>{profile.email}</span>
        </div>

        {/* Subject Row */}
        <div className="mail-header-field mail-subject-field">
          <span className="mail-field-label">Subject:</span>
          <input
            type="text"
            className="mail-subject-input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder=""
            aria-label="Email Subject"
          />
        </div>

        {/* Message Textarea */}
        <div className="mail-body-field">
          <textarea
            className="mail-body-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a note, project inquiry, or quick message..."
            aria-label="Email Body"
            rows={6}
          />
        </div>

        <p className="mail-footnote-text">
          Write a note, then tap send to continue in your email app.
        </p>

        {/* Apple iOS 18 NameDrop Beam Button */}
        {onOpenNameDrop && (
          <button
            type="button"
            onClick={() => {
              sound.playApplePayChime();
              onOpenNameDrop();
            }}
            style={{
              width: '100%',
              margin: '12px 0 16px',
              padding: '12px 14px',
              background: 'linear-gradient(135deg, #0284c7, #2563eb, #7c3aed)',
              color: '#ffffff',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <Sparkles size={15} color="#67e8f9" />
            <span> NameDrop Contact Beam (.vcf vCard)</span>
          </button>
        )}

        {/* Social Profiles Direct Links */}
        <div className="mail-socials-group">
          <a
            href={profile.instagram}
            target="_blank"
            rel="noreferrer"
            className="mail-social-row"
          >
            <div className="social-badge-icon bg-instagram">
              <Instagram size={15} />
            </div>
            <div className="social-info-text">
              <strong>Instagram</strong>
              <small>@udaykiran.jammula</small>
            </div>
            <ExternalLink size={13} className="social-arrow" />
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mail-social-row"
          >
            <div className="social-badge-icon bg-blue-deep">
              <Linkedin size={15} />
            </div>
            <div className="social-info-text">
              <strong>LinkedIn</strong>
              <small>udaykiranjammula</small>
            </div>
            <ExternalLink size={13} className="social-arrow" />
          </a>

          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="mail-social-row"
          >
            <div className="social-badge-icon bg-dark">
              <Github size={15} />
            </div>
            <div className="social-info-text">
              <strong>GitHub</strong>
              <small>Udaykiranjammula-alpha</small>
            </div>
            <ExternalLink size={13} className="social-arrow" />
          </a>
        </div>
      </div>
    </div>
  );
}
