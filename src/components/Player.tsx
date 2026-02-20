import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, Heart, ListMusic, Maximize2, Mic2, VolumeX, ChevronDown, ThumbsUp, ThumbsDown, MessageSquare, ListPlus, Cast, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlayerProps {
  currentTrack: any;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function Player({ currentTrack, isPlaying, onPlayPause, onNext, onPrev }: PlayerProps) {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError' && error.name !== 'NotAllowedError') {
              console.error("Playback failed:", error);
            }
          });
        }
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(dur);
      if (!isDragging) {
        setProgress((current / dur) * 100);
      }
    }
  };

  const handleEnded = () => {
    onNext();
  };

  const handleSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    
    // Initial click update
    const offsetX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    setProgress(percentage * 100);
    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const moveOffsetX = moveEvent.clientX - rect.left;
      const movePercentage = Math.max(0, Math.min(1, moveOffsetX / rect.width));
      setProgress(movePercentage * 100);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const upOffsetX = upEvent.clientX - rect.left;
      const upPercentage = Math.max(0, Math.min(1, upOffsetX / rect.width));
      
      if (audioRef.current && audioRef.current.duration) {
        audioRef.current.currentTime = upPercentage * audioRef.current.duration;
      }
      
      setIsDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, offsetX / rect.width));
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleTimeUpdate}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#0f0f0f] z-[60] flex flex-col overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-4 md:py-6">
              <button onClick={toggleExpand} className="p-2 text-white hover:bg-white/10 rounded-full">
                <ChevronDown size={28} />
              </button>
              
              <div className="flex bg-[#1f1f1f] rounded-full p-1">
                <button className="px-6 py-1.5 bg-[#333] rounded-full text-white text-sm font-medium">Song</button>
                <button className="px-6 py-1.5 text-zinc-400 text-sm font-medium hover:text-white">Video</button>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-white hover:text-zinc-300"><Cast size={24} /></button>
                <button className="text-white hover:text-zinc-300"><MoreVertical size={24} /></button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 overflow-y-auto">
              {/* Artwork */}
              <div className="w-full max-w-md aspect-square mb-8 md:mb-12 relative shadow-2xl rounded-md overflow-hidden">
                <img 
                  src={currentTrack.cover} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Track Info & Actions */}
              <div className="w-full max-w-md space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{currentTrack.title}</h2>
                  <p className="text-lg text-zinc-400">{currentTrack.artist}</p>
                </div>

                {/* Action Pills */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  <button className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-full text-white font-medium text-sm hover:bg-[#3a3a3a] transition-colors whitespace-nowrap">
                    <ThumbsUp size={18} />
                    <span>127K</span>
                  </button>
                  <button className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-full text-white font-medium text-sm hover:bg-[#3a3a3a] transition-colors">
                    <ThumbsDown size={18} />
                  </button>
                  <button className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-full text-white font-medium text-sm hover:bg-[#3a3a3a] transition-colors whitespace-nowrap">
                    <MessageSquare size={18} />
                    <span>2.2K</span>
                  </button>
                  <button className="flex items-center gap-2 bg-[#2a2a2a] px-4 py-2 rounded-full text-white font-medium text-sm hover:bg-[#3a3a3a] transition-colors whitespace-nowrap">
                    <ListPlus size={18} />
                    <span>Save</span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-4">
                  <div 
                    className="h-1 bg-zinc-600 rounded-full w-full relative group cursor-pointer touch-none py-2 bg-clip-content"
                    onPointerDown={handleSeek}
                  >
                    <div className="absolute top-2 left-0 right-0 h-1 bg-zinc-600 rounded-full"></div>
                    <div 
                      className="absolute top-2 left-0 h-1 bg-white rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md scale-100 transition-transform"
                      style={{ left: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-between pt-2">
                  <button className="text-zinc-400 hover:text-white transition-colors p-2">
                    <Shuffle size={28} />
                  </button>
                  <button onClick={onPrev} className="text-white hover:text-zinc-300 transition-colors p-2">
                    <SkipBack size={36} fill="currentColor" />
                  </button>
                  <button 
                    onClick={onPlayPause}
                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black shadow-lg"
                  >
                    {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                  </button>
                  <button onClick={onNext} className="text-white hover:text-zinc-300 transition-colors p-2">
                    <SkipForward size={36} fill="currentColor" />
                  </button>
                  <button className="text-zinc-400 hover:text-white transition-colors p-2">
                    <Repeat size={28} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Tabs */}
            <div className="flex justify-around items-center pb-[env(safe-area-inset-bottom)] pt-4 bg-[#0f0f0f] border-t border-white/5">
              <button className="text-white font-medium text-sm tracking-wide border-b-2 border-white pb-1">UP NEXT</button>
              <button className="text-zinc-500 font-medium text-sm tracking-wide pb-1">LYRICS</button>
              <button className="text-zinc-500 font-medium text-sm tracking-wide pb-1">RELATED</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Player */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        onClick={toggleExpand}
        className="fixed bottom-0 left-0 right-0 bg-[#212121] border-t border-white/5 px-4 z-50 flex flex-col pb-[env(safe-area-inset-bottom)] cursor-pointer md:hidden"
      >
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
              <img src={currentTrack.cover} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-white text-sm font-medium truncate">{currentTrack.title}</span>
              <span className="text-zinc-400 text-xs truncate">{currentTrack.artist}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 pl-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
              className="text-white p-2"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              className="text-white p-2"
            >
              <SkipForward size={24} fill="currentColor" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar (Bottom Edge) */}
        <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+0px)] left-0 right-0 h-[2px] bg-zinc-600">
          <div 
            className="h-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </motion.div>

      {/* Desktop Player (Original) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 px-4 z-50 hidden md:flex flex-col pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex items-center justify-between h-20">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-1/3 min-w-0">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-12 h-12 rounded-md object-cover shadow-lg flex-shrink-0"
            />
            <div className="overflow-hidden min-w-0">
              <h4 className="text-white font-medium truncate hover:underline cursor-pointer text-base">{currentTrack.title}</h4>
              <p className="text-zinc-400 text-xs hover:underline cursor-pointer truncate">{currentTrack.artist}</p>
            </div>
            <button className="text-zinc-400 hover:text-white ml-2 flex-shrink-0">
              <Heart size={18} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center max-w-[600px] w-1/3">
            <div className="flex items-center gap-6 mb-1">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Shuffle size={18} />
              </button>
              <button onClick={onPrev} className="text-zinc-200 hover:text-white transition-colors">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button 
                onClick={onPlayPause}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform text-black flex-shrink-0"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
              </button>
              <button onClick={onNext} className="text-zinc-200 hover:text-white transition-colors">
                <SkipForward size={20} fill="currentColor" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Repeat size={18} />
              </button>
            </div>
            
            <div className="w-full flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>{formatTime(currentTime)}</span>
              <div 
                className="h-1 bg-zinc-800 rounded-full flex-1 relative group cursor-pointer touch-none py-2 bg-clip-content"
                onPointerDown={handleSeek}
              >
                <div className="absolute top-2 left-0 right-0 h-1 bg-zinc-800 rounded-full"></div>
                <div 
                  className="absolute top-2 left-0 h-1 bg-white rounded-full group-hover:bg-green-500 transition-colors"
                  style={{ width: `${progress}%` }}
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Volume & Extras */}
          <div className="flex items-center justify-end gap-3 w-1/3 min-w-[180px]">
            <button className="text-zinc-400 hover:text-white">
              <Mic2 size={18} />
            </button>
            <button className="text-zinc-400 hover:text-white">
              <ListMusic size={18} />
            </button>
            <div className="flex items-center gap-2 group">
              <button onClick={() => setIsMuted(!isMuted)}>
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-zinc-400" />
                ) : (
                  <Volume2 size={18} className="text-zinc-400" />
                )}
              </button>
              <div 
                className="w-24 h-1 bg-zinc-800 rounded-full relative cursor-pointer"
                onClick={handleVolumeChange}
              >
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full group-hover:bg-green-500"
                  style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                />
              </div>
            </div>
            <button className="text-zinc-400 hover:text-white ml-2">
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

