import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import useStore from '../hooks/useStore';
import { Download, Loader2, FilePenLine } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Contract } from '../types';
import Image from 'next/image';



const ContractDetail: React.FC = () => {
    const { contractId } = useParams<{ contractId: string }>();
    const { getContract, getInfluencer, getBrand, updateContract } = useStore();
    const contractContentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const originalContract = getContract(contractId!);
    const [editedContract, setEditedContract] = useState<Contract | null>(originalContract || null);

    useEffect(() => {
        setEditedContract(originalContract || null);
        setIsEditing(false); // Reset editing mode when navigating between contracts
    }, [originalContract]);


    const handleDownloadPdf = async () => {
        const element = contractContentRef.current;
        if (!element || !editedContract) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = position - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            pdf.save(`Contract-${editedContract.title.replace(/\s/g, '_')}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editedContract) return;
        const { name, value, type } = e.target;
        const isNumber = type === 'number';
        setEditedContract({ ...editedContract, [name]: isNumber ? parseFloat(value) || 0 : value });
    };

    const handleClauseChange = (index: number, newContent: string) => {
        if (!editedContract) return;
        const newClauses = [...editedContract.clauses];
        newClauses[index] = { ...newClauses[index], content: newContent };
        setEditedContract({ ...editedContract, clauses: newClauses });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedContract) return;
        const { name, value } = e.target;
        setEditedContract({ ...editedContract, [name]: value ? new Date(value) : undefined });
    };

    const handleSave = () => {
        if (editedContract) {
            updateContract(editedContract.id, editedContract);
            setIsEditing(false);
        }
    };
    
    const handleCancel = () => {
        setEditedContract(originalContract || null);
        setIsEditing(false);
    };


    if (!originalContract || !editedContract) {
        return <div className="text-center text-brand-text-primary">Contract not found.</div>;
    }

    const influencer = getInfluencer(originalContract.influencerId);
    const brand = getBrand(originalContract.brandId);

    const formatDate = (date?: Date) => date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
    const formatDateForInput = (date?: Date) => date ? new Date(date).toISOString().split('T')[0] : '';
    const formatCurrency = (amount: number) => amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
        <div className="space-y-8">
            <div className="futuristic-border bg-brand-surface rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-grow">
                        {isEditing ? (
                            <input
                                type="text"
                                name="title"
                                value={editedContract.title}
                                onChange={handleInputChange}
                                className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-3xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        ) : (
                             <h1 className="text-3xl font-bold text-brand-text-primary">{editedContract.title}</h1>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-2 text-brand-text-secondary">
                             <p><span className="font-semibold">Brand:</span> <Link href={`/brands/${brand?.id}`} className="text-brand-primary hover:underline">{brand?.name}</Link></p>
                             <p><span className="font-semibold">Influencer:</span> <Link href={`/influencers/${influencer?.id}`} className="text-brand-primary hover:underline">{influencer?.name}</Link></p>
                        </div>
                    </div>
                    {!isEditing ? (
                         <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors py-1 px-3 rounded-lg hover:bg-brand-bg/50">
                            <FilePenLine className="w-4 h-4"/> Edit
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                           <button onClick={handleSave} className="bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent">Save Changes</button>
                           <button onClick={handleCancel} className="bg-brand-surface border border-brand-border text-brand-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-brand-border">Cancel</button>
                        </div>
                    )}
                </div>
                <div className="mt-6 pt-6 border-t border-brand-border grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-brand-text-secondary mb-1">Contract Value</p>
                        {isEditing ? (
                             <input type="number" name="value" value={editedContract.value} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        ) : ( <p className="text-xl font-bold text-brand-text-primary">{formatCurrency(editedContract.value)}</p> )}
                    </div>
                     <div>
                        <p className="text-sm text-brand-text-secondary mb-1">Status</p>
                         {isEditing ? (
                            <select name="status" value={editedContract.status} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary">
                                <option>Draft</option><option>Pending</option><option>Signed</option><option>Expired</option>
                            </select>
                        ) : (<p className="text-xl font-bold text-brand-text-primary">{editedContract.status}</p> )}
                    </div>
                     <div>
                        <p className="text-sm text-brand-text-secondary mb-1">Date Signed</p>
                         {isEditing ? (
                            <input type="date" name="dateSigned" value={formatDateForInput(editedContract.dateSigned)} onChange={handleDateChange} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                        ) : ( <p className="text-xl font-bold text-brand-text-primary">{formatDate(editedContract.dateSigned)}</p> )}
                    </div>
                    <div>
                        <p className="text-sm text-brand-text-secondary mb-1">End Date</p>
                         {isEditing ? (
                            <input type="date" name="endDate" value={editedContract.endDate ? new Date(editedContract.endDate).toISOString().split('T')[0] : ''} onChange={handleInputChange} className="w-full bg-brand-bg border border-brand-border rounded-lg px-3 py-2 text-xl font-bold text-brand-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                         ) : ( <p className="text-xl font-bold text-brand-text-primary">{editedContract.endDate ? new Date(editedContract.endDate).toLocaleDateString() : 'N/A'}</p> )}
                    </div>
                </div>
            </div>

            <div className="futuristic-border bg-brand-bg rounded-xl overflow-hidden h-[calc(100vh-24rem)] flex flex-col">
                 <header className="flex-shrink-0 bg-brand-surface p-4 flex justify-between items-center border-b border-brand-border">
                    <h2 className="font-bold text-brand-text-primary text-lg">Contract Preview</h2>
                    <button onClick={handleDownloadPdf} disabled={isDownloading} className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent transition-colors disabled:bg-brand-secondary disabled:cursor-wait">
                        {isDownloading ? (<><Loader2 className="w-5 h-5 animate-spin" />Generating...</>) : (<><Download className="w-5 h-5" />Download PDF</>)}
                    </button>
                </header>
                
                <main className="flex-grow overflow-y-auto p-8 bg-gray-900/50">
                    <div ref={contractContentRef} className="bg-white text-gray-800 p-16 w-[210mm] min-h-[297mm] mx-auto shadow-2xl font-['Georgia',_serif]">
                        <header className="flex justify-between items-center pb-8 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-gray-600">InfluencerOS</h1>
                            {brand && <Image src={brand.logoUrl} alt={brand.name} className="h-12 w-auto object-contain" width={48} height={48} />}
                        </header>
                        <section className="text-center my-12"><h2 className="text-3xl font-bold tracking-wider uppercase">Influencer Marketing Agreement</h2><p className="text-gray-500 mt-2">{editedContract.title}</p></section>
                        <section className="my-8 text-sm">
                            <p className="mb-4">This Influencer Marketing Agreement (&quot;Agreement&quot;) is made and entered into as of <span className="font-bold">{formatDate(editedContract.dateSigned)}</span> by and between:</p>
                            <div className="grid grid-cols-2 gap-8">
                                <div><h3 className="font-bold text-base mb-2">The Brand</h3><p>{brand?.name || 'N/A'}</p><p>{brand?.website || 'N/A'}</p></div>
                                <div><h3 className="font-bold text-base mb-2">The Influencer</h3><p>{influencer?.name || 'N/A'}</p><p>{influencer?.platform || 'N/A'} Creator</p></div>
                            </div>
                        </section>
                        
                        {editedContract.clauses.map((clause, index) => (
                            <section key={index} className="my-8">
                                <h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">{index + 1}. {clause.title}</h3>
                                {isEditing ? (
                                     <textarea 
                                        value={clause.content}
                                        onChange={(e) => handleClauseChange(index, e.target.value)}
                                        rows={5} 
                                        className="w-full text-sm text-gray-700 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-['Inter',_sans-serif]"
                                    />
                                ) : (
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{clause.content}</p>
                                )}
                            </section>
                        ))}

                        <section className="my-8"><h3 className="font-bold text-lg mb-4 pb-2 border-b border-gray-200">{editedContract.clauses.length + 1}. Term & Termination</h3><p className="text-sm text-gray-700">This Agreement shall commence on {formatDate(editedContract.dateSigned)} and continue until {editedContract.endDate ? new Date(editedContract.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'the completion of deliverables'}.</p></section>
                        <footer className="pt-24 mt-auto"><div className="grid grid-cols-2 gap-16 text-sm"><div><div className="border-t border-gray-400 pt-2"><p className="font-bold">{brand?.name}</p><p className="text-gray-500">Authorized Signature</p></div></div><div><div className="border-t border-gray-400 pt-2"><p className="font-bold">{influencer?.name}</p><p className="text-gray-500">Signature</p></div></div></div></footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ContractDetail;