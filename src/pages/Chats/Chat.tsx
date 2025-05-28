import { MessageService } from "@/services/Chats/MessageService"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"

export const Chat = () => {
    const { id_chat = "" } = useParams<{ id_chat: string }>()
    const [messages, setMessages] = useState<any[]>([])
    const [currentUserId, setCurrentUserId] = useState<number>(2) // Cambiar por el ID real del usuario

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const result = await MessageService.getMessages(parseInt(id_chat))
                setMessages(result)
            } catch (error) {
                console.error("Error fetching messages:", error)
            }
        }

        fetchMessages()
    }, [id_chat])

    const renderMessageContent = (message: any) => {
        const isCurrentUser = message.id_user === currentUserId
        
        switch (message.tipo) {
            case 'imagen':
                return (
                    <div className={`max-w-xs ${isCurrentUser ? 'ml-auto' : ''}`}>
                        <img
                            src={message.contenido}
                            alt="Imagen enviada"
                            className="rounded-lg object-cover max-h-60"
                        />
                    </div>
                )
            case 'audio':
                return (
                    <div className={`flex items-center ${isCurrentUser ? 'justify-end' : ''}`}>
                        <audio controls className="w-64">
                            <source src={message.contenido} type="audio/mpeg" />
                            Tu navegador no soporta el elemento de audio.
                        </audio>
                    </div>
                )
            default: // texto
                return (
                    <p className={`${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                        {message.contenido}
                    </p>
                )
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Cabecera del chat - similar a tu lista */}
            <div className="bg-white p-4 border-b shadow-sm">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-800">Nombre del Chat</h1>
                    <span className="text-sm text-gray-500">En línea</span>
                </div>
            </div>

            {/* Área de mensajes */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((message: any, index: number) => {
                    const isCurrentUser = message.id_user === currentUserId
                    
                    return (
                        <div
                            key={index}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                                    }`}
                            >
                                {renderMessageContent(message)}
                                <div className={`text-xs mt-1 flex justify-end ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {formatTime(message.fecha_envio)}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Área de entrada - estilo más limpio */}
            <div className="bg-white border-t p-4">
                <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
                    />
                    <button className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}