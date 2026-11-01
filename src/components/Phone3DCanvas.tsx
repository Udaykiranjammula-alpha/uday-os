import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type PhoneFinish = 'cosmic-orange' | 'dark-cherry' | 'natural-titanium' | 'black-titanium';

export interface PhoneFinishConfig {
  label: string;
  swatch: string;
  appearance: 'dark' | 'light';
  wallpaper: string;
  aluminum: string;
  back: string;
  tint: string;
  antenna: string;
}

export const PHONE_FINISHES: Record<PhoneFinish, PhoneFinishConfig> = {
  'cosmic-orange': {
    label: 'Cosmic Orange',
    swatch: '#d76c2d',
    appearance: 'dark',
    wallpaper: 'orange',
    aluminum: '#d76c2d',
    back: '#dc7a3b',
    tint: '#bf622d',
    antenna: '#eab58b',
  },
  'dark-cherry': {
    label: 'Dark Cherry',
    swatch: '#3a1e27',
    appearance: 'dark',
    wallpaper: 'burgundy',
    aluminum: '#5e3341',
    back: '#3d2029',
    tint: '#2c1620',
    antenna: '#7d5766',
  },
  'natural-titanium': {
    label: 'Natural Titanium',
    swatch: '#9b9893',
    appearance: 'dark',
    wallpaper: 'natural',
    aluminum: '#8e8b85',
    back: '#9a9791',
    tint: '#797670',
    antenna: '#b0ada7',
  },
  'black-titanium': {
    label: 'Black Titanium',
    swatch: '#1c1c1e',
    appearance: 'dark',
    wallpaper: 'black',
    aluminum: '#222326',
    back: '#18191b',
    tint: '#111213',
    antenna: '#3a3b3e',
  },
};

// Physics and scaling constants accurately extracted from prsd.dev reference model
const V_SCALE = 4.04 / 0.0731025;
const W_SCALE = (4.04 * 163.4) / 78 / 0.15000003;
const F_SCALE = (4.04 / 0.0731025) * 0.06681;
const Y_SCALE = ((4.04 * 163.4) / 78 / 0.15000003) * 0.14429;
const NORMAL_EXCLUSIONS = new Set(['Anodized aluminum', 'Frosted glass', 'Plastic antena']);

function createTorchTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.15, 'rgba(255, 250, 210, 0.95)');
    grad.addColorStop(0.38, 'rgba(255, 220, 130, 0.45)');
    grad.addColorStop(0.7, 'rgba(255, 190, 70, 0.12)');
    grad.addColorStop(1, 'rgba(255, 170, 40, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function roundToPi(angle: number): number {
  return Math.round(angle / Math.PI) * Math.PI - 0.045;
}

function springStep(pos: number, vel: number, target: number, dt: number) {
  const diff = pos - target;
  const accel = -240 * diff - 28 * vel;
  const newVel = vel + accel * dt;
  const newPos = pos + newVel * dt;
  return { position: newPos, velocity: newVel };
}

interface Phone3DCanvasProps {
  finish: PhoneFinish;
  isFlipped: boolean;
  onFlipChange?: (flipped: boolean) => void;
  flashlightOn?: boolean;
  children: React.ReactNode;
}

export function Phone3DCanvas({
  finish,
  isFlipped,
  onFlipChange,
  flashlightOn = false,
  children,
}: Phone3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [surfaceEl, setSurfaceEl] = useState<HTMLDivElement | null>(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // References to mutable Three.js objects & callbacks
  const onFlipChangeRef = useRef(onFlipChange);
  onFlipChangeRef.current = onFlipChange;
  const finishRef = useRef(finish);
  finishRef.current = finish;
  const flashlightRef = useRef(Boolean(flashlightOn));
  flashlightRef.current = Boolean(flashlightOn);
  const updateFlashlightRef = useRef<((on: boolean) => void) | null>(null);

  const modelRef = useRef<THREE.Group | null>(null);
  const updateMaterialsRef = useRef<((f: PhoneFinish) => void) | null>(null);
  const flipTargetRef = useRef<number>(-0.045);
  const currentRotYRef = useRef<number>(-0.045);
  const currentRotXRef = useRef<number>(0);
  const velYRef = useRef<number>(0);
  const velXRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const ambientTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const justDraggedRef = useRef<boolean>(false);
  const needsCssRenderRef = useRef<boolean>(true);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);

  // Update target angle when isFlipped prop changes
  useEffect(() => {
    flipTargetRef.current = isFlipped ? Math.PI - 0.045 : -0.045;
    needsCssRenderRef.current = true;
  }, [isFlipped]);

  // Live real 3D flashlight sync
  useEffect(() => {
    flashlightRef.current = Boolean(flashlightOn);
    updateFlashlightRef.current?.(Boolean(flashlightOn));
    needsCssRenderRef.current = true;
  }, [flashlightOn]);

  // Update materials when finish changes (in-place without re-mounting)
  useEffect(() => {
    finishRef.current = finish;
    if (updateMaterialsRef.current) {
      updateMaterialsRef.current(finish);
      needsCssRenderRef.current = true;
    }
  }, [finish]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let webglRenderer: THREE.WebGLRenderer;
    let pmrem: THREE.PMREMGenerator;
    let envTexture: THREE.Texture;

    try {
      webglRenderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        preserveDrawingBuffer: true,
      });

      if (!webglRenderer.getContext()) {
        throw new Error('WebGL context is unavailable');
      }

      webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      webglRenderer.setClearColor(0x000000, 0);
      webglRenderer.outputColorSpace = THREE.SRGBColorSpace;
      webglRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      webglRenderer.toneMappingExposure = 1.0;
      webglRenderer.shadowMap.enabled = true;
      webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
      webglRenderer.domElement.className = 'phone-canvas';
      webglRenderer.domElement.setAttribute('aria-hidden', 'true');
      container.appendChild(webglRenderer.domElement);

      // WebGL Context Loss & Restoration Guard for Mobile Resilience
      webglRenderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('WebGL context lost, switching immediately to fallback CSS 3D chassis.');
        setFallbackMode(true);
      });

      // Setup PMREM Environment safely
      pmrem = new THREE.PMREMGenerator(webglRenderer);
      const room = new RoomEnvironment();
      envTexture = pmrem.fromScene(room, 0.04).texture;
      room.dispose();
      pmrem.dispose();
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to CSS 3D:', err);
      setFallbackMode(true);
      return;
    }

    // Setup Scenes & Groups
    const webglScene = new THREE.Scene();
    const cssScene = new THREE.Scene();
    webglScene.environment = envTexture;
    webglScene.environmentIntensity = 0.75;

    const modelGroup = new THREE.Group();
    const cssGroup = new THREE.Group();
    webglScene.add(modelGroup);
    cssScene.add(cssGroup);

    // Camera
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 19);

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x998877, 0.7);
    webglScene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(-3, 6, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0001;
    webglScene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe4eeff, 0.7);
    fillLight.position.set(5, 1, 3);
    webglScene.add(fillLight);

    const rimLightBack = new THREE.DirectionalLight(0xffffff, 1.4);
    rimLightBack.position.set(-2, 5, -7);
    webglScene.add(rimLightBack);

    // CSS 3D Renderer & Surface
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.domElement.className = 'phone-html';
    container.appendChild(cssRenderer.domElement);

    const phoneSurface = document.createElement('div');
    phoneSurface.className = 'phone-surface';
    const cssObject = new CSS3DObject(phoneSurface);
    cssObject.scale.set(F_SCALE / 372, Y_SCALE / 806, 0.01);
    cssObject.position.z = 0.004375 * V_SCALE + 0.006;
    cssGroup.add(cssObject);
    setSurfaceEl(phoneSurface);

    // Material Updater
    const applyMaterials = (fName: PhoneFinish, targetGroup: THREE.Group = modelGroup) => {
      const cfg = PHONE_FINISHES[fName];
      if (!cfg) return;
      targetGroup.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          for (const mat of mats) {
            if (mat instanceof THREE.MeshStandardMaterial) {
              if (mat.name === 'Anodized aluminum') {
                mat.color.set(cfg.aluminum);
                mat.roughness = 0.3;
                mat.metalness = 0.74;
              } else if (mat.name === 'Frosted glass') {
                mat.color.set(cfg.back);
                mat.roughness = 0.36;
              } else if (mat.name === 'Glass tint') {
                mat.color.set(cfg.tint);
                mat.roughness = 0.28;
              } else if (mat.name === 'Plastic antena') {
                mat.color.set(cfg.antenna);
              }
            }
          }
        }
      });
      needsCssRenderRef.current = true;
    };
    updateMaterialsRef.current = applyMaterials;

    // Load GLTF Model with MeshoptDecoder & automatic fallback
    let active = true;

    // Timeout safety: if 3D model takes > 2.8s on slow mobile, gracefully switch to fallback
    const loadTimeout = setTimeout(() => {
      if (active && !modelRef.current) {
        console.warn('3D model load timeout (2.8s), falling back to CSS 3D representation.');
        setFallbackMode(true);
      }
    }, 2800);

    let flareTexture: THREE.CanvasTexture | null = null;
    let flareMat: THREE.SpriteMaterial | null = null;
    let beamGeo: THREE.ConeGeometry | null = null;
    let beamMat: THREE.MeshBasicMaterial | null = null;

    const initAndLoad = async () => {
      try {
        if (MeshoptDecoder && (MeshoptDecoder as any).ready) {
          await (MeshoptDecoder as any).ready;
        }
        if (!active) return;
        const loader = new GLTFLoader();
        loader.setMeshoptDecoder(MeshoptDecoder);

        // Real 3D Flashlight Components anchored precisely on True Tone Flash LED
        const FLASH_POS = new THREE.Vector3(-1.2233, 3.4622, -0.345);
        const torchGroup = new THREE.Group();
        torchGroup.position.copy(FLASH_POS);
        modelGroup.add(torchGroup);

        const torchPointLight = new THREE.PointLight(0xfff6d0, 0, 24, 1.6);
        torchPointLight.position.set(0, 0, -0.05);

        const torchSpotLight = new THREE.SpotLight(0xfffae6, 0, 45, Math.PI / 4.2, 0.75, 1.5);
        torchSpotLight.position.set(0, 0, -0.04);
        const torchTarget = new THREE.Object3D();
        torchTarget.position.set(0, 0, -25); // Points outward into space behind phone!
        torchGroup.add(torchTarget);
        torchSpotLight.target = torchTarget;

        flareTexture = createTorchTexture();
        flareMat = new THREE.SpriteMaterial({
          map: flareTexture,
          color: 0xffffff,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const torchFlare = new THREE.Sprite(flareMat);
        torchFlare.position.set(0, 0, -0.02);
        torchFlare.scale.set(1.65, 1.65, 1.65);
        torchFlare.visible = false;

        const beamHeight = 16;
        const beamRadius = 3.2;
        beamGeo = new THREE.ConeGeometry(beamRadius, beamHeight, 32, 1, true);
        beamGeo.translate(0, -beamHeight / 2, 0); // Apex at (0, 0, 0)
        beamGeo.rotateX(Math.PI / 2); // Points straight out along -Z into space away from back glass!
        beamMat = new THREE.MeshBasicMaterial({
          color: 0xfff5cc,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const torchBeam = new THREE.Mesh(beamGeo, beamMat);
        torchBeam.position.set(0, 0, -0.03);

        torchGroup.add(torchPointLight);
        torchGroup.add(torchSpotLight);
        torchGroup.add(torchFlare);
        torchGroup.add(torchBeam);

        const tryLoad = (primaryUrl: string, secondaryUrl: string) => {
          loader.load(
            primaryUrl,
            (gltf: { scene: THREE.Group }) => {
              if (!active) return;
              clearTimeout(loadTimeout);
              const root = gltf.scene;
              root.rotation.y = Math.PI;
              root.scale.set(V_SCALE, W_SCALE, V_SCALE);

              root.traverse((child: THREE.Object3D) => {
                if (child instanceof THREE.Mesh) {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  const mats = Array.isArray(child.material) ? child.material : [child.material];
                  for (const mat of mats) {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      if (NORMAL_EXCLUSIONS.has(mat.name) && mat.normalMap) {
                        mat.normalMap = null;
                        mat.needsUpdate = true;
                      }
                    }
                  }
                }
              });

              applyMaterials(finishRef.current, root);
              modelGroup.add(root);
              modelRef.current = modelGroup;

              const applyFlashlight = (on: boolean) => {
                if (modelRef.current) {
                  modelRef.current.traverse((child: THREE.Object3D) => {
                    if (child instanceof THREE.Mesh) {
                      const mats = Array.isArray(child.material) ? child.material : [child.material];
                      for (const mat of mats) {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                          if (mat.name === 'LED' || mat.name === 'Plastic LED') {
                            mat.emissive.set(on ? 0xfff6d0 : 0x000000);
                            mat.emissiveIntensity = on ? 24.0 : 0.0;
                            mat.toneMapped = !on;
                            mat.needsUpdate = true;
                          }
                        }
                      }
                    }
                  });
                }

                torchPointLight.intensity = on ? 7.5 : 0;
                torchSpotLight.intensity = on ? 12.0 : 0;
                torchFlare.visible = on;
                if (beamMat) beamMat.opacity = on ? 0.16 : 0;
                needsCssRenderRef.current = true;
              };
              updateFlashlightRef.current = applyFlashlight;
              applyFlashlight(flashlightRef.current);

              setIsLoaded(true);
              needsCssRenderRef.current = true;
            },
            undefined,
            (err: unknown) => {
              if (!active) return;
              if (secondaryUrl) {
                console.warn(`Primary URL ${primaryUrl} failed, trying secondary ${secondaryUrl}`);
                tryLoad(secondaryUrl, '');
              } else {
                console.warn('Failed to load 3D GLTF model, falling back to CSS 3D:', err);
                clearTimeout(loadTimeout);
                setFallbackMode(true);
              }
            }
          );
        };

        tryLoad('/models/iphone-17-pro.glb', '/iphone-17-pro.glb');
      } catch (err) {
        console.warn('Meshopt init error, falling back to CSS 3D:', err);
        clearTimeout(loadTimeout);
        if (active) setFallbackMode(true);
      }
    };
    void initAndLoad();

    // Resize Handler
    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      camera.aspect = rect.width / rect.height;
      const dist = Math.max(12.2, 5.8 / camera.aspect);
      camera.position.z = dist / (2 * Math.tan(THREE.MathUtils.degToRad(16)));
      camera.position.y = 0;
      camera.position.x = 0;
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
      webglRenderer.setSize(rect.width, rect.height);
      cssRenderer.setSize(rect.width, rect.height);
      needsCssRenderRef.current = true;
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);
    handleResize();

    // Secondary timers to guarantee correct sizing once webfonts or DOM layout settles
    const t1 = setTimeout(handleResize, 60);
    const t2 = setTimeout(handleResize, 350);

    // Mouse / Touch Interaction Handlers
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      // If clicking form inputs, don't drag
      if (e.target instanceof Element && e.target.closest('input, textarea, select')) {
        return;
      }
      // If interacting inside the phone screen when facing front, allow native UI scrolling & touch
      const facingAngle = Math.cos(currentRotYRef.current) * Math.cos(currentRotXRef.current);
      const isFacingBack = facingAngle < -0.12;
      if (!isFacingBack && e.target instanceof Element && e.target.closest('.phone-surface')) {
        return;
      }
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        yaw: currentRotYRef.current,
        pitch: currentRotXRef.current,
        moved: false,
        pointerId: e.pointerId,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (!dragStartRef.current.moved && Math.hypot(dx, dy) > 7) {
        dragStartRef.current.moved = true;
        isDraggingRef.current = true;
        container.classList.add('phone-dragging');
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // Ignored
        }
      }
      if (dragStartRef.current.moved) {
        currentRotYRef.current = dragStartRef.current.yaw + dx * 0.015;
        currentRotXRef.current = Math.max(-0.35, Math.min(0.35, dragStartRef.current.pitch + dy * 0.008));
        velYRef.current = 0;
        velXRef.current = 0;
        needsCssRenderRef.current = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragStartRef.current) return;
      const moved = dragStartRef.current.moved;
      const ptrId = dragStartRef.current.pointerId;

      if (moved) {
        // Dragged: settle to nearest multiple of PI
        flipTargetRef.current = roundToPi(currentRotYRef.current);
        const settledFlipped = Math.cos(flipTargetRef.current) < 0;
        onFlipChangeRef.current?.(settledFlipped);
        needsCssRenderRef.current = true;
        justDraggedRef.current = true;
        setTimeout(() => {
          justDraggedRef.current = false;
        }, 60);
      } else {
        // Clicked without dragging: if facing back, flip to front!
        const facingAngle = Math.cos(currentRotYRef.current) * Math.cos(currentRotXRef.current);
        if (facingAngle < -0.2) {
          flipTargetRef.current = -0.045;
          onFlipChangeRef.current?.(false);
          needsCssRenderRef.current = true;
        }
      }

      try {
        container.releasePointerCapture(ptrId);
      } catch {
        // Ignored
      }
      container.classList.remove('phone-dragging');
      isDraggingRef.current = false;
      dragStartRef.current = null;
    };

    const onClickCapture = (e: MouseEvent) => {
      if (justDraggedRef.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Subtle 3D Gyroscope & Desktop Parallax
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (isDraggingRef.current || e.gamma === null || e.beta === null) return;
      ambientTiltRef.current.y = (Math.max(-30, Math.min(30, e.gamma)) / 30) * 0.12;
      ambientTiltRef.current.x = (Math.max(-20, Math.min(20, e.beta - 45)) / 20) * 0.08;
    };

    const handleWindowPointerHover = (e: PointerEvent) => {
      if (isDraggingRef.current || e.pointerType === 'touch') return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      ambientTiltRef.current.y = nx * 0.06;
      ambientTiltRef.current.x = -ny * 0.04;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointermove', handleWindowPointerHover, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('click', onClickCapture, true);

    // Animation Loop with separated WebGL & CSS rendering
    let animFrame: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrame = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      let isMoving = isDraggingRef.current;

      if (!isDraggingRef.current) {
        const targetY = flipTargetRef.current + ambientTiltRef.current.y;
        const targetX = ambientTiltRef.current.x;
        const diffY = Math.abs(currentRotYRef.current - targetY);
        const diffX = Math.abs(currentRotXRef.current - targetX);

        if (
          diffY < 0.001 &&
          Math.abs(velYRef.current) < 0.005 &&
          diffX < 0.001 &&
          Math.abs(velXRef.current) < 0.005
        ) {
          // Snapped to rest!
          currentRotYRef.current = targetY;
          velYRef.current = 0;
          currentRotXRef.current = targetX;
          velXRef.current = 0;
        } else {
          // Spring smoothly to target
          isMoving = true;
          const stepY = springStep(currentRotYRef.current, velYRef.current, targetY, dt);
          currentRotYRef.current = stepY.position;
          velYRef.current = stepY.velocity;

          const stepX = springStep(currentRotXRef.current, velXRef.current, targetX, dt);
          currentRotXRef.current = stepX.position;
          velXRef.current = stepX.velocity;
        }
      }

      modelGroup.rotation.y = currentRotYRef.current;
      modelGroup.rotation.x = currentRotXRef.current;

      // Always render WebGL so 3D phone chassis is NEVER blank or unrendered
      webglRenderer.render(webglScene, camera);

      // Only update CSS transforms when moving or flagged (eliminates 100% of cursor flickering on home screen)
      if (isMoving || needsCssRenderRef.current) {
        cssGroup.rotation.copy(modelGroup.rotation);

        const facingAngle = Math.cos(currentRotYRef.current) * Math.cos(currentRotXRef.current);
        const isFacingBack = facingAngle < -0.12;
        phoneSurface.style.pointerEvents = isFacingBack ? 'none' : 'auto';
        phoneSurface.style.opacity = facingAngle < -0.2 ? '0' : '1';
        phoneSurface.inert = isFacingBack;

        cssRenderer.render(cssScene, camera);
        if (!isMoving) {
          needsCssRenderRef.current = false;
        }
      }
    };

    animate(performance.now());

    return () => {
      active = false;
      clearTimeout(loadTimeout);
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointermove', handleWindowPointerHover);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('click', onClickCapture, true);
      flareTexture?.dispose();
      flareMat?.dispose();
      beamGeo?.dispose();
      beamMat?.dispose();
      webglRenderer.dispose();
      envTexture.dispose();
      webglRenderer.domElement.remove();
      cssRenderer.domElement.remove();
    };
  }, []); // Run ONCE on mount; finish and route changes do NOT re-initialize Three.js

  if (fallbackMode) {
    return (
      <div className={`phone-stage phone-fallback phone-ready ${finish} ${flashlightOn ? 'torch-active' : ''}`}>
        <div className="phone-fallback-shell">
          <div className="phone-surface">{children}</div>
          {flashlightOn && <div className="fallback-torch-beam" />}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`phone-stage ${isLoaded ? 'phone-ready' : 'phone-pending'}`}
      role="region"
      aria-label="3D Interactive iPhone. Drag to rotate 360 degrees or click swatches to change finish."
    >
      {surfaceEl && createPortal(children, surfaceEl)}
    </div>
  );
}
