import React from 'react';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

export default function ResumePreview({ data }) {
  const templates = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    executive: ExecutiveTemplate,
  };

  const Template = templates[data.template] || ProfessionalTemplate;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-[8.5/11] overflow-y-auto">
        <Template data={data} />
      </div>
    </div>
  );
}