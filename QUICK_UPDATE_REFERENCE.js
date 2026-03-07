/*
Quick Reference: How to Update Your Portfolio

File to edit: /src/portfolio.json

============================================
1. UPDATE YOUR PERSONAL INFO
============================================

"personalInfo": {
  "name": "Your Full Name",
  "email": "your.email@gmail.com",
  "phone": "+91-XXXXXXXXXX",
  "github": "https://github.com/yourprofile",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "bio": "Your professional bio..."
}

============================================
2. ADD A NEW EXPERIENCE
============================================

Add to "experiences" array:

{
  "company": "Company Name",
  "role": "Your Role",
  "duration": "Month Year – Month Year",
  "location": "City, Country",
  "type": "Full-time / Internship",
  "color": "#60a5fa",
  "highlights": [
    "Achievement 1",
    "Achievement 2",
    "Achievement 3"
  ]
}

============================================
3. ADD A NEW PROJECT
============================================

Add to "projects" array:

{
  "title": "Project Name",
  "subtitle": "Short tagline",
  "description": "Detailed description of the project...",
  "tags": ["Tech1", "Tech2", "Tech3"],
  "category": "AI / Automation",
  "color": "#60a5fa",
  "github": "https://github.com/yourlink",
  "featured": true,
  "icon": "🚀"
}

============================================
4. ADD A NEW SKILL
============================================

Find your skill category and add to "skills" array:

"skillCategories": [
  {
    "name": "AI / ML",
    "color": "#60a5fa",
    "icon": "🧠",
    "skills": [
      "LLMs",
      "RAG Systems",
      "Your New Skill"
    ]
  }
]

============================================
5. ADD EDUCATION
============================================

Add to "education" array:

{
  "school": "University Name",
  "degree": "Degree Name",
  "year": "2025",
  "grade": "Your GPA/Grade",
  "location": "City, Country"
}

============================================
6. UPDATE HERO TYPEWRITER PHRASES
============================================

"typewriterPhrases": [
  "Your Title 1",
  "Your Title 2",
  "Your Title 3"
]

============================================
7. UPDATE STATS
============================================

"stats": [
  { "value": "10+", "label": "Projects Built" },
  { "value": "3+", "label": "Companies" },
  { "value": "2+", "label": "Years Coding" }
]

============================================
8. ADD/UPDATE ARTICLES
============================================

Add to "articles" array:

{
  "id": 5,
  "title": "Your Article Title",
  "subtitle": "Short description",
  "description": "Detailed description...",
  "category": "AI/ML",
  "icon": "📚",
  "date": "March 2025",
  "readTime": "5 min read",
  "tags": ["Tag1", "Tag2"],
  "link": "https://medium.com/@yourprofile",
  "color": "#60a5fa"
}

============================================
9. UPDATE RESUME LINK
============================================

"resume": {
  "url": "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing",
  "fileName": "YourName_Resume.pdf"
}

============================================
EXAMPLE COLORS (hex codes)
============================================

Blue:    #60a5fa
Purple:  #a78bfa
Green:   #34d399
Orange:  #fb923c
Pink:    #f472b6
Yellow:  #fbbf24

============================================
EXAMPLE EMOJIS FOR PROJECTS
============================================

🚀 Rocket
🤖 Robot
💡 Idea
🔧 Tools
📊 Chart
🏥 Medical
💻 Computer
🧠 Brain
🎯 Target
⚡ Lightning
📱 Mobile
🌐 Web
🎨 Art
🔐 Security
📚 Books
🎬 Video

============================================
AFTER EDITING JSON:
============================================

1. Save portfolio.json
2. All components auto-update
3. Chatbot context auto-updates
4. Refresh browser to see changes
5. No code changes needed!

============================================
FOR CUSTOM COLORS:
============================================

Use https://htmlcolorcodes.com/ to pick colors
Then use the HEX value (e.g., "#FF5733")

*/
