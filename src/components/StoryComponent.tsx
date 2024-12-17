import { useState, ChangeEvent, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { callAI } from '../services/callService';
import { FaInfo, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface StoryPrompt {
    id: number;
    title: string;
}

const StoryComponent: React.FC = () => {
    const [storyPrompt, setStory] = useState<StoryPrompt[]>([
        { id: 0, title: '' },
        { id: 1, title: 'Tell me a sweet bed time story?' },
        { id: 2, title: 'Tell this story in the style of a children\'s book' },
        { id: 3, title: 'Tell me this story in the style of a fairy tale' },
        { id: 4, title: 'Make this story interesting, fun and engaging' },
    ]);
    const [input, setInput] = useState<string>('');
    const [selectedPrompt, setSelectedPrompt] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const endRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) {
            if (!selectedPrompt.trim()) {
                toast.error('Please select a prompt and enter a message.');
                return;
            };
        };

        const userMessage: Message = { role: 'user', content: `${selectedPrompt !== "" ? selectedPrompt : ""} ${input}` };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setLoading(true);

        try {
            const response = await callAI(messages, userMessage);
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
        <div className="flex flex-col h-auto">
            {/* Header */}
            <div className="bg-yellow-400 text-white p-4">
                <h3 className="text-lg font-bold text-right">Welcome to AI Story Teller</h3>
            </div>

            <div role="alert" className="alert">
                <FaInfo size={12} className="text-gray-500 animate-pulse" />
                <span>Summarize your story for the AI and see how it tells the story</span>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 container mx-auto my-3">
                {storyPrompt.map((prompt) => (
                    <>
                        {prompt.id != 0 && <div className="md:card bg-gray-100 border-l-4 border-gray-500 shadow-xl" key={prompt.id}>
                            <div className="md:card-body" onClick={() => setSelectedPrompt(prompt.title)}>
                                <p className='cursor-pointer text-sm'>{prompt.title}</p>
                            </div>
                        </div>}
                    </>

                ))}
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
            {selectedPrompt && <div className='p-4 bg-gray-100 border-t border-gray-200 flex items-center gap-4'>
                {selectedPrompt}
                <span><FaTimes onClick={() => setSelectedPrompt("")} size={16} className="text-gray-500 cursor-pointer" />

                </span>
            </div>}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex mb-4">
                <textarea
                    placeholder="Ask something..."
                    value={input}
                    rows={1}
                    onChange={handleInputChange}
                    className="flex-grow border border-gray-300 rounded-lg p-3 focus:outline-none"
                />
                <button
                    type="submit"
                    className="bg-yellow-400 text-white p-3 rounded-lg ml-2 hover:bg-yellow-500 transition"
                >
                    {loading ? 'Loading...' : 'Send'}
                </button>
            </form>
            <div className="h-10"></div>
        </div>
    );
};

export default StoryComponent;