"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { OpenAI } from 'openai';
import useStore from '../hooks/useStore';
import { getInfluencerOSAssistantBriefing, runConversationWithTools } from '../services/aiService';
import SkeletonLoader from './SkeletonLoader';
import { Send, Calendar, FileText, Receipt, Flame, CheckCircle, Bot, User, BrainCircuit, X } from 'lucide-react';
import { DisplayChatMessage, ChatForm, ContractTemplate, ToolDependencies } from '../types';

const BriefingSection = () => {
    const { tasks, events, transactions } = useStore();
    const [briefing, setBriefing] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getInfluencerOSAssistantBriefing()
            .then(setBriefing)
            .finally(() => setIsLoading(false));
    }, []);

    const formatBriefing = (text: string) => {
        const elements: React.ReactNode[] = [];
        const sanitizedText = text.replace(/<font color="purple">(.*?)<\/font>/g, '### $1');
        const lines = sanitizedText.split('\n').filter(line => line.trim() !== '');

        let i = 0;

        const headingIconMap: { [key: string]: React.ReactNode } = {
            'events': <Calendar className="w-5 h-5 text-brand-primary flex-shrink-0" />,
            'overdue tasks': <FileText className="w-5 h-5 text-brand-primary flex-shrink-0" />,
            'transactions': <Receipt className="w-5 h-5 text-brand-primary flex-shrink-0" />,
            'notifications': <Receipt className="w-5 h-5 text-brand-primary flex-shrink-0" />,
            'action points': <Flame className="w-5 h-5 text-brand-primary flex-shrink-0" />,
        };

        let currentHeading = '';

        while (i < lines.length) {
            const line = lines[i];

            if (line.startsWith('### ')) {
                const headingText = line.replace('### ', '').trim();
                currentHeading = headingText.toLowerCase();

                const iconKey = Object.keys(headingIconMap).find(key => currentHeading.includes(key));
                const icon = iconKey ? headingIconMap[iconKey] : null;

                elements.push(
                    <div key={i} className="flex items-center gap-2 mt-4 mb-2">
                        {icon}
                        <h3 className="text-lg font-bold text-brand-primary">{headingText}</h3>
                    </div>
                );
                i++;
            } else if (line.startsWith('- ') || line.startsWith('• ')) {
                const listItems = [];
                while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('• '))) {
                    const itemText = lines[i].replace(/[-•]\s*/, '').trim();

                    let itemIcon: React.ReactNode = <div className="w-4 h-4 flex items-center justify-center pt-1 flex-shrink-0">•</div>;

                    if (currentHeading.includes('events')) {
                         itemIcon = <Calendar className="w-4 h-4 text-brand-text-secondary mt-1 flex-shrink-0" />;
                    } else if (currentHeading.includes('overdue tasks')) {
                         itemIcon = <Flame className="w-4 h-4 text-brand-warning mt-1 flex-shrink-0" />;
                    } else if (currentHeading.includes('transactions') || currentHeading.includes('notifications')) {
                         itemIcon = <Receipt className="w-4 h-4 text-brand-text-secondary mt-1 flex-shrink-0" />;
                    }

                    listItems.push(
                        <li key={i} className="flex items-start gap-2.5">
                            {itemIcon}
                            <span className="flex-grow">{itemText}</span>
                        </li>
                    );
                    i++;
                }
                elements.push(<ul key={`ul-${i}`} className="space-y-1.5 pl-1 text-brand-text-secondary">{listItems}</ul>);
            } else {
                elements.push(<p key={i} className="leading-relaxed text-brand-text-secondary">{line}</p>);
                i++;
            }
        }
        return elements;
    };


    return (
        <div className="mt-4">
            {isLoading && (
                <div className="space-y-3 mt-4">
                    <SkeletonLoader className="h-5 w-1/3" />
                    <SkeletonLoader className="h-4 w-full" />
                    <SkeletonLoader className="h-4 w-5/6" />
                </div>
            )}
            {briefing && (
                <div className="text-brand-text-secondary leading-relaxed">
                    {formatBriefing(briefing)}
                </div>
            )}
        </div>
    );
};

const AgentPlan: React.FC<{ plan: string[] }> = ({ plan }) => (
    <div className="border-t border-brand-border/50 mt-3 pt-3">
        <div className="flex items-center gap-2 text-sm text-brand-text-secondary mb-2">
            <BrainCircuit className="w-4 h-4" />
            <span className="font-semibold">{`Here's my plan:`}</span>
        </div>
        <ul className="space-y-1.5">
            {plan.map((step, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-brand-text-secondary">
                    <CheckCircle className="w-4 h-4 text-brand-primary/70 flex-shrink-0" />
                    <span>{step}</span>
                </li>
            ))}
        </ul>
    </div>
);

const AgentForm: React.FC<{ form: ChatForm; onSubmit: (data: Record<string, string | number | boolean>) => void }> = ({ form, onSubmit }) => {
    type FormDataRecord = Record<string, string | number | boolean>;
    const [formData, setFormData] = useState<FormDataRecord>({});

    const handleChange = (name: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="border-t border-brand-border/50 mt-3 pt-3 space-y-4">
            <h4 className="font-semibold text-brand-text-primary">{form.title}</h4>
            {form.fields.map(field => (
                <div key={field.name}>
                    <label className="block text-sm font-medium text-brand-text-secondary mb-1">{field.label}</label>
                    {field.type === 'text' && (
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            onChange={e => handleChange(field.name, e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    )}
                    {field.type === 'number' && (
                        <input
                            type="number"
                            placeholder={field.placeholder}
                            onChange={e => handleChange(field.name, e.target.valueAsNumber)}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    )}
                    {field.type === 'date' && (
                        <input
                            type="date"
                            onChange={e => handleChange(field.name, e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        />
                    )}
                    {field.type === 'select' && (
                        <select
                            onChange={e => handleChange(field.name, e.target.value)}
                            className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                            <option value="">{field.placeholder || 'Select an option'}</option>
                            {field.options?.filter(option => option.value).map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    )}
                </div>
            ))}
            <div className="flex justify-end">
                <button type="submit" className="bg-brand-primary text-white font-semibold py-1.5 px-4 rounded-lg hover:bg-brand-accent text-sm">
                    Submit
                </button>
            </div>
        </form>
    );
};


const ChatSection: React.FC<{ initialCommand?: string | null }> = ({ initialCommand }) => {
    const store = useStore();
    const router = useRouter();
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const dependenciesRef = useRef(store);
    useEffect(() => {
        dependenciesRef.current = store;
    }, [store]);


    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [store.chatHistory]);

    const handleSendMessage = useCallback(async (message: string | { formId: string; data: Record<string, string | number | boolean> }, confirmedToolCall?: OpenAI.Chat.Completions.ChatCompletionMessageToolCall | undefined) => {
        let newUserMessageContent: string;
        let currentMessages: DisplayChatMessage[] = [...store.chatHistory];

        if (typeof message === 'object' && 'formId' in message) {
            newUserMessageContent = `User submitted form data: ${JSON.stringify(message.data)}`;
            currentMessages = currentMessages.map(msg => msg.form?.id === message.formId ? { ...msg, form: undefined } : msg);
        } else if (typeof message === 'string') {
            const trimmedInput = message.trim();
            if (!trimmedInput && !confirmedToolCall) return;
            newUserMessageContent = trimmedInput;
        } else {
            newUserMessageContent = 'User confirmed action.';
        }

        const newUserMessage: DisplayChatMessage = { id: Date.now(), role: 'user', content: newUserMessageContent };
        const assistantMessageId = Date.now() + 1;
        const assistantMessage: DisplayChatMessage = { id: assistantMessageId, role: 'assistant', content: '' };

        const messagesWithUser = [...currentMessages, newUserMessage];
        store.setChatHistory([...messagesWithUser, assistantMessage]);

        if (inputRef.current) inputRef.current.value = '';
        setUserInput('');
        setIsLoading(true);

        interface NavigateUpdate { path: string; state?: Record<string, unknown>; }

        const onUpdate = (updates: Partial<DisplayChatMessage> & { _navigate?: NavigateUpdate }) => {
            if (updates._navigate) {
                router.push(updates._navigate.path);
                store.updateChatMessage(assistantMessageId, { content: updates.content || 'Navigating...' });
            } else {
                store.updateChatMessage(assistantMessageId, updates);
            }
        };

        const apiHistory: { role: 'user' | 'assistant', content: string }[] = messagesWithUser
            .filter(m => m.role === 'user' || m.role === 'assistant')
            .map(({ role, content }) => ({ role: role as 'user' | 'assistant', content }));

        // Convert Store to ToolDependencies format
        const toolDependencies: ToolDependencies = {
            influencers: dependenciesRef.current.influencers,
            brands: dependenciesRef.current.brands,
            contracts: dependenciesRef.current.contracts,
            campaigns: dependenciesRef.current.campaigns,
            tasks: dependenciesRef.current.tasks,
            transactions: dependenciesRef.current.transactions,
            invoices: dependenciesRef.current.invoices,
            // Core actions - map store methods to expected format
            addTask: dependenciesRef.current.addTask,
            updateTask: dependenciesRef.current.updateTask,
            scheduleEvent: dependenciesRef.current.scheduleEvent,
            createInvoice: dependenciesRef.current.createInvoice,
            logTransaction: dependenciesRef.current.logTransaction,
            createClient: (clientData: { client_type: 'influencer' | 'brand', name: string, details?: string }) => {
                dependenciesRef.current.addClient({ name: clientData.name }, clientData.client_type);
            },
            updateContract: dependenciesRef.current.updateContract,
            addContractTemplate: (templateData: Pick<ContractTemplate, 'name' | 'description'>) => {
                dependenciesRef.current.addContractTemplate(templateData);
            },
            createCampaign: dependenciesRef.current.createCampaign,
            // Mock implementations for tools that don't exist in store
            findInfluencers: async () => [],
            vetInfluencerProfile: async () => ({}),
            logClientInteraction: () => {},
            generateCampaignBrief: async () => '',
            sendInvoiceReminder: () => {},
            logPayment: () => {},
            trackInfluencerPayout: () => {},
            calculateCampaignProfitability: async () => ({}),
            generateFinancialReport: async () => ({}),
            sendContractForSignature: () => {},
            flagExpiringContracts: async () => [],
            generateContentIdeas: async () => [],
            draftSocialMediaCopy: async () => '',
            draftOutreachEmail: async () => '',
            generateCampaignReport: async () => ({}),
        };

        try {
            await runConversationWithTools(apiHistory, toolDependencies, onUpdate, confirmedToolCall);
        } catch (error) {
             console.error("Failed to get assistant response:", error);
             store.updateChatMessage(assistantMessageId, { content: "Sorry, I encountered an error." });
        } finally {
            setIsLoading(false);
        }
    }, [store, router]);

    useEffect(() => {
        if (initialCommand) {
            handleSendMessage(initialCommand);
            store.consumeAssistantCommand();
        }
    }, [initialCommand, handleSendMessage, store]);


    const handleFormSubmit = (formId: string, data: Record<string, string | number | boolean>) => {
        handleSendMessage({ formId, data });
    };

    const handleTextSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const text = inputRef.current?.value || userInput;
        if (text.trim()) {
            handleSendMessage(text.trim());
        }
    };

    const handleConfirmation = (e: React.MouseEvent, toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall | undefined, msgId: number) => {
        e.preventDefault();
        // Remove confirmation from the message so buttons disappear
        const newHistory = store.chatHistory.map(m => m.id === msgId ? { ...m, requiresConfirmation: undefined } : m);
        store.setChatHistory(newHistory);
        handleSendMessage('User confirmed action.', toolCall);
    };


    return (
        <div className="flex flex-col h-full min-h-0">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 p-4">
                {store.chatHistory.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''} ${msg.role === 'system' ? 'justify-center' : ''}`}>
                         {msg.role === 'assistant' && (
                            <div className="w-6 h-6 rounded-full bg-brand-primary flex-shrink-0 flex items-center justify-center text-white font-bold text-xs">
                                <Bot size={14}/>
                            </div>
                        )}
                        {msg.role === 'user' && !msg.content.startsWith('User submitted form data:') && (
                            <div className="w-6 h-6 rounded-full bg-brand-surface flex-shrink-0 flex items-center justify-center text-brand-text-primary font-bold text-xs border border-brand-border">
                                <User size={14}/>
                            </div>
                        )}

                        {(!msg.content.startsWith('User submitted form data:')) && (
                          <div className={`max-w-[280px] p-3 rounded-lg ${
                              msg.role === 'user' ? 'bg-brand-primary text-white' :
                              msg.role === 'system' ? 'bg-brand-bg/50 text-brand-text-secondary italic text-xs w-full text-center' :
                              'bg-brand-bg'
                          }`}>
                              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              {msg.plan && <AgentPlan plan={msg.plan} />}
                              {msg.form && <AgentForm form={msg.form} onSubmit={(data) => handleFormSubmit(msg.form!.id, data)} />}
                              {msg.requiresConfirmation && (
                                  <div className="mt-3 flex items-center justify-end gap-2">
                                      <button onClick={() => {
                                          const newHistory = store.chatHistory.map(m => m.id === msg.id ? { ...m, requiresConfirmation: undefined } : m);
                                          store.setChatHistory(newHistory);
                                      }} className="bg-brand-surface border border-brand-border text-brand-text-primary font-medium py-1 px-3 rounded-lg hover:bg-brand-border text-xs">Cancel</button>
                                      <button onClick={(e) => handleConfirmation(e, msg.requiresConfirmation?.tool_call, msg.id)} className="bg-brand-primary text-white font-medium py-1 px-3 rounded-lg hover:bg-brand-accent text-xs">Proceed</button>
                                  </div>
                              )}
                          </div>
                        )}
                    </div>
                ))}
            </div>
             <form onSubmit={handleTextSubmit} className="p-4 border-t border-brand-border flex items-center gap-3">
                <input
                    ref={inputRef}
                    type="text"
                    defaultValue={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={isLoading}
                    className="flex-1 bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 text-sm"
                />
                <button type="submit" disabled={!userInput.trim() && !inputRef.current?.value.trim() || isLoading} className="p-2 bg-brand-primary rounded-full text-white hover:bg-brand-accent disabled:bg-brand-secondary disabled:cursor-not-allowed flex-shrink-0">
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
};


const InfluencerOSAssistantCard: React.FC = () => {
    const { isAssistantOpen, openAssistant, closeAssistant, assistantInitialCommand } = useStore();
    const [isBriefingShown, setIsBriefingShown] = useState(true);

    // When the assistant is opened with a command, switch to chat view immediately
    useEffect(() => {
        if (assistantInitialCommand) {
            setIsBriefingShown(false);
        }
    }, [assistantInitialCommand]);

    // Reset to briefing view when the assistant is closed
    useEffect(() => {
        if (!isAssistantOpen) {
            setIsBriefingShown(true);
        }
    }, [isAssistantOpen]);

    if (!isAssistantOpen) {
        return (
            <button
                onClick={() => openAssistant()}
                className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-[size:400%_400%] bg-[linear-gradient(135deg,var(--color-insight)_0%,var(--color-primary)_50%,var(--color-insight)_100%)] animate-liquid-pan flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                aria-label="Open AI Assistant"
            >
                <Bot size={28} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 z-50 w-96 h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] flex flex-col futuristic-border bg-brand-surface rounded-xl animate-page-enter">
            {/* Close Button - Always Visible */}
            <button
                onClick={closeAssistant}
                className="absolute -top-4 -right-4 z-20 w-8 h-8 rounded-full bg-brand-surface border-2 border-brand-border flex items-center justify-center text-brand-text-secondary hover:text-brand-text-primary shadow-lg hover:scale-110 transition-all"
                aria-label="Close AI Assistant"
            >
                <X size={16} />
            </button>

            {/* AI Avatar - Always Visible */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
                <div className="relative w-12 h-12">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-insight flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        <Bot size={24}/>
                    </div>
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-brand-surface" />
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex flex-col h-full mt-8">
                {isBriefingShown ? (
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="text-center mb-6">
                            <h2 className="font-bold text-brand-text-primary text-lg mb-1">AI Assistant</h2>
                            <p className="text-sm text-brand-text-secondary">Ready to help</p>
                        </div>
                        <BriefingSection />
                        <button
                            onClick={() => setIsBriefingShown(false)}
                            className="mt-4 w-full bg-brand-primary text-white font-semibold py-2 rounded-lg hover:bg-brand-accent transition-colors"
                        >
                            Start Chat
                        </button>
                    </div>
                ) : (
                    <ChatSection initialCommand={assistantInitialCommand} />
                )}
            </div>
        </div>
    );
};

export default InfluencerOSAssistantCard;
