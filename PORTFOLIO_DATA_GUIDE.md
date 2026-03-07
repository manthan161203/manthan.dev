# Portfolio Data Management Guide

## Overview

Your portfolio data is now **centralized in a single JSON file** (`portfolio.json`). This makes it easy to:
- ✅ Update all portfolio information in one place
- ✅ Automatically sync data with the Gemini chatbot
- ✅ Reuse data across different components
- ✅ Maintain consistency across your portfolio

## File Structure

### `portfolio.json`
Located at: `/src/portfolio.json`

Contains all your portfolio data:
- **personalInfo** - Your name, email, links, bio
- **typewriterPhrases** - Hero section rotating text
- **stats** - Key statistics  
- **experiences** - Work history
- **projects** - Your projects
- **skillCategories** - Technical skills by category
- **education** - Educational background

### `data.js`
Located at: `/src/data.js`

Now serves as a **data integration layer** that:
- Imports data from `portfolio.json`
- Exports all data objects for components to use
- **Dynamically generates** `GEMINI_CONTEXT` from JSON data
- Exports `portfolioDataJSON` for direct JSON access

## How to Update Your Portfolio

### 1. **Update in JSON Only**
Edit `/src/portfolio.json` with any changes. Changes automatically:
- Update all React components
- Update the chatbot context
- No need to edit multiple files

### 2. **Example: Add a New Project**
Edit `portfolio.json` and add to the `projects` array:
```json
{
  "title": "Your New Project",
  "subtitle": "Short description",
  "description": "Longer description...",
  "tags": ["Python", "FastAPI"],
  "category": "AI / Automation",
  "color": "#60a5fa",
  "github": "https://github.com/yourlink",
  "featured": true,
  "icon": "🚀"
}
```

### 3. **Example: Update Skills**
Edit the `skillCategories` array in `portfolio.json`:
```json
{
  "name": "AI / ML",
  "skills": ["LLMs", "RAG Systems", "Your New Skill"]
}
```

## How Components Use the Data

All components import from `data.js`:

```jsx
import { 
  personalInfo, 
  experiences, 
  projects, 
  skillCategories 
} from '../data';
```

### Example: Projects Component
```jsx
import { projects } from '../data';

export default function Projects() {
  return (
    <div>
      {projects.map(project => (
        <div key={project.title}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## How Chatbot Uses the Data

The **Gemini Chat** automatically uses your data through:

```javascript
import { GEMINI_CONTEXT } from '../data';
```

`GEMINI_CONTEXT` is **dynamically generated** from `portfolio.json` and includes:
- All your experience details
- Project descriptions
- Skills
- Contact information
- Bio and background

The chatbot uses this context to answer questions about you accurately.

## Export Objects Available

From `data.js`, you have access to:

| Export | Type | Purpose |
|--------|------|---------|
| `personalInfo` | Object | Your basic info |
| `typewriterPhrases` | Array | Hero text phrases |
| `stats` | Array | Key stats |
| `experiences` | Array | Work experience |
| `projects` | Array | Your projects |
| `skillCategories` | Array | Skills grouped by type |
| `education` | Array | Education history |
| `GEMINI_CONTEXT` | String | Auto-generated chatbot context |
| `portfolioDataJSON` | Object | Raw JSON data access |

## Best Practices

✅ **Do:**
- Edit `portfolio.json` for all content changes
- Use meaningful icons and colors for visual consistency
- Keep descriptions concise but informative
- Update experience/projects as they change

❌ **Don't:**
- Edit hardcoded data in component files
- Manually update `GEMINI_CONTEXT` (it's auto-generated)
- Duplicate data across multiple files

## Future Uses

You can easily extend this by:

1. **Export as PDF Resume** - Generate from JSON data
2. **Multi-language Support** - Add language versions to JSON
3. **API Integration** - Fetch from your own backend
4. **Database Sync** - Store JSON structure in database
5. **Dynamic Site Generator** - Use JSON to generate static pages

---

**Need to make changes?** Just edit `portfolio.json` and your entire portfolio updates! 🚀
