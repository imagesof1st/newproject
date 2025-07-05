'use client'

import React, { useState, createContext, useContext } from 'react';
import { Home as HomeIcon, Search, Settings } from 'lucide-react';
import HomePage from '@/components/HomePage';
import SearchPage from '@/components/SearchPage';
import SettingsPage from '@/components/SettingsPage';
import PlaylistsPage from '@/components/PlaylistsPage';
import LikedSongsPage from '@/components/LikedSongsPage';
import MinimizedPlayer from '@/components/MinimizedPlayer';
import MaximizedPlayer from '@/components/MaximizedPlayer';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import AddToPlaylistModal from '@/components/AddToPlaylistModal';
import { Song, Playlist } from '@/types';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export default function MusicPlayerApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'settings'>('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'playlists' | 'liked'>('main');
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerMaximized, setIsPlayerMaximized] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
  
  const [songs, setSongs] = useState<Song[]>([
    {
      file_id: 1001,
      img_id: 2001,
      name: 'Midnight Dreams',
      artist: 'Luna Vista',
      language: 'English',
      tags: ['pop', 'dreamy', 'night'],
      views: 2300000,
      likes: 45000,
      id: '1001',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      isLiked: false
    },
    {
      file_id: 1002,
      img_id: 2002,
      name: 'Electric Sunset',
      artist: 'Neon Waves',
      language: 'English',
      tags: ['electronic', 'synthwave', 'sunset'],
      views: 1800000,
      likes: 38000,
      id: '1002',
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      isLiked: true
    },
    {
      file_id: 1003,
      img_id: 2003,
      name: 'Ocean Breeze',
      artist: 'Coastal Sound',
      language: 'English',
      tags: ['ambient', 'nature', 'relaxing'],
      views: 3100000,
      likes: 52000,
      id: '1003',
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      isLiked: false
    },
    {
      file_id: 1004,
      img_id: 2004,
      name: 'City Lights',
      artist: 'Urban Echo',
      language: 'English',
      tags: ['urban', 'hip-hop', 'night'],
      views: 890000,
      likes: 23000,
      id: '1004',
      image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300',
      isLiked: true
    },
    {
      file_id: 1005,
      img_id: 2005,
      name: 'Starlight Symphony',
      artist: 'Cosmic Harmony',
      language: 'English',
      tags: ['classical', 'orchestral', 'space'],
      views: 1200000,
      likes: 28000,
      id: '1005',
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
      isLiked: false
    }
  ]);

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: '1',
      name: 'Chill Vibes',
      songCount: 3,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: songs.slice(0, 3)
    },
    {
      id: '2',
      name: 'Workout Mix',
      songCount: 2,
      image: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: songs.slice(1, 3)
    },
    {
      id: '3',
      name: 'Study Focus',
      songCount: 2,
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: songs.slice(2, 4)
    }
  ]);

  const likedSongs = songs.filter(song => song.isLiked);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSongPlay = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePlayerSize = () => {
    setIsPlayerMaximized(!isPlayerMaximized);
  };

  const closePlayer = () => {
    setCurrentSong(null);
    setIsPlaying(false);
    setIsPlayerMaximized(false);
  };

  const toggleLike = (songId: string) => {
    setSongs(prevSongs => 
      prevSongs.map(song => 
        song.id === songId ? { ...song, isLiked: !song.isLiked } : song
      )
    );
    if (currentSong && currentSong.id === songId) {
      setCurrentSong(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  };

  const handlePrevious = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const previousIndex = currentIndex > 0 ? currentIndex - 1 : songs.length - 1;
      setCurrentSong(songs[previousIndex]);
    }
  };

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = songs.findIndex(song => song.id === currentSong.id);
      const nextIndex = currentIndex < songs.length - 1 ? currentIndex + 1 : 0;
      setCurrentSong(songs[nextIndex]);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Playlist management functions
  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songCount: 0,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: []
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  const renamePlaylist = (playlistId: string, newName: string) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, name: newName }
          : playlist
      )
    );
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(prev => 
      prev.map(playlist => {
        if (playlist.id === playlistId) {
          const songExists = playlist.songs.some(s => s.id === song.id);
          if (!songExists) {
            const updatedSongs = [...playlist.songs, song];
            return {
              ...playlist,
              songs: updatedSongs,
              songCount: updatedSongs.length,
              image: updatedSongs[0]?.image || playlist.image
            };
          }
        }
        return playlist;
      })
    );
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev => 
      prev.map(playlist => {
        if (playlist.id === playlistId) {
          const updatedSongs = playlist.songs.filter(song => song.id !== songId);
          return {
            ...playlist,
            songs: updatedSongs,
            songCount: updatedSongs.length,
            image: updatedSongs[0]?.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
          };
        }
        return playlist;
      })
    );
  };

  const handleAddToPlaylist = (song: Song) => {
    setSelectedSongForPlaylist(song);
    setShowAddToPlaylistModal(true);
  };

  const renderContent = () => {
    if (currentPage === 'playlists') {
      return (
        <PlaylistsPage 
          playlists={playlists} 
          onBack={() => setCurrentPage('main')} 
          onSongPlay={handleSongPlay}
          onCreatePlaylist={() => setShowCreatePlaylistModal(true)}
          onDeletePlaylist={deletePlaylist}
          onRenamePlaylist={renamePlaylist}
          onRemoveSongFromPlaylist={removeSongFromPlaylist}
        />
      );
    }
    
    if (currentPage === 'liked') {
      return <LikedSongsPage songs={likedSongs} onBack={() => setCurrentPage('main')} onSongPlay={handleSongPlay} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage songs={songs} onSongPlay={handleSongPlay} formatNumber={formatNumber} onAddToPlaylist={handleAddToPlaylist} />;
      case 'search':
        return <SearchPage songs={songs} onSongPlay={handleSongPlay} formatNumber={formatNumber} onAddToPlaylist={handleAddToPlaylist} />;
      case 'settings':
        return <SettingsPage onPlaylistsClick={() => setCurrentPage('playlists')} onLikedClick={() => setCurrentPage('liked')} />;
      default:
        return <HomePage songs={songs} onSongPlay={handleSongPlay} formatNumber={formatNumber} onAddToPlaylist={handleAddToPlaylist} />;
    }
  };

  const themeClasses = isDarkMode 
    ? 'bg-gray-900 text-white' 
    : 'bg-gray-50 text-gray-900';

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <div className={`min-h-screen ${themeClasses} relative overflow-hidden`}>
        {/* Main Content */}
        <div className={`transition-all duration-300 ${currentSong ? 'pb-36' : 'pb-20'}`}>
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        {currentPage === 'main' && (
          <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t z-30`}>
            <div className="flex items-center justify-around py-3">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  activeTab === 'home' ? 'text-purple-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <HomeIcon size={24} />
                <span className="text-xs">Home</span>
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  activeTab === 'search' ? 'text-purple-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Search size={24} />
                <span className="text-xs">Search</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  activeTab === 'settings' ? 'text-purple-400' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <Settings size={24} />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Music Player */}
        {currentSong && (
          <>
            {!isPlayerMaximized ? (
              <MinimizedPlayer
                song={currentSong}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onMaximize={togglePlayerSize}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onClose={closePlayer}
                onToggleLike={() => toggleLike(currentSong.id)}
                formatNumber={formatNumber}
              />
            ) : (
              <MaximizedPlayer
                song={currentSong}
                isPlaying={isPlaying}
                onTogglePlay={togglePlay}
                onMinimize={togglePlayerSize}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onToggleLike={() => toggleLike(currentSong.id)}
                formatNumber={formatNumber}
                onAddToPlaylist={() => handleAddToPlaylist(currentSong)}
              />
            )}
          </>
        )}

        {/* Modals */}
        <CreatePlaylistModal
          isOpen={showCreatePlaylistModal}
          onClose={() => setShowCreatePlaylistModal(false)}
          onCreatePlaylist={createPlaylist}
        />

        <AddToPlaylistModal
          isOpen={showAddToPlaylistModal}
          onClose={() => {
            setShowAddToPlaylistModal(false);
            setSelectedSongForPlaylist(null);
          }}
          song={selectedSongForPlaylist}
          playlists={playlists}
          onAddToPlaylist={addSongToPlaylist}
          onCreatePlaylist={() => {
            setShowAddToPlaylistModal(false);
            setShowCreatePlaylistModal(true);
          }}
        />
      </div>
    </ThemeContext.Provider>
  );
}