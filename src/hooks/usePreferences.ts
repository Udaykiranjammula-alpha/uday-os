import { useEffect, useState } from 'react';
import type { ThemeMode, WallpaperStyle } from '../types';

export function usePreferences() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('uday-os-theme') as ThemeMode) || 'dark';
  });

  const [wallpaper, setWallpaper] = useState<WallpaperStyle>(() => {
    return (localStorage.getItem('uday-os-wallpaper') as WallpaperStyle) || 'graphite';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('uday-os-motion') === 'true';
  });

  const [brightness, setBrightness] = useState<number>(() => {
    const saved = localStorage.getItem('uday-os-brightness');
    return saved ? parseInt(saved, 10) : 100;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('uday-os-sound') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('uday-os-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('uday-os-wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('uday-os-motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    localStorage.setItem('uday-os-brightness', String(brightness));
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('uday-os-sound', String(soundEnabled));
  }, [soundEnabled]);

  const resetAllPreferences = () => {
    localStorage.removeItem('uday-os-theme');
    localStorage.removeItem('uday-os-wallpaper');
    localStorage.removeItem('uday-os-motion');
    localStorage.removeItem('uday-os-brightness');
    localStorage.removeItem('uday-os-sound');
    localStorage.removeItem('uday-os-github-cache-v2');
    localStorage.removeItem('uday-os-github-cache-time');
    sessionStorage.removeItem('uday-os-visited');
    setTheme('dark');
    setWallpaper('graphite');
    setReducedMotion(false);
    setBrightness(100);
    setSoundEnabled(false);
  };

  return {
    theme,
    setTheme,
    wallpaper,
    setWallpaper,
    reducedMotion,
    setReducedMotion,
    brightness,
    setBrightness,
    soundEnabled,
    setSoundEnabled,
    resetAllPreferences,
  };
}
