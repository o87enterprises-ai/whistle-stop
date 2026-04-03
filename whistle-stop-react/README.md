# THE WHISTLE STOP v2.0 - React + Three.js

A modern companion for classic craftsmanship. Full-stack React application with Three.js 3D animations, real-time dashboards, and comprehensive backend API.

## Features

### Landing Page
- **3D Animated Barber Pole** - Three.js floating barber pole logo with particle background
- **Portal Selection** - Client vs Admin entry points with animated cards
- **Live Availability** - Real-time chair status with progress bars
- **Elite Program Preview** - Membership benefits showcase

### Client Dashboard
- **Appointment Scheduler** - Interactive calendar with time slot selection
- **Product Shop** - Hair care products with add-to-cart
- **Chatbot/Support** - Real-time messaging with animated avatar
- **Rewards Program** - Points tracking with progress bar
- **Hair Styling Menu** - Visual gallery of available styles
- **Social Integration** - Share looks to Facebook, Instagram, YouTube

### Admin Dashboard
- **Daily Forecast** - Revenue projections with mini trend chart
- **Quick Actions** - New appointment, client check-in, blast messages, flash sales
- **Peak/Valley Hours** - Bar chart of busy periods
- **Scheduled Appointments** - Full appointment list with barber assignments
- **Communications Hub** - Phone dialer, call history, direct messaging
- **Live Security Feeds** - 4-camera grid with live indicators
- **Flash Sale Manager** - Toggle active sales with spot tracking
- **Customer Database** - Searchable customer list with quick view
- **Social News Feed** - Integrated social media updates

### Backend API (Express)
- `/api/appointments` - CRUD operations for appointments
- `/api/customers` - Full customer management
- `/api/flash-sales` - Flash sale creation and toggling
- `/api/messages` - Direct messaging and blast messages
- `/api/revenue` - Revenue tracking and reporting
- `/api/barbers` - Barber management
- `/api/business-hours` - Operating hours configuration
- `/api/current-service` - Live service status
- `/api/auth/login` - Authentication for clients and admins

## Tech Stack

- **Frontend**: React 18, React Router, Three.js (@react-three/fiber, @react-three/drei)
- **Styling**: Tailwind CSS, Framer Motion (animations)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Express.js, CORS, Body Parser, UUID
- **Build**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd whistle-stop-react
npm install
```

### Run Development

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Opens at http://localhost:3000

**Terminal 2 - Backend API:**
```bash
npm run server
```
API runs at http://localhost:3001

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
vercel
```

## Project Structure

```
whistle-stop-react/
├── public/
│   └── barber-pole.svg          # SVG logo asset
├── src/
│   ├── components/
│   │   ├── BarberPole3D.jsx     # Three.js 3D barber pole
│   │   ├── BackgroundScene.jsx  # Particle background scene
│   │   └── Header.jsx           # Shared navigation header
│   ├── context/
│   │   └── AppContext.jsx       # Global state management
│   ├── hooks/
│   │   └── useApi.js            # API hooks for data fetching
│   ├── lib/
│   │   ├── api.js               # API endpoint functions
│   │   └── utils.js             # Utility functions
│   ├── pages/
│   │   ├── LandingPage.jsx      # Hero + portal selection
│   │   ├── ClientAuth.jsx       # Client registration form
│   │   ├── ClientDashboard.jsx  # Full client dashboard
│   │   ├── AdminAuth.jsx        # Admin verification flow
│   │   └── AdminDashboard.jsx   # Full admin dashboard
│   ├── App.jsx                  # Route configuration
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind + custom styles
├── server.js                    # Express API server
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind theme config
├── postcss.config.js            # PostCSS configuration
├── vercel.json                  # Vercel deployment config
└── package.json
```

## Brand Guidelines

### Colors
- **Whistle Black**: `#0a0a0a`
- **Whistle Charcoal**: `#1a1a1a`
- **Whistle Grey**: `#2a2a2a`
- **Whistle Crimson**: `#dc2626`
- **Whistle Red**: `#b91c1c`
- **Whistle White**: `#f5f5f5`

### Typography
- **Display**: Oswald (headings, branding)
- **Body**: Inter (body text, UI elements)

### Logo
The brand uses a barber pole replacing the "I" in "WHISTLE". The 3D version is rendered with Three.js and features animated spinning stripes in crimson and white within a glass cylinder with metal caps.

## API Endpoints Reference

### Appointments
```
GET    /api/appointments          - List all appointments
POST   /api/appointments          - Create new appointment
PUT    /api/appointments/:id      - Update appointment
DELETE /api/appointments/:id      - Delete appointment
```

### Customers
```
GET    /api/customers             - List all customers
GET    /api/customers/:id         - Get customer by ID
POST   /api/customers             - Register new customer
PUT    /api/customers/:id         - Update customer
DELETE /api/customers/:id         - Delete customer
```

### Flash Sales
```
GET    /api/flash-sales           - Get current flash sale
POST   /api/flash-sales           - Create flash sale
PUT    /api/flash-sales/toggle    - Toggle active status
DELETE /api/flash-sales           - End flash sale
```

### Messages
```
GET    /api/messages              - Get all messages
POST   /api/messages              - Send direct message
POST   /api/messages/blast        - Send blast to all customers
```

### Revenue
```
GET    /api/revenue               - Get revenue data
GET    /api/revenue/daily         - Get daily revenue
POST   /api/revenue/record        - Record new revenue
```

### Barbers
```
GET    /api/barbers               - List all barbers
POST   /api/barbers               - Add new barber
PUT    /api/barbers/:id           - Update barber
DELETE /api/barbers/:id           - Delete barber
```

### Business Hours
```
GET    /api/business-hours        - Get operating hours
PUT    /api/business-hours        - Update operating hours
```

### Current Service (Live)
```
GET    /api/current-service       - Get current chair status
```

### Authentication
```
POST   /api/auth/login            - Login (client or admin)
```

## License

© 2026 THE WHISTLE STOP. All rights reserved.
