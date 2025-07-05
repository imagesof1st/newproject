import React from 'react'
import { Music } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const GoogleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-10 w-full max-w-md text-center border border-gray-700/50 shadow-2xl">
        <div className="mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Music size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Music Player
          </h1>
          <p className="text-gray-300 text-lg">Discover and enjoy your favorite music</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={signInWithGoogle}
            className="w-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center space-x-4 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-gray-600/50"
          >
            <GoogleIcon />
            <span className="text-lg">Continue with Google</span>
          </button>
          
          <p className="text-gray-400 text-sm leading-relaxed">
            Sign in to access your playlists, liked songs, and personalized recommendations
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700/50">
          <p className="text-gray-500 text-xs leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 bg-pink-500/10 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}

export default LoginPage