# Personal Finance Visualizer - Stage 1

A comprehensive web application for tracking and visualizing personal financial transactions, built with Next.js, React, and shadcn/ui.

## Features

### ✅ Transaction Management
- **CRUD Operations**: Add, edit, and delete transactions
- **Form Validation**: Comprehensive validation for all required fields
- **Data Fields**: Amount (positive numbers only), Date (date picker), Description (text input)
- **Error Handling**: User-friendly error messages and notifications

### ✅ Transaction List View
- **Tabular Display**: Clean table format showing Date, Description, and Amount
- **Sorting**: Click column headers to sort by Date, Description, or Amount (ascending/descending)
- **Responsive Design**: Adapts to different screen sizes
- **Action Buttons**: Edit and delete buttons for each transaction
- **Confirmation Dialogs**: Safe deletion with confirmation prompts

### ✅ Monthly Expenses Chart
- **Bar Chart Visualization**: Monthly expense breakdown for the current year
- **Interactive Tooltips**: Hover to see exact amounts
- **Responsive Charts**: Adapts to different screen sizes
- **Empty State**: Helpful message when no data is available

### ✅ UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktop
- **Dark/Light Mode**: Automatic theme support
- **Loading States**: Smooth loading indicators
- **Error States**: Comprehensive error handling with user feedback
- **Notifications**: Toast notifications for all user actions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date formatting and manipulation
- **Backend**: Next.js API Routes
- **Database**: MongoDB (with in-memory demo data for development)
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (for production)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Environment Setup**
   Create a \`.env.local\` file in the root directory:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   # or your MongoDB Atlas connection string
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database and collections automatically

#### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the \`MONGODB_URI\` in your \`.env.local\` file

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── transactions/
│   │       ├── route.ts          # GET, POST /api/transactions
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/transactions/[id]
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── monthly-chart.tsx         # Monthly expenses chart
│   ├── transaction-form.tsx      # Add/Edit transaction form
│   └── transaction-list.tsx      # Transaction table with sorting
├── lib/
│   ├── mongodb.ts               # MongoDB connection and operations
│   └── utils.ts                 # Utility functions
└── README.md
\`\`\`

## API Endpoints

### Transactions
- \`GET /api/transactions\` - Fetch all transactions
- \`POST /api/transactions\` - Create a new transaction
- \`PUT /api/transactions/[id]\` - Update a transaction
- \`DELETE /api/transactions/[id]\` - Delete a transaction

### Request/Response Examples

**Create Transaction (POST /api/transactions)**
\`\`\`json
{
  "amount": 45.99,
  "date": "2024-01-15T00:00:00.000Z",
  "description": "Grocery shopping"
}
\`\`\`

**Response**
\`\`\`json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 45.99,
  "date": "2024-01-15T00:00:00.000Z",
  "description": "Grocery shopping",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
\`\`\`

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application is compatible with any Node.js hosting platform:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Development Notes

### Demo Data
The application includes sample transactions for demonstration purposes. In production, these would be replaced with actual MongoDB operations.

### Database Schema
\`\`\`javascript
{
  _id: ObjectId,
  amount: Number,        // Positive number, required
  date: String,          // ISO date string, required
  description: String,   // Text description, required
  createdAt: String      // ISO timestamp, auto-generated
}
\`\`\`

### Form Validation
- **Amount**: Must be a positive number
- **Date**: Required, uses date picker
- **Description**: Required, trimmed of whitespace

## Future Enhancements (Stage 2+)
- User authentication and authorization
- Categories and tags for transactions
- Budget tracking and alerts
- Export functionality (CSV, PDF)
- Advanced analytics and insights
- Recurring transaction support
- Multi-currency support

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

**Built with ❤️ using Next.js, React, and shadcn/ui**
\`\`\`
