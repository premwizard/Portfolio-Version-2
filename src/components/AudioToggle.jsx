import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AudioToggle = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    // Initialize Web Audio API context only after user interaction if possible, 
    // but we can create it suspended.
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtxRef.current = new AudioContext();
    }

    const playThunder = () => {
      if (isMuted || !audioCtxRef.current) return;
      
      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const bufferSize = audioCtx.sampleRate * 2.0; // 2 seconds
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate pink noise for thunder
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; 
        b6 = white * 0.115926;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;

      // Lowpass filter to muffle the noise into a rumble
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 1.5);

      const gainNode = audioCtx.createGain();
      // Lightning crack envelope: very fast attack, slow decay
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(1.0, audioCtx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.8);

      const masterGain = audioCtx.createGain();
      // Keep overall volume low (0.15 - 0.25) as requested
      masterGain.gain.value = 0.2;

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      noiseSource.start();
      
      // Cleanup
      noiseSource.onended = () => {
        noiseSource.disconnect();
        filter.disconnect();
        gainNode.disconnect();
        masterGain.disconnect();
      };
    };

    const handleStrike = () => {
      const now = performance.now();
      // Debounce: don't play if we just played one less than 500ms ago
      if (now - audioCtxRef.current.lastPlayTime > 500 || !audioCtxRef.current.lastPlayTime) {
        audioCtxRef.current.lastPlayTime = now;
        playThunder();
      }
    };

    window.addEventListener('lightning-strike-audio', handleStrike);

    return () => {
      window.removeEventListener('lightning-strike-audio', handleStrike);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => {
      const nextMuted = !prev;
      // If unmuting, try to resume the audio context to comply with autoplay policies
      if (!nextMuted && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return nextMuted;
    });
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[var(--surf)] border border-[var(--border)] shadow-lg hover:border-[var(--acc)] transition-colors duration-300 group"
      aria-label={isMuted ? "Unmute thunder sound" : "Mute thunder sound"}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-[var(--txm)] group-hover:text-[var(--acc)] transition-colors" />
      ) : (
        <Volume2 className="w-5 h-5 text-[var(--acc)] group-hover:text-[var(--acc2)] transition-colors" />
      )}
    </button>
  );
};

export default AudioToggle;
