import React from 'react'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Asistente de Productos</h1>
        <Chatbot />
      </div>
    </div>
  )
}

export default App