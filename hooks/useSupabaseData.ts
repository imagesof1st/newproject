import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, DatabaseSong, DatabasePlaylist } from '@/lib/supabase'
import { Song, Playlist } from '@/types'

export function useSupabaseData(user: User | null) {
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Convert database song to UI song format
  const convertDatabaseSong = (dbSong: DatabaseSong, isLiked: boolean = false): Song => ({
    file_id: dbSong.file_id,
    img_id: dbSong.img_id,
    name: dbSong.name,
    artist: dbSong.artist,
    language: dbSong.language,
    tags: dbSong.tags,
    views: dbSong.views,
    likes: dbSong.likes,
    id: dbSong.file_id.toString(),
    image: `https://images.pexels.com/photos/${dbSong.img_id}/pexels-photo-${dbSong.img_id}.jpeg?auto=compress&cs=tinysrgb&w=300`,
    isLiked
  })

  // Fetch all songs
  const fetchSongs = async () => {
    try {
      const { data: songsData, error } = await supabase
        .from('songs')
        .select('*')
        .order('views', { ascending: false })

      if (error) throw error

      let userLikedSongs = new Set<number>()
      
      if (user) {
        const { data: likedData } = await supabase
          .from('liked_songs')
          .select('song_id')
          .eq('user_id', user.id)
        
        if (likedData) {
          userLikedSongs = new Set(likedData.map(item => item.song_id))
          setLikedSongs(userLikedSongs)
        }
      }

      const convertedSongs = songsData?.map(song => 
        convertDatabaseSong(song, userLikedSongs.has(song.file_id))
      ) || []

      setSongs(convertedSongs)
    } catch (error) {
      console.error('Error fetching songs:', error)
    }
  }

  // Fetch user playlists
  const fetchPlaylists = async () => {
    if (!user) {
      setPlaylists([])
      return
    }

    try {
      const { data: playlistsData, error } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          playlist_songs (
            songs (*)
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const convertedPlaylists: Playlist[] = playlistsData?.map(playlist => {
        const playlistSongs = playlist.playlist_songs?.map((ps: any) => 
          convertDatabaseSong(ps.songs, likedSongs.has(ps.songs.file_id))
        ) || []

        return {
          id: playlist.id.toString(),
          name: playlist.name,
          songCount: playlistSongs.length,
          image: playlistSongs[0]?.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
          songs: playlistSongs
        }
      }) || []

      setPlaylists(convertedPlaylists)
    } catch (error) {
      console.error('Error fetching playlists:', error)
    }
  }

  // Toggle like song
  const toggleLike = async (songId: string) => {
    if (!user) return

    const songFileId = parseInt(songId)
    const isCurrentlyLiked = likedSongs.has(songFileId)

    try {
      if (isCurrentlyLiked) {
        const { error } = await supabase
          .from('liked_songs')
          .delete()
          .eq('user_id', user.id)
          .eq('song_id', songFileId)

        if (error) throw error

        setLikedSongs(prev => {
          const newSet = new Set(prev)
          newSet.delete(songFileId)
          return newSet
        })
      } else {
        const { error } = await supabase
          .from('liked_songs')
          .insert({
            user_id: user.id,
            song_id: songFileId
          })

        if (error) throw error

        setLikedSongs(prev => new Set(prev).add(songFileId))
      }

      // Update songs state
      setSongs(prevSongs => 
        prevSongs.map(song => 
          song.id === songId ? { ...song, isLiked: !isCurrentlyLiked } : song
        )
      )

      // Update playlists state
      setPlaylists(prevPlaylists =>
        prevPlaylists.map(playlist => ({
          ...playlist,
          songs: playlist.songs.map(song =>
            song.id === songId ? { ...song, isLiked: !isCurrentlyLiked } : song
          )
        }))
      )
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  // Create playlist
  const createPlaylist = async (name: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('playlists')
        .insert({
          user_id: user.id,
          name
        })
        .select()
        .single()

      if (error) throw error

      const newPlaylist: Playlist = {
        id: data.id.toString(),
        name: data.name,
        songCount: 0,
        image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
        songs: []
      }

      setPlaylists(prev => [...prev, newPlaylist])
    } catch (error) {
      console.error('Error creating playlist:', error)
    }
  }

  // Delete playlist
  const deletePlaylist = async (playlistId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('playlists')
        .delete()
        .eq('id', parseInt(playlistId))
        .eq('user_id', user.id)

      if (error) throw error

      setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId))
    } catch (error) {
      console.error('Error deleting playlist:', error)
    }
  }

  // Rename playlist
  const renamePlaylist = async (playlistId: string, newName: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('playlists')
        .update({ name: newName })
        .eq('id', parseInt(playlistId))
        .eq('user_id', user.id)

      if (error) throw error

      setPlaylists(prev => 
        prev.map(playlist => 
          playlist.id === playlistId 
            ? { ...playlist, name: newName }
            : playlist
        )
      )
    } catch (error) {
      console.error('Error renaming playlist:', error)
    }
  }

  // Add song to playlist
  const addSongToPlaylist = async (playlistId: string, song: Song) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('playlist_songs')
        .insert({
          playlist_id: parseInt(playlistId),
          song_id: song.file_id
        })

      if (error) throw error

      setPlaylists(prev => 
        prev.map(playlist => {
          if (playlist.id === playlistId) {
            const songExists = playlist.songs.some(s => s.id === song.id)
            if (!songExists) {
              const updatedSongs = [...playlist.songs, song]
              return {
                ...playlist,
                songs: updatedSongs,
                songCount: updatedSongs.length,
                image: updatedSongs[0]?.image || playlist.image
              }
            }
          }
          return playlist
        })
      )
    } catch (error) {
      console.error('Error adding song to playlist:', error)
    }
  }

  // Remove song from playlist
  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('playlist_songs')
        .delete()
        .eq('playlist_id', parseInt(playlistId))
        .eq('song_id', parseInt(songId))

      if (error) throw error

      setPlaylists(prev => 
        prev.map(playlist => {
          if (playlist.id === playlistId) {
            const updatedSongs = playlist.songs.filter(song => song.id !== songId)
            return {
              ...playlist,
              songs: updatedSongs,
              songCount: updatedSongs.length,
              image: updatedSongs[0]?.image || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300'
            }
          }
          return playlist
        })
      )
    } catch (error) {
      console.error('Error removing song from playlist:', error)
    }
  }

  // Record listening history
  const recordListeningHistory = async (songId: string, minutesListened: number = 1) => {
    if (!user) return

    try {
      const now = new Date()
      const { error } = await supabase
        .from('history')
        .upsert({
          user_id: user.id,
          song_id: parseInt(songId),
          last_date: now.toISOString().split('T')[0],
          last_time: now.toTimeString().split(' ')[0],
          minutes_listened: minutesListened
        })

      if (error) throw error
    } catch (error) {
      console.error('Error recording history:', error)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchSongs()
      await fetchPlaylists()
      setLoading(false)
    }

    loadData()
  }, [user])

  return {
    songs,
    playlists,
    likedSongs: songs.filter(song => song.isLiked),
    loading,
    toggleLike,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    recordListeningHistory,
    refreshData: () => {
      fetchSongs()
      fetchPlaylists()
    }
  }
}