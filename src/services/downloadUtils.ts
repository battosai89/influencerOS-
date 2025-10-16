// services/downloadUtils.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts an array of objects into a CSV string.
 * @param data The array of objects to convert.
 * @returns A string in CSV format.
 */
const convertToCSV = (data: Record<string, unknown>[]): string => {
    if (!data || data.length === 0) {
        return '';
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
        const values = headers.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

/**
 * Triggers a browser download for a CSV file.
 * @param filename The name of the file to be downloaded.
 * @param data The array of objects to be included in the CSV.
 */
export const exportToCsv = (filename: string, data: Record<string, unknown>[]) => {
    const csvString = convertToCSV(data);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


/**
 * Exports a specific HTML element to a PDF file.
 * @param element The HTML element to be exported.
 * @param filename The name of the output PDF file.
 */
export const exportPageToPdf = async (element: HTMLElement, filename: string): Promise<void> => {
    if (!element) {
        console.error("Element to export not found.");
        return;
    }
    
    // Temporarily set the background to white for better PDF rendering
    // const originalBg = document.body.style.backgroundColor;
    element.style.backgroundColor = 'white';
    
    try {
        const canvas = await html2canvas(element, { 
            scale: 2, 
            useCORS: true, 
            backgroundColor: '#ffffff' 
        });
        
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
        pdf.save(filename);
    } catch (error) {
        console.error("Error generating PDF:", error);
    } finally {
        // Restore original background
        element.style.backgroundColor = '';
    }
};
