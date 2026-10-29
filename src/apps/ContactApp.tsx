import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Send,
  Linkedin,
  Github,
  Instagram,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { profile } from '../data/profile';

export function ContactApp() {
  const [copied, setCopied] = useState(false);
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !message) return;

    // Build prefilled mailto URI to launch user's real email client safely
    const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
    const body = encodeURIComponent(
      `Hi Uday,\n\n${message}\n\nFrom: ${senderName} (${senderEmail || 'No reply email supplied'})`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="phone-screen-content contact-layout">
      {/* Intro Header */}
      <div className="section-intro-block">
        <span className="eyebrow-accent">DIRECT INBOX</span>
        <h2>Let&apos;s Connect</h2>
        <p className="muted-text">
          Have an engineering opportunity, hardware inquiry, or open-source idea? Drop a note.
        </p>
      </div>

      {/* Primary Email Card */}
      <section className="contact-primary-card">
        <div className="contact-icon-bubble">
          <Mail size={22} className="text-cyan" />
        </div>
        <div className="contact-card-info">
          <span className="profile-eyebrow">PRIMARY CHANNEL</span>
          <strong className="contact-email-text">{profile.email}</strong>
          <small className="muted-text">Direct developer inbox</small>
        </div>
        <button
          type="button"
          className="copy-email-btn"
          onClick={handleCopyEmail}
          aria-label="Copy email address to clipboard"
        >
          {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </section>

      {/* Interactive In-Phone Message Composer */}
      <section className="detail-card">
        <div className="card-header-icon text-cyan">
          <Send size={15} />
          <strong>Compose Message</strong>
        </div>

        {submitted ? (
          <div className="composer-success-box">
            <Sparkles size={24} className="text-cyan" />
            <h4>Message Dispatch Triggered!</h4>
            <p>Your native email client has been opened with your pre-filled inquiry.</p>
            <button
              type="button"
              className="phone-secondary-action reset-compose-btn"
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
            >
              Compose Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleComposeSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email">Your Email (optional)</label>
              <input
                id="contact-email"
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="alex@company.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-msg">Message</label>
              <textarea
                id="contact-msg"
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi Uday, I would love to talk about your ESP32 or web projects..."
                className="form-textarea"
              />
            </div>

            <button type="submit" className="phone-primary-action submit-action">
              <Send size={15} />
              <span>Send via Email Client</span>
            </button>
          </form>
        )}
      </section>

      {/* External Verified Profiles */}
      <section className="detail-card">
        <div className="card-header-icon text-violet">
          <Sparkles size={15} />
          <strong>Digital Profiles</strong>
        </div>
        <div className="social-links-vertical">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="social-profile-link"
          >
            <div className="link-left">
              <Github size={16} />
              <span>GitHub / Udaykiranjammula-alpha</span>
            </div>
            <ExternalLink size={13} />
          </a>

          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-profile-link"
          >
            <div className="link-left">
              <Linkedin size={16} className="text-cyan" />
              <span>LinkedIn / udaykiranjammula</span>
            </div>
            <ExternalLink size={13} />
          </a>

          <a
            href={profile.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="social-profile-link"
          >
            <div className="link-left">
              <Instagram size={16} className="text-pink" />
              <span>Instagram / @udaykiran.jammula</span>
            </div>
            <ExternalLink size={13} />
          </a>
        </div>
      </section>
    </div>
  );
}
