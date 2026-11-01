import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Share2,
  CheckCircle2,
  Laptop,
  Smartphone,
  Sparkles,
  Download,
  Mail,
  UserCheck,
} from 'lucide-react';
import { sound } from '../services/sound';
import { profile } from '../data/profile';

interface NameDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (route: string) => void;
}

interface NearbyDevice {
  id: string;
  name: string;
  type: 'mac' | 'iphone';
  role: string;
}

const NEARBY_DEVICES: NearbyDevice[] = [
  { id: 'dev-1', name: 'Google Staff Recruiter', type: 'mac', role: 'Campus Engineering' },
  { id: 'dev-2', name: 'Apple Park Talent Scout', type: 'iphone', role: 'Core OS Systems' },
  { id: 'dev-3', name: 'Microsoft Lead Architect', type: 'mac', role: 'Cloud & AI Platform' },
];

export function NameDropModal({ isOpen, onClose }: NameDropModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [transferDone, setTransferDone] = useState(false);

  const handleSendAirDrop = (device: NearbyDevice) => {
    setSelectedDevice(device.id);
    sound.playTapSound();

    setTimeout(() => {
      sound.playApplePayChime();
      setTransferDone(true);

      // Trigger vCard download
      const vcardData = `BEGIN:VCARD
VERSION:3.0
N:Jammula;Uday;Kiran;;
FN:Uday Kiran Jammula
ORG:KL University
TITLE:Full-Stack Software Engineer
EMAIL;TYPE=INTERNET:${profile.email}
URL:${profile.github}
NOTE:184+ LeetCode Solutions, React, TypeScript, Three.js, Python
END:VCARD`;
      const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Uday_Kiran_Jammula_Contact.vcf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="namedrop-overlay"
          className="namedrop-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Top Liquid Ethereal Light Waves */}
          <div className="namedrop-liquid-wave wave-1" />
          <div className="namedrop-liquid-wave wave-2" />

          <motion.div
            className="namedrop-card"
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="namedrop-header">
              <div className="namedrop-brand">
                <Sparkles size={16} className="text-cyan-400" />
                <span>Apple AirDrop &middot; NameDrop</span>
              </div>
              <button
                type="button"
                className="namedrop-close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Profile Avatar Card */}
            <div className="namedrop-profile-row">
              <div className="namedrop-avatar-disc">UK</div>
              <div className="namedrop-info">
                <h3>{profile.name}</h3>
                <p>B.Tech CSE &middot; KL University</p>
                <span className="namedrop-status-tag">Ready to Share Contact &amp; Resume</span>
              </div>
            </div>

            {/* Radar / Nearby Recruiter Devices List */}
            <div className="namedrop-devices-list">
              <span className="devices-subhead">Nearby Recruiter Devices</span>

              {NEARBY_DEVICES.map((device) => {
                const isSelected = selectedDevice === device.id;

                return (
                  <div
                    key={device.id}
                    className={`namedrop-device-cell ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSendAirDrop(device)}
                  >
                    <div className="device-icon-box">
                      {device.type === 'mac' ? <Laptop size={18} /> : <Smartphone size={18} />}
                    </div>

                    <div className="device-meta">
                      <strong>{device.name}</strong>
                      <small>{device.role}</small>
                    </div>

                    <button
                      type="button"
                      className="airdrop-send-btn"
                    >
                      {isSelected && transferDone ? (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      ) : (
                        <span>Send</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Transfer Done Banner */}
            {transferDone && (
              <div className="namedrop-success-banner">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <div>
                  <strong>AirDrop Sent Successfully!</strong>
                  <p>Downloaded verified vCard contact card (.vcf) to device.</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
