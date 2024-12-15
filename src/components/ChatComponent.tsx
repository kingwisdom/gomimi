import { useState, ChangeEvent, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const ChatComponent: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const endRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setLoading(true); // Set loading to true

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_AI_KEY}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        ...messages,
                        userMessage,
                    ],
                    stream: true, // Enable streaming
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let assistantContent = '';

            if (reader) {
                // Read the stream
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    // Decode the value and split by lines
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        // Extract the JSON part
                        const jsonString = line.replace('data: ', '');
                        if (jsonString === '[DONE]') break; // End of stream

                        try {
                            const json = JSON.parse(jsonString);
                            const content = json.choices[0]?.delta?.content || '';
                            assistantContent += content;

                            // Update the last assistant message in the state
                            setMessages(prevMessages => {
                                const lastMessage = prevMessages[prevMessages.length - 1];
                                if (lastMessage && lastMessage.role === 'assistant') {
                                    return [
                                        ...prevMessages.slice(0, -1),
                                        { ...lastMessage, content: assistantContent }
                                    ];
                                }
                                return prevMessages;
                            });
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                        }
                    }
                }
            }

            // Finalize the assistant message
            setMessages(prevMessages => [
                ...prevMessages,
                { role: 'assistant', content: assistantContent }
            ]);

            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Set loading to false
        }
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="bg-yellow-400 text-white p-4">
                <h3 className="text-lg font-bold text-right">Welcome to AI Chat Assistant</h3>
            </div>

            {/* Chat History */}
            <div className="flex-grow p-4 overflow-y-scroll">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role}`}>
                        <div className={`p-4 rounded-lg shadow-md ${message.role === 'assistant' ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-gray-100'}`}>
                            <p className={`font-bold ${message.role === 'assistant' ? 'text-blue-800' : 'text-black'} mb-2`}>
                                {message.role === 'assistant' ? 'Assistant' : 'You'}:
                            </p>
                            <div><Markdown>{message.content}</Markdown></div>
                        </div>
                    </div>
                ))}
                {loading && <p className="text-gray-500">Assistant is typing...</p>}
                <div ref={endRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex">
                <textarea
                    placeholder="Ask something..."
                    value={input}
                    onChange={handleInputChange}
                    className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-yellow-400 text-white p-3 rounded-lg ml-2 hover:bg-yellow-500 transition"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatComponent;