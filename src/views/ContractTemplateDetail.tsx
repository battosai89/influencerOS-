

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import useStore from '../hooks/useStore';
import { FilePenLine } from 'lucide-react';
import { ContractTemplate } from '../types';

const ContractTemplateDetail: React.FC = () => {
    const { templateId } = useParams<{ templateId: string }>();
    const { getContractTemplate, updateContractTemplate } = useStore();
    
    const originalTemplate = getContractTemplate(templateId!);
    const [editedTemplate, setEditedTemplate] = useState<ContractTemplate | null>(originalTemplate || null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setEditedTemplate(originalTemplate || null);
        setIsEditing(false);
    }, [originalTemplate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!editedTemplate) return;
        const { name, value } = e.target;
        setEditedTemplate({ ...editedTemplate, [name]: value });
    };

    const handleClauseChange = (index: number, field: 'title' | 'content', value: string) => {
        if (!editedTemplate) return;
        const newClauses = [...editedTemplate.clauses];
        newClauses[index] = { ...newClauses[index], [field]: value };
        setEditedTemplate({ ...editedTemplate, clauses: newClauses });
    };

    const handleSave = () => {
        if (editedTemplate) {
            updateContractTemplate(editedTemplate.id, editedTemplate);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedTemplate(originalTemplate || null);
        setIsEditing(false);
    };

    if (!originalTemplate || !editedTemplate) {
        return <div className="text-center text-brand-text-primary">Template not found.</div>;
    }

    return (
        <div className="space-y-8">
             <div className="flex items-center justify-between">
                <button onClick={() => window.location.href = '/contracts'} className="text-brand-text-secondary hover:text-brand-text-primary">
                    &larr; Back to Contracts
                </button>
            </div>
            <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={editedTemplate.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-3xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                                <textarea
                                    name="description"
                                    value={editedTemplate.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-lg text-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-bold text-brand-text-primary">{editedTemplate.name}</h1>
                                <p className="text-lg text-brand-text-secondary mt-1 max-w-3xl">{editedTemplate.description}</p>
                            </div>
                        )}
                    </div>
                    {!isEditing ? (
                         <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors py-2 px-4 rounded-lg hover:bg-brand-bg/50 flex-shrink-0">
                            <FilePenLine className="w-4 h-4"/> Edit Template
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 flex-shrink-0">
                           <button onClick={handleSave} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent">Save Changes</button>
                           <button onClick={handleCancel} className="bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border">Cancel</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="futuristic-border bg-brand-bg rounded-xl overflow-hidden h-[calc(100vh-24rem)] flex flex-col">
                 <header className="flex-shrink-0 bg-brand-surface p-4 flex justify-between items-center border-b border-brand-border">
                    <h2 className="font-bold text-brand-text-primary text-lg">Template Preview</h2>
                </header>
                
                <main className="flex-grow overflow-y-auto p-8 bg-gray-900/50">
                    <div className="bg-white text-gray-800 p-16 w-[210mm] min-h-[297mm] mx-auto shadow-2xl font-['Georgia',_serif]">
                        <header className="text-center mb-12">
                            <h2 className="text-3xl font-bold tracking-wider uppercase">Agreement Template</h2>
                            <p className="text-gray-500 mt-2">{editedTemplate.name}</p>
                        </header>
                        
                        {editedTemplate.clauses.map((clause, index) => (
                            <section key={index} className="my-8">
                                <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">
                                    {isEditing ? (
                                        <input 
                                            value={clause.title}
                                            onChange={(e) => handleClauseChange(index, 'title', e.target.value)}
                                            className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-['Inter',_sans-serif] font-bold"
                                        />
                                    ) : (
                                        `${index + 1}. ${clause.title}`
                                    )}
                                </h3>
                                {isEditing ? (
                                     <textarea 
                                        value={clause.content}
                                        onChange={(e) => handleClauseChange(index, 'content', e.target.value)}
                                        rows={5} 
                                        className="w-full text-sm text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-['Inter',_sans-serif]"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{clause.content}</p>
                                )}
                            </section>
                        ))}

                         <footer className="pt-12 mt-auto text-center">
                             <p className="text-xs text-gray-400 italic">This is a template. Final contract will include party details and signatures.</p>
                         </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContractTemplateDetail;
