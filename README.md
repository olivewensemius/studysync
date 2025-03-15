Team:
- Jackson Nguyen
- Amogh Sharma
- Jeremiah Saemo
- Olivia Wensemius

# StudySync

StudySync is a collaborative learning platform designed to help students achieve academic excellence through minimalist design and powerful tools.

## Features

### Authentication
- Email/password login and registration
- Social login with Google and Discord
- Password reset functionality

### Study Sessions
- Create and schedule study sessions with detailed information
- Track topics, resources, and participants
- Join live study sessions
- View session history and analytics

### Flashcards
- Create and manage flashcard sets by subject
- Track mastery progress of individual cards
- Generate flashcards using AI
- Import flashcards from notes

### Study Groups
- Create and join study groups
- Collaborate with peers on challenging subjects
- Manage group membership and discussions
- Share resources within groups

### Analytics Dashboard
- Track study time and habits
- View subject distribution
- Monitor weekly activity and progress
- Analyse focus time and efficiency
- Export detailed reports

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Supabase
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom component library with Framer Motion animations
- **Data Visualization:** Recharts
- **Authentication:** Supabase Auth
- **Form Handling:** Formik with Yup validation
- **PDF Processing:** jsPDF, PDF.js
- **Document Processing:** Mammoth
- **AI Integration:** Gemini AI
- **Real-time Communication:** Socket.io

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file with your Supabase credentials and Gemini API key
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues


## License

MIT