import React from 'react';
import { Home, Search, Library, Plus, Heart, Globe, Download } from 'lucide-react';
import { MOCK_PLAYLISTS } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentView: 'home' | 'search' | 'library' | 'downloads';
  onNavigate: (view: 'home' | 'search' | 'library') => void;
}

export function Sidebar({ isOpen, setIsOpen, currentView, onNavigate }: SidebarProps) {
  return (
    <aside 
      className={`
        fixed md:static top-0 left-0 z-40 h-full w-[280px] bg-black p-2 flex flex-col gap-2 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
    >
      {/* Navigation Card */}
      <div className="bg-[#121212] rounded-xl p-5 flex flex-col gap-5">
        <div className="flex items-center gap-2 px-2">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
          </div>
          <span className="font-bold text-white tracking-tight">Shadow Music</span>
        </div>
        
        <nav className="flex flex-col gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-4 font-medium px-2 transition-colors ${currentView === 'home' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          <button 
            onClick={() => onNavigate('search')}
            className={`flex items-center gap-4 font-medium px-2 transition-colors ${currentView === 'search' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Search size={24} />
            <span>Search</span>
          </button>
          <button 
            onClick={() => onNavigate('library')}
            className={`flex items-center gap-4 font-medium px-2 transition-colors ${currentView === 'library' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <Library size={24} />
            <span>Library</span>
          </button>
        </nav>
      </div>

      {/* Library Card */}
      <div className="bg-[#121212] rounded-xl flex-1 flex flex-col overflow-hidden">
        <div className="p-4 shadow-lg z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 rounded-full transition-colors">
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            <span className="bg-[#232323] text-white text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#2a2a2a] transition-colors">Playlists</span>
            <span className="bg-[#232323] text-white text-xs font-medium px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#2a2a2a] transition-colors">Artists</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          <div className="flex items-center justify-between px-2 py-2 text-zinc-400 hover:text-white cursor-pointer">
            <Search size={16} />
            <span className="text-xs">Recents</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1f1f1f] cursor-pointer group transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                <Heart size={20} fill="white" className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-medium">Liked Songs</h4>
                <p className="text-zinc-400 text-sm flex items-center gap-1">
                  <span className="text-green-500 text-[10px]">●</span> Playlist • 342 songs
                </p>
              </div>
            </div>

            {MOCK_PLAYLISTS.map((playlist, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1f1f1f] cursor-pointer group transition-colors">
                <img 
                  src={`https://picsum.photos/seed/${playlist}/100/100`} 
                  alt={playlist} 
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="overflow-hidden">
                  <h4 className="text-zinc-200 font-medium truncate group-hover:text-white">{playlist}</h4>
                  <p className="text-zinc-400 text-sm truncate">Playlist • User</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
