# Personal Finance Visualizer

A comprehensive web application for tracking and visualizing personal financial transactions and budgets, built with Next.js, React, and shadcn/ui.

## Features

### ✅ Transaction Management

- **CRUD Operations**: Add, edit, and delete transactions
- **Form Validation**: Comprehensive validation for all required fields
- **Data Fields**: Amount (positive numbers only), Date (date picker), Description (text input), Category (dropdown selection)
- **Categories**: Pre-defined categories including Food, Transport, Utilities, Rent, Entertainment, Shopping, Healthcare, and Others
- **Error Handling**: User-friendly error messages and notifications

### ✅ Budget Management

- **Monthly Budgets**: Set and manage budgets by category and month
- **Budget Tracking**: Monitor spending against budgets
- **CRUD Operations**: Add, edit, and delete budgets
- **Budget vs Actual**: Compare planned vs actual spending
- **Validation**: Ensures budget amounts are positive numbers

### ✅ Dashboard & Analytics

- **Summary Cards**: Total expenses, monthly expenses, budget totals, transaction count, and active categories
- **Tabbed Interface**: Organized into Dashboard, Transactions, Budgets, and Analytics sections
- **Real-time Updates**: All data updates in real-time across components

### ✅ Data Visualizations

- **Monthly Expenses Chart**: Bar chart showing spending trends throughout the year
- **Category Pie Chart**: Visual breakdown of expenses by category with percentages
- **Budget vs Actual Chart**: Compare budgeted amounts with actual spending
- **Interactive Charts**: Hover tooltips with detailed information
- **Responsive Visualizations**: Charts adapt to different screen sizes

### ✅ Dashboard Components

- **Recent Transactions**: Quick view of the latest transactions
- **Top Categories**: Shows highest spending categories
- **Spending Insights**: Intelligent analysis of spending patterns and budget performance
- **Transaction List**: Full sortable table view with edit/delete actions
- **Budget List**: Comprehensive budget management interface

### ✅ UI/UX Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablets and desktop
- **Dark/Light Mode**: Automatic theme support
- **Loading States**: Smooth loading indicators
- **Error States**: Comprehensive error handling with user feedback
- **Toast Notifications**: Real-time feedback for all user actions
- **Modal Forms**: Clean overlay forms for adding/editing data
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date formatting and manipulation
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Next.js API Routes
- **Database**: MongoDB with full CRUD operations
- **Deployment**: Vercel-ready configuration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (for production)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/XploY04/personal-finance-visualizer.git
   cd personal-finance-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/finance_tracker
   # or your MongoDB Atlas connection string
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

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

```
├── app/
│   ├── api/
│   │   ├── budgets/
│   │   │   ├── route.ts          # GET, POST, PUT /api/budgets
│   │   │   └── [id]/
│   │   │       └── route.ts      # DELETE /api/budgets/[id]
│   │   └── transactions/
│   │       ├── route.ts          # GET, POST /api/transactions
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/transactions/[id]
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard with tabs
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── budget-form.tsx           # Budget creation/edit form
│   ├── budget-list.tsx           # Budget management interface
│   ├── budget-vs-actual-chart.tsx # Budget comparison chart
│   ├── category-pie-chart.tsx    # Category breakdown pie chart
│   ├── monthly-chart.tsx         # Monthly expenses bar chart
│   ├── recent-transactions.tsx   # Recent transactions widget
│   ├── spending-insights.tsx     # Spending analysis component
│   ├── top-categories.tsx        # Top spending categories widget
│   ├── transaction-form.tsx      # Transaction creation/edit form
│   └── transaction-list.tsx      # Transaction table with sorting
├── lib/
│   ├── mongodb.ts               # MongoDB connection and operations
│   └── utils.ts                 # Utility functions
├── hooks/
│   └── use-toast.ts             # Toast notification hook
└── README.md
```

## API Endpoints

### Transactions

- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/[id]` - Update a transaction
- `DELETE /api/transactions/[id]` - Delete a transaction

### Budgets

- `GET /api/budgets` - Fetch all budgets (with optional month filter)
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets` - Update a budget
- `DELETE /api/budgets/[id]` - Delete a budget

### Request/Response Examples

**Create Transaction (POST /api/transactions)**

```json
{
  "amount": 45.99,
  "date": "2024-01-15T00:00:00.000Z",
  "description": "Grocery shopping",
  "category": "Food"
}
```

**Create Budget (POST /api/budgets)**

```json
{
  "category": "Food",
  "month": "2024-01",
  "budget": 500
}
```

**Response**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "amount": 45.99,
  "date": "2024-01-15T00:00:00.000Z",
  "description": "Grocery shopping",
  "category": "Food",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

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

### Database Schema

**Transactions Collection**

```javascript
{
  _id: ObjectId,
  amount: Number,        // Positive number, required
  date: String,          // ISO date string, required
  description: String,   // Text description, required
  category: String,      // Category name, required
  createdAt: String      // ISO timestamp, auto-generated
}
```

**Budgets Collection**

```javascript
{
  _id: ObjectId,
  category: String,      // Category name, required
  month: String,         // Format: "YYYY-MM", required
  budget: Number,        // Positive number, required
  createdAt: String      // ISO timestamp, auto-generated
}
```

### Form Validation

- **Amount**: Must be a positive number
- **Date**: Required, uses date picker
- **Description**: Required, trimmed of whitespace
- **Category**: Required, selected from predefined list
- **Budget**: Must be a positive number for budget entries

### Available Categories

- Food
- Transport
- Utilities
- Rent
- Entertainment
- Shopping
- Healthcare
- Others

## Future Enhancements

- User authentication and authorization
- Data export functionality (CSV, PDF)
- Recurring transaction support
- Multi-currency support
- Advanced filtering and search
- Email notifications for budget alerts
- Mobile app companion
- Integration with bank APIs
- Custom category creation
- Financial goal tracking

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
