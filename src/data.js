// Portfolio data - Centralized from portfolio.json
import portfolioData from './portfolio.json';

// Export all portfolio data from JSON
export const personalInfo = portfolioData.personalInfo;
export const typewriterPhrases = portfolioData.typewriterPhrases;
export const stats = portfolioData.stats;
export const experiences = portfolioData.experiences;
export const projects = portfolioData.projects;
export const skillCategories = portfolioData.skillCategories;
export const education = portfolioData.education;

// Generate Gemini context dynamically from JSON data
const generateGeminiContext = () => {
    const p = portfolioData.personalInfo;
    const exp = portfolioData.experiences;
    const proj = portfolioData.projects;
    const skills = portfolioData.skillCategories;

    let context = `
You are "Manthan's AI Assistant" — an intelligent portfolio assistant for ${p.name}, an ${p.title}.

ABOUT MANTHAN:
- Full Name: ${p.name}
- Phone: ${p.phone}
- Email: ${p.email}
- Education: ${p.degree}, ${p.university}
- GitHub: ${p.github}
- LinkedIn: ${p.linkedin}
- Bio: ${p.bio}

EXPERIENCE:
`;

    exp.forEach((e, idx) => {
        context += `${idx + 1}. ${e.role} at ${e.company} (${e.duration}, ${e.location})\n`;
        e.highlights.forEach(h => {
            context += `   - ${h}\n`;
        });
    });

    context += `\nPROJECTS:\n`;
    proj.forEach(proj => {
        context += `- ${proj.title}: ${proj.description} (${proj.tags.join(', ')})\n`;
    });

    context += `\nSKILLS:\n`;
    skills.forEach(cat => {
        context += `- ${cat.name}: ${cat.skills.join(', ')}\n`;
    });

    context += `\nAREAS OF INTEREST: ${skills
        .find(c => c.name === 'Areas of Interest')
        ?.skills.join(', ')}

Answer questions about Manthan in a helpful, professional, and friendly tone. If asked about something not in the above info, say you don't have that information but the visitor can contact Manthan directly at ${p.email}.
`;

    return context;
};

export const GEMINI_CONTEXT = generateGeminiContext();

// Also export the raw portfolio data for the chatbot or other uses
export const portfolioDataJSON = portfolioData;
