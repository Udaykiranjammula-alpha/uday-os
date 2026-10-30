// Hardware Camera Torch Controller for mobile devices
let activeStream: MediaStream | null = null;

export async function toggleHardwareTorch(enable: boolean): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }

  try {
    if (enable) {
      if (!activeStream) {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
      }
      const track = activeStream.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as { torch?: boolean };
        if (capabilities && capabilities.torch) {
          await (track as any).applyConstraints({
            advanced: [{ torch: true }],
          });
          return true;
        }
      }
    } else {
      if (activeStream) {
        const track = activeStream.getVideoTracks()[0];
        if (track) {
          try {
            await (track as any).applyConstraints({
              advanced: [{ torch: false }],
            });
          } catch {
            // Ignore
          }
          track.stop();
        }
        activeStream.getTracks().forEach((t) => t.stop());
        activeStream = null;
      }
    }
  } catch {
    if (activeStream) {
      activeStream.getTracks().forEach((t) => t.stop());
      activeStream = null;
    }
    return false;
  }
  return false;
}
