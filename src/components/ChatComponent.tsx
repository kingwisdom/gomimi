import { useState, ChangeEvent, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { callAI } from '../services/callService';
import toast from 'react-hot-toast';
import { FaCopy } from 'react-icons/fa';

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

const ChatComponent: React.FC = () => {
    // const [input, setInput] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [currentCV, setCurrentCV] = useState<string>('');
    const [customPrompt, setCustomPrompt] = useState<string>('Generate a CV and cover letter based on the job description and current CV.');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const endRef = useRef<HTMLDivElement | null>(null);

    // const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //     setInput(e.target.value);
    // };

    const handleJobDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setJobDescription(e.target.value);
    };

    const handleCurrentCVChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentCV(e.target.value);
    };

    const handleCustomPromptChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomPrompt(e.target.value);
    };


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobDescription.trim() || !currentCV.trim()) {
            toast.error('Please enter both job description and current CV.');
            return;
        }

        const userMessage: Message = { role: 'user', content: `${customPrompt}\n\nJob Description:\n${jobDescription}\n\nCurrent CV:\n${currentCV}` };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setLoading(true);

        try {
            const response = await callAI(messages, userMessage);
            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            let assistantContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        const jsonString = line.replace('data: ', '');
                        if (jsonString === '[DONE]') break; // End of stream

                        // Log the raw JSON string for debugging
                        console.log('Raw JSON string:', jsonString);

                        try {
                            const json = JSON.parse(jsonString);
                            const content = json.choices[0]?.delta?.content || '';

                            // Accumulate the content
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

            // setInput('');
            setJobDescription('');
            setCurrentCV('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        const textToCopy = text;
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Copied to clipboard!');
        }).catch((error) => {
            console.error('Failed to copy to clipboard:', error);
        });
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <div className="flex flex-col">
                {/* Header */}
                <div className="bg-yellow-400 text-white p-4">
                    <h3 className="text-lg font-bold text-right">Welcome to AI Job Chat Assistant</h3>
                </div>

                {/* Job Description and Current CV Section */}
                <div className="p-4">
                    <h4 className="text-lg font-bold mb-2">Job Description</h4>
                    <textarea
                        placeholder="Enter the job description here..."
                        value={jobDescription}
                        onChange={handleJobDescriptionChange}
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none"
                        rows={4}
                    />

                    <h4 className="text-lg font-bold mb-2">Current CV</h4>
                    <textarea
                        placeholder="Enter your current CV here or provide information to create a CV..."
                        value={currentCV}
                        onChange={handleCurrentCVChange}
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none"
                        rows={4}
                    />

                    <h4 className="text-lg font-bold mb-2">Custom Prompt</h4>
                    <input
                        type="text"
                        placeholder="Modify the prompt..."
                        value={customPrompt}
                        onChange={handleCustomPromptChange}
                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none"
                    />

                    <button
                        onClick={handleSendMessage}
                        className="bg-yellow-400 text-white p-3 rounded-lg hover:bg-yellow-500 transition"
                    >
                        Generate CV and Cover Letter
                    </button>
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
                                <FaCopy onClick={() => copyToClipboard(message.content)} className="text-xl mt-5 cursor-pointer text-gray-500 hover:text-gray-800 transition" />
                                copy
                            </div>
                        </div>
                    ))}
                    {loading && <p className="text-gray-500">Assistant is typing...</p>}
                    <div ref={endRef} />
                </div>
            </div>
            <div className="h-20"></div>
        </>
    );
};

export default ChatComponent;