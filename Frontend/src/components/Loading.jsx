import React from 'react'

function Loading() {
  return (
    <div className="w-full h-screen bg-gradient-to-t from-gray-800 to-white flex justify-center items-center">
      <div className="w-14 h-14 border-4 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loading