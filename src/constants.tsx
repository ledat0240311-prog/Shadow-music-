import { Home, Search, Library, Plus, Heart, Play, SkipBack, SkipForward, Repeat, Shuffle, Mic2, ListMusic, Volume2, MonitorSpeaker, Menu, X, Disc } from 'lucide-react';

export const MOCK_PLAYLISTS = [
  "Midnight Vibes",
  "Coding Focus",
  "Gym Phonk",
  "Late Night Jazz",
  "Cyberpunk City",
  "Lo-Fi Study",
  "Deep House 2026",
  "Shadows & Dust"
];

export const MOCK_ALBUMS = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "The Midnight",
    cover: "https://picsum.photos/seed/neon/300/300",
    color: "from-purple-900 to-blue-900"
  },
  {
    id: 2,
    title: "Digital Silence",
    artist: "Gnarls Barkley",
    cover: "https://picsum.photos/seed/digital/300/300",
    color: "from-red-900 to-black"
  },
  {
    id: 3,
    title: "After Hours",
    artist: "The Weeknd",
    cover: "https://picsum.photos/seed/hours/300/300",
    color: "from-green-900 to-black"
  },
  {
    id: 4,
    title: "Random Access Memories",
    artist: "Daft Punk",
    cover: "https://picsum.photos/seed/daft/300/300",
    color: "from-yellow-900 to-black"
  },
  {
    id: 5,
    title: "Currents",
    artist: "Tame Impala",
    cover: "https://picsum.photos/seed/tame/300/300",
    color: "from-pink-900 to-purple-900"
  }
];

export const MOCK_TRACKS = [
  {
    id: 1,
    title: "Shadows",
    artist: "The Midnight",
    album: "Neon Nights",
    duration: "3:45",
    cover: "https://picsum.photos/seed/neon/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    cover: "https://picsum.photos/seed/hours/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Instant Crush",
    artist: "Daft Punk",
    album: "Random Access Memories",
    duration: "5:37",
    cover: "https://picsum.photos/seed/daft/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: 4,
    title: "Let It Happen",
    artist: "Tame Impala",
    album: "Currents",
    duration: "7:48",
    cover: "https://picsum.photos/seed/tame/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: 5,
    title: "Crazy",
    artist: "Gnarls Barkley",
    album: "St. Elsewhere",
    duration: "2:58",
    cover: "https://picsum.photos/seed/digital/300/300",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  }
];
