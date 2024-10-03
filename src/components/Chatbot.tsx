import React, { useState } from 'react'
import { Send, ExternalLink } from 'lucide-react'
import { useChatStore } from '../store/chatStore'
import { OpenAI } from 'openai'
import { getCachedResponse, setCachedResponse } from '../utils/cache'
import { findProducts, Product } from '../data/products'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: This is not recommended for production
})

const quickQuestions = [
  "¿Cuáles son sus productos más vendidos?",
  "¿Tienen alguna oferta especial?",
  "¿Cuál es su política de devoluciones?",
  "¿Cómo puedo hacer un seguimiento de mi pedido?"
];

interface Message {
  text: string;
  sender: 'user' | 'bot';
  products?: Product[];
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('')
  const { messages, addMessage } = useChatStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await processInput(input)
  }

  const processInput = async (text: string) => {
    if (text.trim() && !isLoading) {
      addMessage({ text, sender: 'user' })
      setInput('')
      setIsLoading(true)

      try {
        const cachedResponse = getCachedResponse(text)
        if (cachedResponse) {
          addMessage(JSON.parse(cachedResponse))
        } else {
          const botResponse = await getChatGPTResponse(text)
          const relatedProducts = findProducts(text)
          const message: Message = { 
            text: botResponse, 
            sender: 'bot',
            products: relatedProducts.length > 0 ? relatedProducts : undefined
          }
          addMessage(message)
          setCachedResponse(text, JSON.stringify(message))
        }
      } catch (error) {
        console.error('Error getting ChatGPT response:', error)
        addMessage({ text: 'Lo siento, hubo un error al procesar tu solicitud.', sender: 'bot' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
              {message.products && (
                <div className="mt-2 space-y-2">
                  {message.products.map((product) => (
                    <div key={product.id} className="bg-white rounded-md p-2 shadow-sm">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
                      <h3 className="font-bold text-sm">{product.name}</h3>
                      <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm flex items-center mt-1"
                      >
                        Ver producto <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              Escribiendo...
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => processInput(question)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {question}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}

async function getChatGPTResponse(input: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "Eres un asistente de ventas para una tienda de ecommerce. Tu tarea es ayudar a los clientes a encontrar productos, responder preguntas sobre productos y proporcionar recomendaciones. Sé amable, profesional y conciso en tus respuestas." },
      { role: "user", content: input }
    ],
    model: "gpt-3.5-turbo",
  })

  return completion.choices[0].message.content || "Lo siento, no pude generar una respuesta."
}

export default Chatbot