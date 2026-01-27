import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import api from '../../services/api';
import { useSpeech } from '../../hooks/useSpeech';

interface ConversationMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function SpeechConversationMode() {
    const [isConversationMode, setIsConversationMode] = useState(false);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const [currentTranscript, setCurrentTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { isListening, isSpeaking, startListening, stopListening, speak, stopSpeaking } = useSpeech();
    const conversationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-restart listening after AI finishes speaking
    useEffect(() => {
        if (isConversationMode && !isSpeaking && !isListening && !isProcessing) {
            // Wait a moment after AI stops speaking, then start listening again
            conversationTimeoutRef.current = setTimeout(() => {
                startListening(handleSpeechResult);
            }, 1000);
        }

        return () => {
            if (conversationTimeoutRef.current) {
                clearTimeout(conversationTimeoutRef.current);
            }
        };
    }, [isConversationMode, isSpeaking, isListening, isProcessing]);

    const handleSpeechResult = async (transcript: string) => {
        if (!transcript.trim()) return;

        setCurrentTranscript(transcript);

        // Add user message
        const userMessage: ConversationMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: transcript,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsProcessing(true);

        try {
            // Get AI response
            const response = await api.post('/assistant/chat', {
                message: transcript,
                include_tasks: true,
            });

            const assistantMessage: ConversationMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.response || "I didn't catch that. Could you repeat?",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Speak the response
            speak(assistantMessage.content);

        } catch (error: any) {
            const errorMessage = "Sorry, I'm having trouble connecting. Please try again.";
            speak(errorMessage);

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: errorMessage,
                timestamp: new Date(),
            }]);
        } finally {
            setIsProcessing(false);
            setCurrentTranscript('');
        }
    };

    const toggleConversationMode = () => {
        if (isConversationMode) {
            // Stop conversation mode
            stopListening();
            stopSpeaking();
            setIsConversationMode(false);
            if (conversationTimeoutRef.current) {
                clearTimeout(conversationTimeoutRef.current);
            }
        } else {
            // Start conversation mode
            setIsConversationMode(true);
            setMessages([{
                id: '1',
                role: 'assistant',
                content: "Conversation mode activated. I'm listening...",
                timestamp: new Date(),
            }]);
            speak("Conversation mode activated. I'm listening. How can I help you?");
        }
    };

    const clearConversation = () => {
        setMessages([]);
        setCurrentTranscript('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Radio className={`w-6 h-6 ${isConversationMode ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Speech-to-Speech Mode</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isConversationMode ? 'Active - Continuous conversation' : 'Inactive'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={toggleConversationMode}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${isConversationMode
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        }`}
                >
                    {isConversationMode ? 'Stop Conversation' : 'Start Conversation'}
                </button>
            </div>

            {/* Status Indicators */}
            {isConversationMode && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-2 ${isListening ? 'text-red-600' : 'text-gray-400'}`}>
                            {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                            <span>{isListening ? 'Listening...' : 'Not listening'}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${isSpeaking ? 'text-blue-600' : 'text-gray-400'}`}>
                            {isSpeaking ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
                            <span>{isSpeaking ? 'Speaking...' : 'Silent'}</span>
                        </div>
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-purple-600">
                                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </div>
                        )}
                    </div>
                    {currentTranscript && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">You said:</span> "{currentTranscript}"
                        </div>
                    )}
                </div>
            )}

            {/* Conversation History */}
            {messages.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 ml-8'
                                    : 'bg-gray-100 dark:bg-gray-700 mr-8'
                                }`}
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {msg.role === 'user' ? '🗣️ You' : '🤖 AI'}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{msg.content}</p>
                        </div>
                    ))}
                </div>
            )}

            {messages.length > 0 && (
                <button
                    onClick={clearConversation}
                    className="w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    Clear Conversation
                </button>
            )}

            {/* Instructions */}
            {!isConversationMode && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">How it works:</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• Click "Start Conversation" to begin</li>
                        <li>• Speak your question when the microphone is active</li>
                        <li>• AI will respond with voice automatically</li>
                        <li>• Conversation continues until you stop it</li>
                        <li>• Works best in Chrome or Edge browsers</li>
                    </ul>
                </div>
            )}
        </div>
    );
}
