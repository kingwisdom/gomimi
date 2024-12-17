
export const callAI = async (messages: any[], userMessage: any) => {
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

    return response;
}