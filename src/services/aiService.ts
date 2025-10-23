import { OpenAI } from 'openai';
import { DisplayChatMessage, ToolDependencies } from '../types';

// Groq API configuration
const groq = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  dangerouslyAllowBrowser: true // Only for client-side demo, use server-side in production
});

export const getInfluencerOSAssistantBriefing = async (): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant for an influencer management agency. Provide a brief daily briefing with key metrics and insights.'
        },
        {
          role: 'user',
          content: 'Generate a daily briefing for an influencer management agency including key performance metrics and recommendations.'
        }
      ],
      max_tokens: 300
    });

    return completion.choices[0]?.message?.content || "Briefing: No briefing available yet.";
  } catch (error) {
    console.error('Error generating briefing:', error);
    return "Briefing: No briefing available yet.";
  }
};

export const generateTaskSuggestions = async (taskDescription: string): Promise<string[]> => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that helps break down tasks into actionable subtasks for influencer management.'
        },
        {
          role: 'user',
          content: `Break down this task into 3-5 actionable subtasks: ${taskDescription}`
        }
      ],
      max_tokens: 200
    });

    const content = completion.choices[0]?.message?.content || '';
    return content.split('\n').filter(line => line.trim()).slice(0, 5);
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return [];
  }
};

export const analyzeLeadPotential = async (influencerData: any): Promise<{ score: number; insights: string }> => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that analyzes influencer potential for marketing campaigns. Score from 0-100 and provide insights.'
        },
        {
          role: 'user',
          content: `Analyze this influencer: ${JSON.stringify(influencerData)}. Provide a score (0-100) and brief insights.`
        }
      ],
      max_tokens: 150
    });

    const content = completion.choices[0]?.message?.content || '';
    const scoreMatch = content.match(/(\d+)/);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 50;
    const insights = content.replace(/^\d+/, '').trim();

    return { score: Math.min(100, Math.max(0, score)), insights };
  } catch (error) {
    console.error('Error analyzing lead potential:', error);
    return { score: 50, insights: 'Analysis unavailable' };
  }
};

export const runConversationWithTools = async (
  apiHistory: { role: 'user' | 'assistant', content: string }[],
  toolDependencies: ToolDependencies,
  onUpdate: (updates: Partial<DisplayChatMessage> & { _navigate?: { path: string; state?: Record<string, unknown> } }) => void,
  confirmedToolCall?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall
): Promise<void> => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: apiHistory.map(h => ({ role: h.role, content: h.content })),
      tools: [
        {
          type: 'function',
          function: {
            name: 'addTask',
            description: 'Add a new task to the system',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'Task title' },
                dueDate: { type: 'string', description: 'Due date in YYYY-MM-DD format' },
                status: { type: 'string', description: 'Task status' }
              },
              required: ['title', 'dueDate', 'status']
            }
          }
        }
      ],
      max_tokens: 300
    });

    const message = completion.choices[0]?.message;
    if (message?.tool_calls) {
      // Handle tool calls
      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === 'addTask') {
          const args = JSON.parse(toolCall.function.arguments);
          toolDependencies.addTask(args);
          onUpdate({
            role: 'assistant',
            content: `Task "${args.title}" has been added successfully.`,
            requiresConfirmation: {
              text: `Add task: ${args.title}`,
              tool_call: toolCall
            }
          });
        }
      }
    } else {
      onUpdate({
        role: 'assistant',
        content: message?.content || 'I couldn\'t process your request.'
      });
    }
  } catch (error) {
    console.error('Error in AI conversation:', error);
    onUpdate({
      role: 'assistant',
      content: 'I encountered an error processing your request.'
    });
  }
};