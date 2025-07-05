import React from 'react'
import { Music, Chrome } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-full max-w-md text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Music Player</h1>
          <p className="text-white/70">Discover and enjoy your favorite music</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={signInWithGoogle}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium py-3 px-6 rounded-full flex items-center justify-center space-x-3 transition-colors"
          >
            <Chrome size={20} />
            <span>Continue with Google</span>
          </button>
          
          <p className="text-white/60 text-sm">
            Sign in to access your playlists, liked songs, and personalized recommendations
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-white/50 text-xs">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage