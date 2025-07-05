import React from 'react';
import { TrendingUp, Music } from 'lucide-react';
import { Song } from '@/types';
import { useTheme } from '@/app/page';
import { useAuth } from '@/hooks/useAuth';
import SongCard from './SongCard';
import TrendingSong from './TrendingSong';

interface HomePageProps {
  songs: Song[];
  onSongPlay: (song: Song) => void;
  formatNumber: (num: number) => string;
  onAddToPlaylist: (song: Song) => void;
}

const HomePage: React.FC<HomePageProps> = ({ songs, onSongPlay, formatNumber, onAddToPlaylist }) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 ${isDarkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'} backdrop-blur-md z-10 px-4 py-4`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Good evening</h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>What do you want to listen to?</p>
          </div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Music size={20} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {/* Trending Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <TrendingUp className="mr-2 text-purple-400" size={20} />
              Trending Now
            </h2>
            <button className="text-purple-400 text-sm font-medium">See all</button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {songs.slice(0, 3).map((song) => (
              <TrendingSong key={song.id} song={song} onPlay={onSongPlay} formatNumber={formatNumber} />
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Made for you</h2>
            <button className="text-purple-400 text-sm font-medium">See all</button>
          </div>
          <div className="space-y-3">
            {songs.map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                onPlay={onSongPlay} 
                formatNumber={formatNumber}
                onAddToPlaylist={onAddToPlaylist}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;