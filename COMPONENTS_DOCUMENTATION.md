# Medhya Components Documentation

## 📋 Overview

This document provides detailed documentation of all React components in the Medhya frontend application, organized by functionality and complexity.

## 🏗️ Architecture Overview

### Component Structure
```
frontend/src/
├── Components/           # Main UI components
│   ├── LandingPage.jsx      # Marketing & onboarding
│   ├── Login.jsx           # Authentication forms
│   ├── AppLayout.jsx       # Main application layout
│   ├── StudentDashboard.jsx # Student interface
│   ├── CounselorDashboard.jsx # Counselor management
│   ├── AdminDashboard.jsx   # System administration
│   ├── AIChat.jsx          # AI assistant interface
│   └── [40+ additional components]
├── games/                 # Cognitive assessment games
│   ├── Depression.jsx     # PHQ-9 assessment
│   ├── GoNoGoTest.jsx     # Response inhibition test
│   ├── PatternReplicationTest.jsx # Visual memory test
│   ├── SpiralTest.jsx     # Motor coordination test
│   ├── StroopTest.jsx     # Cognitive flexibility test
│   ├── TrailMakingTest.jsx # Executive function test
│   ├── VerbalFluencyTest.jsx # Language processing test
│   └── WordRecallTest.jsx # Memory assessment test
├── ui/                    # Reusable UI primitives
├── hooks/                 # Custom React hooks
├── services/              # API service functions
├── context/               # React context providers
└── utils/                 # Utility functions
```

## 🎯 Core Components

### LandingPage.jsx
**Purpose**: Marketing and service overview page
**Props**: `onLogin` (function), `systemStats` (object)
**Features**:
- Hero section with call-to-action
- Service overview (student challenges, features, testimonials)
- Statistics display (institutions, users)
- Institution testimonials
- Crisis resources section
- Responsive design with animations

**State Management**: Local state for form interactions
**API Calls**: None (static content)

### Login.jsx
**Purpose**: Multi-role authentication interface
**Props**:
- `onLogin` (function)
- `onLoginError` (function)
- `onShowUserSignup` (function)
- `onShowSignup` (function)

**Features**:
- Role-based login (Student/Admin/Counselor)
- Google OAuth integration
- Demo credentials for testing
- Password change functionality
- Error handling and validation

**State Management**: Form state, loading states, errors
**API Calls**: Authentication endpoints

### App.jsx
**Purpose**: Main application router and state manager
**Props**: None (uses internal routing)
**Features**:
- React Router configuration
- User context provider
- Protected route guards
- Role-based access control
- Socket.IO integration
- Authentication state management

**Routing Structure**:
```
Public Routes:
/                 -> LandingPage
/login           -> Login
/user-signup     -> UserInitialDetails
/signup          -> UserFinalDetails

Protected Routes:
/dashboard       -> StudentDashboard (students)
/counsellordash  -> CounselorDashboard (counselors)
/admin           -> AdminDashboard (admins)
/chat            -> AIChat
/appointments    -> AppointmentBooking
/community       -> PeerSupport
/wellness        -> Wellness
/games           -> Games
/cognitive-report -> Report
/reports         -> MedicalReports
/delivery        -> MedicineDelivery
/room/:roomId    -> RoomPage (video calls)
/chat/:counselorId -> UserCounselorChat
```

## 📊 Dashboard Components

### StudentDashboard.jsx
**Purpose**: Main student interface with wellness tracking
**Props**: None
**Features**:
- Mood tracking interface
- Quick access cards (games, chat, appointments)
- Wellness score calculation
- Recent activity display
- Mood trend visualization
- Integration with all student features

**State Management**: Local state for UI interactions
**API Calls**: Mood tracking, wellness data

### CounselorDashboard.jsx
**Purpose**: Counselor session and client management interface
**Props**: None
**Features**:
- Client session overview
- Real-time messaging integration
- Video call initiation
- Appointment status management
- Payment tracking
- Profile management
- Analytics dashboard

**State Management**: Complex state for sessions, messages, payments
**API Calls**: Sessions, messages, payments, profile data

### AdminDashboard.jsx
**Purpose**: System administration and analytics
**Props**: None
**Features**:
- User and counselor management
- System analytics (user growth, engagement)
- Crisis management interface
- Institution management
- Counselor onboarding
- System health monitoring

**State Management**: Complex analytics state
**API Calls**: Admin analytics, user management, counselor data

## 🧠 AI & Assessment Components

### AIChat.jsx
**Purpose**: AI-powered neurological consultation interface
**Props**: None
**Features**:
- Real-time chat with AI assistant
- Message history
- Typing indicators
- Error handling
- Responsive design

**State Management**: Messages array, loading states
**API Calls**: Chat service endpoints

### AssessmentGraph.jsx
**Purpose**: Mental health assessment data visualization
**Props**: None
**Features**:
- Time-series assessment data
- Multiple assessment types (stress, depression, etc.)
- Interactive charts with Chart.js
- Trend analysis
- Score interpretation
- Historical data display

**State Management**: Assessment data arrays, chart configurations
**API Calls**: Assessment history API

### StressAssessment.jsx
**Purpose**: Comprehensive stress evaluation tool
**Props**: `isPopup` (boolean), `onAssessmentComplete` (function)
**Features**:
- Multi-question assessment flow
- Real-time scoring
- Progress tracking
- Results interpretation
- Historical comparison
- Export capabilities

**State Management**: Assessment state, answers, scores
**API Calls**: Assessment submission and history

## 🎮 Game Components

### Games.jsx (Main Container)
**Purpose**: Cognitive assessment games hub
**Props**: None
**Features**:
- Game selection interface
- Score tracking
- Progress persistence
- Results aggregation
- Navigation between games

**Games Included**:
1. **Depression.jsx**: PHQ-9 assessment (13 questions)
2. **GoNoGoTest.jsx**: Response inhibition test
3. **PatternReplicationTest.jsx**: Visual memory and pattern recognition
4. **SpiralTest.jsx**: Motor coordination and tremor assessment
5. **StroopTest.jsx**: Cognitive flexibility and attention
6. **TrailMakingTest.jsx**: Executive function and processing speed
7. **VerbalFluencyTest.jsx**: Language processing and fluency
8. **WordRecallTest.jsx**: Memory assessment and recall ability

**Common Game Features**:
- Timer functionality
- Score calculation algorithms
- Progress tracking
- Results interpretation
- API integration for score persistence

## 💬 Communication Components

### UserCounselorChat.jsx
**Purpose**: Real-time chat between students and counselors
**Props**: None (uses URL params for counselor ID)
**Features**:
- Real-time messaging with Socket.IO
- Message history loading
- File attachment support
- Video call initiation
- Typing indicators
- Message read status

**State Management**: Messages, typing status, connection status
**API Calls**: Message history, real-time events

### AppointmentBooking.jsx
**Purpose**: Counselor appointment scheduling system
**Props**: None
**Features**:
- Available slots display
- Real-time booking
- Conflict detection
- Payment integration
- Cancellation functionality
- Chat integration

**State Management**: Appointments, slots, booking state
**API Calls**: Availability, booking, payment endpoints

## 🌐 Community Components

### PeerSupport.jsx
**Purpose**: Community forums and peer support platform
**Props**: None
**Features**:
- Post creation and management
- Comment system
- Category filtering
- Like functionality
- User engagement tracking
- Moderation tools

**State Management**: Posts, comments, categories, user interactions
**API Calls**: Community API endpoints

### Wellness.jsx
**Purpose**: Daily wellness tracking and tips
**Props**: None
**Features**:
- Mood selection interface
- Wellness score calculation
- Daily tips and exercises
- Progress tracking
- Historical data
- Personalized recommendations

**State Management**: Mood data, wellness scores, tips
**API Calls**: Mood tracking APIs

## 📋 Management Components

### CrisisManagement.jsx
**Purpose**: Emergency response and crisis coordination
**Props**: None
**Features**:
- Real-time crisis alerts
- Response protocol management
- Counselor assignment
- Status tracking
- Analytics dashboard
- Emergency contact integration

**State Management**: Crisis alerts, responses, statistics
**API Calls**: Crisis management endpoints

### MedicineDelivery.jsx
**Purpose**: Online pharmacy and medicine delivery system
**Props**: None
**Features**:
- Medicine order placement
- Prescription upload
- Supplier coordination
- Delivery tracking
- Payment processing
- Order history

**State Management**: Orders, suppliers, delivery status
**API Calls**: Medicine order APIs

### MedicalReports.jsx
**Purpose**: Medical document management system
**Props**: None
**Features**:
- File upload and storage
- Report preview
- Favorite reports
- Download functionality
- Search and filtering
- Secure access control

**State Management**: Reports list, favorites, upload status
**API Calls**: Report management APIs

## 🔧 Utility Components

### ErrorBoundary.jsx
**Purpose**: Error handling and crash recovery
**Props**: `children` (ReactNode)
**Features**:
- Error catching and display
- Fallback UI
- Error reporting
- Recovery options

### Loading Components
- Skeleton loaders for various content types
- Spinner components
- Progress indicators

### Form Components
- Input validation
- File upload handlers
- Multi-step form wizards
- Date/time pickers

## 🎨 UI Component Library

### ui/ Directory Components
Based on Radix UI primitives with Tailwind CSS:

- **Alert.jsx**: Notification and alert displays
- **Avatar.jsx**: User profile images
- **Badge.jsx**: Status and category indicators
- **Button.jsx**: Interactive button variants
- **Calendar.jsx**: Date selection component
- **Card.jsx**: Content containers
- **Checkbox.jsx**: Form checkboxes
- **Input.jsx**: Text input fields
- **Label.jsx**: Form labels
- **Progress.jsx**: Progress bars and indicators
- **Select.jsx**: Dropdown selections
- **Separator.jsx**: Visual dividers
- **Switch.jsx**: Toggle switches
- **Tabs.jsx**: Tabbed interfaces
- **TextArea.jsx**: Multi-line text inputs

## 🔗 Custom Hooks

### useAuth.js
**Purpose**: Authentication state management
**Returns**: User object, login/logout functions, loading state

### useApi.js
**Purpose**: API call wrapper with error handling
**Returns**: API call function with loading and error states

### useAssessment.js
**Purpose**: Assessment data management
**Returns**: Assessment functions and state

### useCommunity.js
**Purpose**: Community features management
**Returns**: Posts, comments, interaction functions

### SocketProvider.jsx
**Purpose**: WebSocket connection management
**Provides**: Socket instance to component tree

## 📊 Data Flow

### State Management Pattern
- **Local State**: Component-specific UI state
- **Context State**: Global user and app state
- **Server State**: API data with React Query patterns
- **Real-time State**: Socket.IO for live updates

### API Integration Pattern
```javascript
const { data, loading, error } = useApi('/endpoint', {
  method: 'GET',
  body: payload
});
```

### Error Handling Pattern
- Try-catch blocks for API calls
- Error boundaries for component failures
- User-friendly error messages
- Fallback UI states

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Components
- Grid layouts that adapt to screen size
- Collapsible navigation
- Mobile-optimized forms
- Touch-friendly interactions

## 🔄 Component Lifecycle

### Mounting Phase
1. Authentication check
2. Data fetching
3. Socket connection (if needed)
4. Initial state setup

### Update Phase
1. Props/state changes trigger re-renders
2. API calls for data updates
3. Real-time event handling

### Unmounting Phase
1. Socket disconnection
2. Cleanup timers/intervals
3. Cancel pending API calls

## 🚀 Performance Optimizations

### Code Splitting
- Route-based code splitting with React.lazy()
- Component lazy loading for heavy features

### Memoization
- React.memo for expensive components
- useMemo for complex calculations
- useCallback for event handlers

### API Optimization
- Request debouncing
- Response caching
- Pagination for large datasets
- Optimistic updates

## 🧪 Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for component interactions
- E2E tests for critical user flows

### Testing Tools
- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

## 📚 Component Dependencies

### External Libraries
- **React Router DOM**: Navigation and routing
- **Socket.IO Client**: Real-time communication
- **Chart.js/Recharts**: Data visualization
- **Radix UI**: Accessible UI primitives
- **Framer Motion**: Animations
- **Axios**: HTTP client
- **Date-fns**: Date manipulation

### Internal Dependencies
- Custom hooks for shared logic
- UI components for consistency
- Utility functions for common operations
- Context providers for state management

## 🔄 Future Component Updates

### Planned Improvements
- **Component Composition**: Better composition patterns
- **Type Safety**: TypeScript migration
- **Performance**: Virtual scrolling for large lists
- **Accessibility**: Enhanced ARIA support
- **Internationalization**: Multi-language support
- **Dark Mode**: Theme switching capability

This documentation provides a comprehensive overview of the Medhya frontend component architecture. Each component is designed with reusability, maintainability, and user experience in mind.