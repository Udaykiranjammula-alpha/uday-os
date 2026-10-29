import React from 'react';

export function AppleLogoIcon({ size = 52, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 170 170"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.19-9.46-11.19-20.08-14.98-31.85-3.8-11.78-5.7-22.99-5.7-33.65 0-13.57 3.56-25.04 10.67-34.42 7.12-9.38 16.03-14.19 26.74-14.42 4.89 0 10.15 1.25 15.78 3.75 5.63 2.5 9.4 3.81 11.3 3.93 1.54-.12 5.56-1.55 12.06-4.28 6.5-2.73 12.09-3.95 16.77-3.67 12.59.83 22.84 5.57 30.73 14.23-10.99 6.64-16.37 15.73-16.14 27.27.24 9.17 3.76 16.94 10.57 23.32 6.81 6.38 14.94 10.05 24.4 11.01-2.17 6.42-4.73 12.87-7.69 19.34zM119.22 31.88c0-7.39 2.68-14.39 8.04-21 5.36-6.61 12.04-10.57 20.04-11.88.23 1.43.35 2.74.35 3.93 0 7.38-2.82 14.5-8.46 21.36-5.64 6.86-12.39 10.82-20.25 11.88-.36-1.43-.54-2.86-.54-4.29z" />
    </svg>
  );
}

export function SafariIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="#ffffff" />
      <circle cx="30" cy="30" r="23" fill="url(#safari-sky)" />
      {/* Compass Needle */}
      <polygon points="30,13 34,30 30,30" fill="#ef4444" />
      <polygon points="30,47 26,30 30,30" fill="#f8fafc" />
      <polygon points="30,13 26,30 30,30" fill="#dc2626" />
      <polygon points="30,47 34,30 30,30" fill="#cbd5e1" />
      <circle cx="30" cy="30" r="2.5" fill="#ffffff" />
      <defs>
        <linearGradient id="safari-sky" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NotesAppIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="#ffffff" />
      {/* Yellow top binder strip */}
      <path d="M0 14C0 6.26801 6.26801 0 14 0H46C53.732 0 60 6.26801 60 14V17H0V14Z" fill="#fbbf24" />
      {/* Notebook horizontal ruling lines */}
      <line x1="8" y1="26" x2="52" y2="26" stroke="#e2e8f0" strokeWidth="1.5" />
      <line x1="8" y1="35" x2="52" y2="35" stroke="#e2e8f0" strokeWidth="1.5" />
      <line x1="8" y1="44" x2="52" y2="44" stroke="#e2e8f0" strokeWidth="1.5" />
      <line x1="8" y1="52" x2="38" y2="52" stroke="#e2e8f0" strokeWidth="1.5" />
    </svg>
  );
}

export function AppStoreIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="url(#appstore-grad)" />
      {/* Stylized 'A' built with rods */}
      <line x1="18" y1="44" x2="38" y2="16" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="42" y1="44" x2="22" y2="16" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="14" y1="35" x2="46" y2="35" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <defs>
        <linearGradient id="appstore-grad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1e90ff" />
          <stop offset="1" stopColor="#0066cc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PhotosAppIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="#ffffff" />
      <g transform="translate(30, 30)">
        <ellipse cx="0" cy="-12" rx="4.5" ry="9" fill="#f59e0b" />
        <ellipse cx="8.5" cy="-8.5" rx="4.5" ry="9" transform="rotate(45)" fill="#ef4444" />
        <ellipse cx="12" cy="0" rx="4.5" ry="9" transform="rotate(90)" fill="#ec4899" />
        <ellipse cx="8.5" cy="8.5" rx="4.5" ry="9" transform="rotate(135)" fill="#8b5cf6" />
        <ellipse cx="0" cy="12" rx="4.5" ry="9" transform="rotate(180)" fill="#3b82f6" />
        <ellipse cx="-8.5" cy="8.5" rx="4.5" ry="9" transform="rotate(225)" fill="#06b6d4" />
        <ellipse cx="-12" cy="0" rx="4.5" ry="9" transform="rotate(270)" fill="#10b981" />
        <ellipse cx="-8.5" cy="-8.5" rx="4.5" ry="9" transform="rotate(315)" fill="#84cc16" />
      </g>
    </svg>
  );
}

export function MailAppIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="url(#mail-grad)" />
      <rect x="14" y="19" width="32" height="22" rx="3" fill="#ffffff" />
      <path d="M14 20L30 32L46 20" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="mail-grad" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FilesAppIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="#ffffff" />
      {/* Folder Tab & Body */}
      <path d="M13 22C13 19.7909 14.7909 18 17 18H24.5L28.5 22H43C45.2091 22 47 23.7909 47 26V39C47 41.2091 45.2091 43 43 43H17C14.7909 43 13 41.2091 13 39V22Z" fill="#38bdf8" />
      <path d="M13 25H47V39C47 41.2091 45.2091 43 43 43H17C14.7909 43 13 41.2091 13 39V25Z" fill="#0284c7" />
    </svg>
  );
}

export function XAppIcon({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="14" fill="#000000" />
      <path
        d="M18 16L27.5 29.5L17.5 44H20L28.5 31.5L35.5 44H43L33 29.5L42.5 16H40L32 27.5L25.5 16H18Z"
        fill="#ffffff"
      />
    </svg>
  );
}
