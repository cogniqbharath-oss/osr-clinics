# OSR Clinics Website

A premium, modern website for OSR Clinics - a multi-location mental health practice serving Ontario, Canada.

## 🏥 About OSR Clinics

OSR Clinics provides comprehensive mental health services including:
- **ADHD Assessments** - In-depth evaluations by experienced psychologists
- **Individual Therapy** - For anxiety, depression, trauma, and personal growth
- **qEEG Neurofeedback** - Non-medicinal brain training
- **WSIB Mental Health** - Support for work-related injuries
- **Online Therapy** - Virtual appointments across Ontario
- **Couples & Family Therapy** - Relationship and communication support

## 📍 Locations

- **Windsor**: 245 Tecumseh Rd W, ON N8X 1G2 | (519) 419-1484
- **London**: 111 Waterloo St, Unit 610, ON N6B 2M4 | (519) 850-0464
- **Toronto**: 3335 Yonge St, Unit 403, ON M4N | (226) 908-3452
- **Chatham**: 41 Grand Ave West, ON N7L 1B4
- **Sarnia**: 429 Exmouth St, Unit 209, ON N7T 5P1
- **Kitchener** & **Virtual** appointments available

## 🚀 Features

### Premium Design
- Calming teal/blue color scheme optimized for mental health services
- Smooth scroll animations and transitions
- Fully responsive mobile-first design
- Professional typography (Inter + Crimson Pro)

### AI Chatbot
- Intelligent responses about services, booking, and locations
- Handles common questions about ADHD, therapy, neurofeedback
- Provides booking links and contact information
- Compassionate, professional tone

### SEO Optimized
- Semantic HTML5 structure
- Meta descriptions and Open Graph tags
- Proper heading hierarchy
- Fast loading performance

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Custom styling with CSS variables
- **Vanilla JavaScript** - No dependencies
- **Python** - Local development server
- **Cloudflare Workers** - Production chatbot API

## 📦 Project Structure

```
osr-clinics/
├── index.html              # Main HTML structure
├── style.css               # Premium styling
├── script.js               # Interactive functionality
├── server.py               # Local development server
├── functions/
│   └── api/
│       └── worker.js       # Cloudflare Worker for chatbot
└── assets/                 # Images and media
```

## 🏃 Running Locally

1. **Start the server**:
   ```bash
   python server.py
   ```

2. **Open in browser**:
   ```
   http://localhost:8001
   ```

3. **Test the chatbot**:
   - Click the floating chat button in the bottom right
   - Ask questions about services, booking, or locations
   - The local server provides intelligent keyword-based responses

## 🌐 Deployment to Cloudflare Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to Cloudflare Dashboard → Pages
   - Connect your GitHub repository
   - Build settings: None (static site)
   - Deploy

3. **Set Environment Variable**:
   - In Cloudflare Pages settings
   - Add environment variable: `GEMINI_API_KEY`
   - Value: Your Google Gemini API key

4. **Chatbot will automatically work** via the `/api/chat` endpoint

## 🎨 Design Philosophy

### Color Palette
- **Primary**: `#0c0537` (Deep Navy)
- **Accent**: `#38B2AC` (Bright teal)
- **Text**: `#1A202C` (Dark charcoal)
- **Background**: `#F7FAFC` (Soft gray)

### Typography
- **Headings**: Crimson Pro (serif, professional)
- **Body**: Inter (sans-serif, readable)

### User Experience
- Compassionate, welcoming design
- Easy navigation to booking and contact
- Clear service descriptions
- Trust-building elements (credentials, locations)
- Accessibility-focused

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🤖 Chatbot Features

### Local Development
- Keyword-based responses
- Handles common questions
- Provides booking links and phone numbers

### Production (Cloudflare Worker)
- Powered by Google Gemini AI
- Natural language understanding
- Comprehensive knowledge of all services
- Compassionate, professional responses
- Crisis support redirection

## 📞 Contact Information

- **Website**: https://www.osrclinics.com
- **Booking**: https://www.osrclinics.com/book
- **Email**: chatham@osrclinics.com
- **Facebook**: https://www.facebook.com/OSRClinics

## 📄 License

This is a demo website created for OSR Clinics. All rights reserved.

## 🙏 Credits

- Design & Development: Custom premium build
- Fonts: Google Fonts (Inter, Crimson Pro)
- Icons: Font Awesome 6.4.0
- Images: Unsplash (placeholder images)

---

**Hours**: Monday - Friday, 9:00 AM - 9:00 PM
**Free Initial Consultations Available**
