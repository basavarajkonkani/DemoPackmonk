# PacMonk Admin Web Dashboard

A professional, responsive web dashboard for managing the PacMonk packaging and printing business.

## Features

### Dashboard
- Overview of key metrics (Total Orders, Revenue, Active Users, etc.)
- Quick action cards
- Recent activity feed

### Products Management
- View all products
- Add/Edit/Delete products
- Upload product images
- Manage stock levels

### Inventory Management
- Track stock levels
- Low stock alerts
- Inventory analytics

### Orders Management
- View all orders
- Update order status
- Track order progress
- Customer details

### Customers Management
- View all customers
- Customer details
- Transaction history
- Communication history

### Pricing Management
- Manage product pricing
- Create pricing rules
- Discount management

### Banner Management
- Create/Edit banners
- Schedule promotions
- Banner analytics

### Analytics & Reports
- Sales analytics
- Customer analytics
- Product performance
- Revenue reports

### Settings
- System settings
- User management
- Configuration

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Styled Components
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **UI Components**: Custom + FontAwesome5 icons
- **Charts**: Recharts (future implementation)

## Getting Started

### Installation

```bash
cd admin-web
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
admin-web/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── store/            # Redux store
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   ├── theme/            # Theme configuration
│   ├── App.tsx           # Root component
│   └── index.tsx         # Entry point
├── package.json
└── tsconfig.json
```

## API Integration

Currently using mock data. To connect to real APIs:

1. Create API service files in `src/services/`
2. Update Redux actions to call actual endpoints
3. Replace mock data with real API responses

## Authentication

Admin login credentials (demo mode):
- Email: `admin@packmonk.com`
- Password: `Admin@123`

OR

- Email: `superadmin@packmonk.com`
- Password: `SuperAdmin@123`

## Environment Variables

Create a `.env` file in the `admin-web` directory:

```
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_ADMIN_PORTAL=true
```

## Notes

- This is a fully responsive web application
- Works on desktop, tablet, and mobile browsers
- Uses mock/demo data for development
- Ready for API integration
- Professional design following PacMonk brand guidelines
