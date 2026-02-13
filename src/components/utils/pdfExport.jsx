import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportResumeToPDF = async (resumeData) => {
  // Create a temporary container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '816px'; // 8.5 inches at 96 DPI
  container.style.backgroundColor = 'white';
  document.body.appendChild(container);

  // Dynamically import and render the appropriate template
  const { default: Template } = await import(
    `@/components/resume/templates/${
      resumeData.template.charAt(0).toUpperCase() + resumeData.template.slice(1)
    }Template.js`
  );

  // Create React root and render
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(container);
  
  return new Promise((resolve, reject) => {
    root.render(
      Template({ data: resumeData })
    );

    // Wait for rendering
    setTimeout(async () => {
      try {
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(
          imgData,
          'PNG',
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.save(`${resumeData.title || 'Resume'}.pdf`);

        // Cleanup
        root.unmount();
        document.body.removeChild(container);
        resolve();
      } catch (error) {
        root.unmount();
        document.body.removeChild(container);
        reject(error);
      }
    }, 1000);
  });
};