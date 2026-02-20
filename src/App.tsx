import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { MOCK_ALBUMS, MOCK_TRACKS } from './constants';
import { Bell, ChevronLeft, ChevronRight, Download, User, Play, Clock, MoreHorizontal, Heart, Search, X, Library, History, Grid, Plus, Pin, ChevronDown, List, ThumbsUp, MoreVertical, ListMusic, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(MOCK_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [greeting, setGreeting] = useState('Good evening');
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library' | 'downloads'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 50);
  };

  const playTrack = (track: any) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const filteredTracks = MOCK_TRACKS.filter(track => 
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = MOCK_ALBUMS.filter(album => 
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LIBRARY_ITEMS = [
    {
      id: 'liked',
      title: 'Liked Music',
      subtitle: 'Auto playlist',
      type: 'playlist',
      pinned: true,
      image: 'https://misc.scdn.co/liked-songs/liked-songs-300.png', // Placeholder for liked songs gradient
      color: 'bg-gradient-to-br from-purple-500 to-blue-500'
    },
    {
      id: 'episodes',
      title: 'Episodes for Later',
      subtitle: 'Your queued episodes',
      type: 'playlist',
      pinned: false,
      image: 'https://picsum.photos/seed/episodes/300/300',
      icon: 'podcast'
    }
  ];

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden font-sans selection:bg-green-500 selection:text-black">
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
      />
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main 
        className="flex-1 bg-gradient-to-b from-[#1f1f1f] to-[#121212] md:rounded-xl md:my-2 md:mr-2 overflow-y-auto relative scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
        onScroll={handleScroll}
      >
        {/* Header */}
        <header 
          className={`
            sticky top-0 z-20 px-6 py-4 flex items-center justify-between transition-all duration-300
            ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}
          `}
        >
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="md:hidden p-2 -ml-2 text-white"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            
            {currentView === 'library' || currentView === 'downloads' ? (
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setCurrentView(currentView === 'library' ? 'downloads' : 'library')}
              >
                <h1 className="text-2xl font-bold">{currentView === 'library' ? 'Library' : 'Downloads'}</h1>
                <ChevronDown size={20} className="text-zinc-400" />
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <button className="bg-black/40 rounded-full p-1 hover:bg-black/60 transition-colors disabled:opacity-50">
                  <ChevronLeft size={22} />
                </button>
                <button className="bg-black/40 rounded-full p-1 hover:bg-black/60 transition-colors disabled:opacity-50">
                  <ChevronRight size={22} />
                </button>
              </div>
            )}
            
            {currentView === 'search' && (
              <div className="relative flex-1 max-w-2xl mx-2 md:mx-4 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-zinc-400 group-focus-within:text-white" />
                </div>
                <input 
                  type="text" 
                  placeholder="What do you want to play?" 
                  className="w-full bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white rounded-full py-3 pl-10 pr-10 outline-none border border-transparent focus:border-white/10 transition-all placeholder:text-zinc-400 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-2">
            {currentView === 'library' ? (
              <>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <History size={22} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Search size={22} />
                </button>
                <button className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  <img src="https://picsum.photos/seed/user/100/100" alt="Profile" className="w-full h-full object-cover" />
                </button>
              </>
            ) : (
              <>
                {currentView !== 'search' && (
                  <button className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                    Explore Premium
                  </button>
                )}
                <button className="bg-black/40 p-2 rounded-full hover:bg-black/60 hover:scale-105 transition-all text-zinc-300 hover:text-white hidden sm:block">
                  <Bell size={18} />
                </button>
                <button className="bg-black/40 p-2 rounded-full hover:bg-black/60 hover:scale-105 transition-all text-zinc-300 hover:text-white hidden sm:block">
                  <Download size={18} />
                </button>
                <button className="bg-zinc-800 p-1 rounded-full hover:scale-105 transition-transform">
                  <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                    S
                  </div>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Content Body */}
        <div className="px-6 pb-32 pt-2">
          {currentView === 'library' ? (
            <div className="flex flex-col h-full">
              {/* Filter Chips */}
              <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
                {["Playlists", "Songs", "Albums", "Artists", "Profile"].map((filter) => (
                  <button 
                    key={filter}
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-white/5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Sort Controls */}
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center gap-1 text-sm font-medium hover:text-white text-zinc-200">
                  <span>Recent activity</span>
                  <ChevronDown size={16} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Grid size={20} />
                </button>
              </div>

              {/* Library List */}
              <div className="flex flex-col gap-2">
                {LIBRARY_ITEMS.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-white/5 cursor-pointer group">
                    <div className={`w-14 h-14 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 ${item.id === 'liked' ? item.color : 'bg-[#282828]'}`}>
                      {item.id === 'liked' ? (
                        <ThumbsUp size={24} fill="white" className="text-white" />
                      ) : item.id === 'episodes' ? (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/></svg>
                        </div>
                      ) : (
                        <img src={item.image} alt={item.title} className={`w-full h-full object-cover ${item.type === 'artist' ? 'rounded-full' : 'rounded-md'}`} />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className={`font-medium truncate text-base ${item.id === 'liked' ? 'text-white' : 'text-white'}`}>{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {item.pinned && <Pin size={12} fill="currentColor" className="text-green-500 rotate-45" />}
                        <span className="truncate">{item.subtitle}</span>
                      </div>
                    </div>
                    <button className="p-2 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Floating New Button */}
              <motion.button 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setShowNewMenu(true)}
                className="fixed bottom-24 right-6 bg-white text-black px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform z-20"
              >
                <Plus size={24} />
                <span>New</span>
              </motion.button>

              {/* New Menu Bottom Sheet */}
              <AnimatePresence>
                {showNewMenu && (
                  <>
                    <motion.div 
                      key="overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
                      onClick={() => setShowNewMenu(false)}
                    />
                    <motion.div
                      key="sheet"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="fixed bottom-0 left-0 right-0 bg-[#212121] rounded-t-2xl z-40 p-6 pb-[calc(env(safe-area-inset-bottom)+24px)]"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Create</h3>
                        <button 
                          onClick={() => setShowNewMenu(false)}
                          className="p-2 bg-white/10 rounded-full hover:bg-white/20"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="flex gap-4">
                        <button className="flex-1 bg-[#333] hover:bg-[#444] p-4 rounded-xl flex flex-col items-center gap-3 transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ListMusic size={24} className="text-white" />
                          </div>
                          <span className="font-bold">Playlist</span>
                        </button>
                        
                        <button className="flex-1 bg-[#333] hover:bg-[#444] p-4 rounded-xl flex flex-col items-center gap-3 transition-colors group">
                          <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shuffle size={24} className="text-white" />
                          </div>
                          <span className="font-bold">Mix</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : currentView === 'downloads' ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Download size={48} className="text-zinc-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No downloads yet</h2>
              <p className="text-zinc-400 max-w-xs mb-6">Songs and episodes you download will appear here.</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
              >
                Explore Music
              </button>
            </div>
          ) : currentView === 'home' ? (
            <>
              {/* Category Pills */}
              <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6">
                {["Energize", "Relax", "Workout", "Commute", "Focus"].map((category) => (
                  <button 
                    key={category}
                    className="bg-white/10 hover:bg-white/20 border border-white/5 px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold mb-6 tracking-tight"
              >
                {greeting}
              </motion.h1>

              {/* Quick Access Grid (Spotify Style) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {MOCK_ALBUMS.slice(0, 6).map((album, i) => (
                  <motion.div 
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#2a2a2a]/40 hover:bg-[#2a2a2a] transition-colors rounded-md flex items-center gap-3 overflow-hidden group cursor-pointer pr-2"
                    onClick={() => playTrack({ ...MOCK_TRACKS[i % MOCK_TRACKS.length], cover: album.cover })}
                  >
                    <img src={album.cover} alt={album.title} className="w-12 h-12 sm:w-16 sm:h-16 object-cover shadow-lg" />
                    <span className="font-bold truncate flex-1 text-sm sm:text-base">{album.title}</span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play fill="black" className="text-black ml-1" size={16} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Listen Again (YouTube Music Style Carousel) */}
              <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-white rounded-full"></div>
                    <h2 className="text-2xl font-bold">Listen Again</h2>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><ChevronLeft size={20} /></button>
                    <button className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white"><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6 snap-x">
                  {MOCK_TRACKS.map((track, i) => (
                    <div 
                      key={i} 
                      className="min-w-[140px] w-[140px] sm:min-w-[180px] sm:w-[180px] snap-start group cursor-pointer"
                      onClick={() => playTrack(track)}
                    >
                      <div className="relative mb-3">
                        <img src={track.cover} alt={track.title} className="w-full aspect-square object-cover rounded-md shadow-lg group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play fill="white" className="text-white ml-1" size={24} />
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold truncate text-sm sm:text-base">{track.title}</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm truncate">{track.artist}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Your Mixes (Horizontal Scroll) */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Your Mixes</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6 snap-x">
                  {MOCK_ALBUMS.map((album, i) => (
                    <div 
                      key={i} 
                      className="min-w-[160px] w-[160px] sm:min-w-[200px] sm:w-[200px] snap-start group cursor-pointer"
                      onClick={() => playTrack({ ...MOCK_TRACKS[i % MOCK_TRACKS.length], cover: album.cover })}
                    >
                      <div className="relative mb-3">
                        <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-md shadow-lg" />
                        <div className={`absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t ${album.color.replace('from-', 'from-').split(' ')[0]} to-transparent opacity-60 rounded-b-md`} />
                        <div className="absolute bottom-2 left-2">
                          <div className="w-1 h-4 bg-green-500 rounded-full mb-1"></div>
                          <span className="text-xs font-bold uppercase tracking-wider text-white/90">Mix</span>
                        </div>
                      </div>
                      <h3 className="font-bold truncate text-sm sm:text-base">{album.title}</h3>
                      <p className="text-zinc-400 text-xs sm:text-sm line-clamp-2">Daily mix of {album.artist} and more</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Picks (List Style in Grid) */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Start Radio from a song</p>
                    <h2 className="text-2xl font-bold">Quick Picks</h2>
                  </div>
                  <button className="text-sm font-bold border border-white/20 rounded-full px-3 py-1 hover:bg-white/10">Play all</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                  {MOCK_TRACKS.concat(MOCK_TRACKS).slice(0, 12).map((track, i) => (
                    <div 
                      key={i}
                      onClick={() => playTrack(track)}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-white/10 group transition-colors cursor-pointer"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img src={track.cover} alt={track.title} className="w-full h-full rounded object-cover" />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                          <Play size={20} fill="white" className="text-white" />
                        </div>
                      </div>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className={`font-medium truncate ${currentTrack.id === track.id ? 'text-green-500' : 'text-white'}`}>
                          {track.title}
                        </span>
                        <span className="text-xs text-zinc-400 truncate">{track.artist} • {track.album}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Heart size={16} className="text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        <MoreHorizontal size={16} className="text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommended Music Videos */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold mb-4">Recommended Music Videos</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none -mx-6 px-6 snap-x">
                  {MOCK_TRACKS.map((track, i) => (
                    <div 
                      key={i} 
                      className="min-w-[220px] w-[220px] md:min-w-[280px] md:w-[280px] snap-start group cursor-pointer"
                      onClick={() => playTrack(track)}
                    >
                      <div className="relative mb-3 aspect-video overflow-hidden rounded-lg">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play fill="white" className="text-white drop-shadow-lg" size={48} />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 rounded text-xs font-bold">
                          {track.duration}
                        </div>
                      </div>
                      <h3 className="font-bold truncate text-base mb-1">{track.title}</h3>
                      <p className="text-sm text-zinc-400 truncate">{track.artist} • 1.2M views</p>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-6">Browse All</h2>
              
              {searchQuery ? (
                <div className="space-y-8">
                  {filteredTracks.length > 0 && (
                    <section>
                      <h3 className="text-xl font-bold mb-4">Songs</h3>
                      <div className="flex flex-col">
                        {filteredTracks.map((track, i) => (
                          <div 
                            key={track.id}
                            onClick={() => playTrack(track)}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 rounded-md group transition-colors cursor-pointer"
                          >
                            <div className="relative">
                              <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded">
                                <Play size={20} fill="white" className="text-white" />
                              </div>
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className={`font-medium ${currentTrack.id === track.id ? 'text-green-500' : 'text-white'}`}>
                                {track.title}
                              </span>
                              <span className="text-sm text-zinc-400">{track.artist}</span>
                            </div>
                            <span className="text-sm text-zinc-400 font-mono">{track.duration}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredAlbums.length > 0 && (
                    <section>
                      <h3 className="text-xl font-bold mb-4">Albums</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredAlbums.map((album, i) => (
                          <div key={i} className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 group cursor-pointer">
                            <div className="relative mb-4">
                              <img src={album.cover} alt={album.title} className="w-full aspect-square object-cover rounded-md shadow-lg" />
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playTrack({ ...MOCK_TRACKS[i % MOCK_TRACKS.length], cover: album.cover });
                                }}
                                className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
                              >
                                <Play fill="black" className="text-black ml-1" size={24} />
                              </button>
                            </div>
                            <h3 className="font-bold truncate mb-1">{album.title}</h3>
                            <p className="text-sm text-zinc-400 line-clamp-2">By {album.artist} • 2026</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {filteredTracks.length === 0 && filteredAlbums.length === 0 && (
                    <div className="text-center py-20">
                      <h3 className="text-xl font-bold mb-2">No results found for "{searchQuery}"</h3>
                      <p className="text-zinc-400">Please make sure your words are spelled correctly or use less or different keywords.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {/* Browse Categories */}
                  {[
                    { title: "Podcasts", color: "bg-red-600" },
                    { title: "Live Events", color: "bg-purple-600" },
                    { title: "Made For You", color: "bg-blue-800" },
                    { title: "New Releases", color: "bg-pink-600" },
                    { title: "Pop", color: "bg-green-600" },
                    { title: "Hip-Hop", color: "bg-orange-600" },
                    { title: "Rock", color: "bg-red-800" },
                    { title: "Mood", color: "bg-purple-800" },
                    { title: "Educational", color: "bg-blue-600" },
                    { title: "Documentary", color: "bg-amber-700" },
                  ].map((category, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSearchQuery(category.title)}
                      className={`${category.color} aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                    >
                      <h3 className="text-xl font-bold">{category.title}</h3>
                      <div className="absolute -bottom-2 -right-4 w-24 h-24 bg-black/20 rotate-[25deg] rounded-lg shadow-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={() => {
          const currentIndex = MOCK_TRACKS.findIndex(t => t.id === currentTrack.id);
          const nextIndex = (currentIndex + 1) % MOCK_TRACKS.length;
          setCurrentTrack(MOCK_TRACKS[nextIndex]);
        }}
        onPrev={() => {
          const currentIndex = MOCK_TRACKS.findIndex(t => t.id === currentTrack.id);
          const prevIndex = (currentIndex - 1 + MOCK_TRACKS.length) % MOCK_TRACKS.length;
          setCurrentTrack(MOCK_TRACKS[prevIndex]);
        }}
      />
    </div>
  );
}

export default App;
