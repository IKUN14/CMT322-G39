# Project Proposal Report
## USM Dormitory Facilities Repair and Feedback System

**Course:** CMT32206 - Web Application Development  
**Project Title:** USM Dormitory Facilities Repair and Feedback System  
**Date:** [Current Date]  
**Group Members:** [Group Information]

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Stakeholders](#2-stakeholders)
3. [Category of Web Application](#3-category-of-web-application)
4. [Web Application Modeling](#4-web-application-modeling)
5. [Prototype Design](#5-prototype-design)
6. [Architecture Design](#6-architecture-design)
7. [Conclusion](#7-conclusion)

---

## 1. Introduction

### 1.1 Web Application Overview

The **USM Dormitory Facilities Repair and Feedback System** is a comprehensive web-based application designed to streamline the process of reporting, managing, and resolving facility maintenance issues within university dormitories. This system provides a centralized platform for students to submit repair requests, administrators to manage and assign work orders, and maintenance workers to track and complete their assigned tasks.

The system addresses the critical need for efficient communication and workflow management between students, administrative staff, and maintenance personnel. By digitizing the entire repair request lifecycle, the system eliminates paper-based processes, reduces response times, and improves overall service quality.

### 1.2 Problem Statement

Traditional dormitory facility management systems often suffer from:
- **Inefficient Communication**: Paper-based or fragmented communication channels lead to delays and lost requests
- **Lack of Visibility**: Students have no way to track the status of their repair requests
- **Manual Workflow Management**: Administrators struggle to efficiently assign and track work orders
- **Poor Feedback Mechanisms**: Limited ability to collect and analyze service quality feedback
- **Inadequate Reporting**: Difficulty in generating reports and analyzing maintenance trends

### 1.3 Solution Overview

Our web application provides:
- **Real-time Status Tracking**: Students can monitor their repair requests from submission to completion
- **Automated Workflow Management**: State machine-based workflow ensures proper status transitions
- **Role-based Access Control**: Different interfaces for students, administrators, and workers
- **Feedback Collection**: Integrated feedback system for service quality assessment
- **Analytics Dashboard**: KPI metrics for administrators to monitor system performance

### 1.4 Objectives

1. **Primary Objectives**:
   - Develop a user-friendly web application for repair request management
   - Implement role-based access control for three user types (Student, Admin, Worker)
   - Create an intuitive workflow management system with state machine logic
   - Provide real-time status tracking and notifications

2. **Secondary Objectives**:
   - Integrate feedback collection mechanism
   - Generate KPI reports and analytics
   - Support image uploads for better problem documentation
   - Enable CSV export functionality for data analysis

---

## 2. Stakeholders

### 2.1 Primary Stakeholders

#### 2.1.1 Students
- **Role**: End users who report facility issues
- **Needs**: 
  - Easy-to-use interface for submitting repair requests
  - Ability to track request status in real-time
  - Option to cancel requests when needed
  - Ability to approve or reject completed repairs
  - Provide feedback after service completion
- **Benefits**:
  - Quick and convenient way to report issues
  - Transparency in request processing
  - Improved response times

#### 2.1.2 Administrators
- **Role**: System managers who coordinate repair activities
- **Needs**:
  - View all repair requests across the system
  - Assign and reassign work orders to maintenance workers
  - Manage maintenance team members
  - Monitor system performance through KPIs
  - Export data for reporting purposes
- **Benefits**:
  - Centralized view of all operations
  - Efficient resource allocation
  - Data-driven decision making

#### 2.1.3 Maintenance Workers
- **Role**: Service providers who perform repairs
- **Needs**:
  - View assigned repair requests
  - Accept and complete work orders
  - Submit repair reports with images
  - Track their work history
- **Benefits**:
  - Clear view of assigned tasks
  - Easy reporting mechanism
  - Better work organization

### 2.2 Secondary Stakeholders

#### 2.2.1 University Management
- **Role**: Decision makers and system sponsors
- **Interests**: 
  - Improved service quality
  - Cost reduction through efficiency
  - Data for facility planning

#### 2.2.2 IT Department
- **Role**: System maintainers and technical support
- **Interests**:
  - System reliability and performance
  - Security and data integrity
  - Scalability for future growth

---

## 3. Category of Web Application

### 3.1 Application Type

The USM Dormitory Facilities Repair and Feedback System is classified as a **Business Process Management (BPM) Web Application** with elements of:

1. **Enterprise Resource Planning (ERP)**: Manages resources (maintenance workers, equipment)
2. **Customer Relationship Management (CRM)**: Manages interactions with students (customers)
3. **Workflow Management System**: Automates and manages business processes
4. **Document Management System**: Handles images and reports

### 3.2 Technical Classification

- **Architecture Pattern**: Single Page Application (SPA)
- **Deployment Model**: Web-based (accessible via browser)
- **Accessibility**: Multi-user, role-based access
- **Data Model**: Client-side state management with mock API (frontend prototype)

### 3.3 Application Characteristics

1. **Interactive**: Real-time updates and dynamic content
2. **Data-Driven**: KPI dashboards and analytics
3. **Process-Oriented**: State machine-based workflow management
4. **Multi-Role**: Different interfaces for different user types
5. **Responsive**: Designed to work on various screen sizes

---

## 4. Web Application Modeling

### 4.1 Use Case Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   System Use Cases                           │
└─────────────────────────────────────────────────────────────┘

    ┌──────────┐
    │ Student  │
    └────┬─────┘
         │
         ├─── Create Repair Request
         ├─── View My Repair Requests
         ├─── View Repair Details
         ├─── Cancel Repair Request
         ├─── Approve/Reject Completed Repair
         ├─── Submit Feedback
         └─── View Dashboard

    ┌──────────┐
    │  Admin   │
    └────┬─────┘
         │
         ├─── View All Repair Requests
         ├─── Accept Repair Request
         ├─── Assign Repair Request
         ├─── Reassign Repair Request
         ├─── Manage Maintenance Workers
         ├─── Create Worker Account
         ├─── View KPI Dashboard
         ├─── Export Data to CSV
         └─── Filter and Search Requests

    ┌──────────┐
    │  Worker  │
    └────┬─────┘
         │
         ├─── View Assigned Repair Requests
         ├─── Accept Repair Request
         ├─── Submit Repair Report
         ├─── Upload Repair Images
         └─── View Work History
```

### 4.2 Entity-Relationship Model (Conceptual)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │         │    Ticket    │         │   Worker    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │────────<│ id (PK)      │         │ id (PK)     │
│ username    │    1    │ title        │    >────│ userId (FK) │
│ email       │         │ description  │    N    │ name        │
│ password    │         │ location     │         │ department  │
│ role        │         │ urgency      │         │ status      │
│ name        │         │ status       │         │ rating      │
│ phone       │         │ createdBy(FK)│         └─────────────┘
└─────────────┘         │ assignee(FK) │
                        │ report       │         ┌─────────────┐
┌─────────────┐         │ images       │         │  Feedback   │
│StatusHistory│         │ createdAt    │         ├─────────────┤
├─────────────┤         │ updatedAt    │         │ id (PK)     │
│ id (PK)     │<───────│ id (PK)      │    <────│ ticketId(FK)│
│ ticketId(FK)│    N    └──────────────┘    N    │ userId (FK) │
│ fromStatus  │                                 │ content     │
│ toStatus    │         ┌──────────────┐        │ rating      │
│ changedBy(FK)│        │AssignmentRec │        │ images      │
│ changedAt   │         ├──────────────┤        │ createdAt   │
│ reason      │         │ id (PK)      │        └─────────────┘
└─────────────┘         │ ticketId(FK) │
                        │ workerId(FK) │
                        │ assignedBy(FK)│
                        │ assignedAt   │
                        │ reason       │
                        └──────────────┘
```

### 4.3 State Machine Model (Ticket Status Workflow)

```
┌────────┐
│ Draft  │ (Student creates request)
└───┬────┘
    │ Submit
    ▼
┌─────────────┐
│  Submitted  │
└───┬─────────┘
    │ Accept / Cancel
    ▼         ▼
┌─────────┐  ┌──────────┐
│Accepted │  │ Canceled │ (Terminal)
└───┬─────┘  └──────────┘
    │ Assign / Cancel
    ▼         ▼
┌─────────┐  ┌──────────┐
│Assigned │  │ Canceled │
└───┬─────┘  └──────────┘
    │ Accept
    ▼
┌─────────────┐
│ InProgress  │
└───┬─────────┘
    │ Submit Report / Reassign
    ▼         ▼
┌─────────┐  ┌─────────────┐
│Resolved │  │ Reassigned  │
└───┬─────┘  └──────┬──────┘
    │               │ Assign
    │ Approve/Reject│
    ▼       ▼       ▼
┌──────┐  ┌─────────────┐  ┌─────────┐
│Closed│  │ InProgress  │  │Assigned │
└──────┘  └─────────────┘  └─────────┘
(Terminal)
```

### 4.4 User Interface Flow

#### 4.4.1 Student Flow
```
Login → Dashboard → Create Ticket → Submit → View Status → 
Approve/Reject → Submit Feedback
```

#### 4.4.2 Admin Flow
```
Login → Dashboard → View All Tickets → Accept → Assign to Worker → 
Monitor Status → Manage Workers → View KPI
```

#### 4.4.3 Worker Flow
```
Login → Dashboard → View Assigned Tickets → Accept → 
Submit Report → View History
```

---

## 5. Prototype Design

### 5.1 Design Principles

1. **User-Centric Design**: Intuitive interfaces tailored to each user role
2. **Visual Consistency**: Unified color scheme and design language
3. **Accessibility**: Clear navigation and readable typography
4. **Responsive Layout**: Adapts to different screen sizes
5. **Visual Feedback**: Status indicators and color-coded badges

### 5.2 Color Scheme

- **Primary Color**: Blue (#3b82f6) - Trust and professionalism
- **Success Color**: Green (#67C23A) - Completed tasks
- **Warning Color**: Orange (#E6A23C) - Urgent/In Progress
- **Danger Color**: Red (#F56C6C) - Emergency/Canceled
- **Neutral Color**: Gray (#909399) - Normal status

### 5.3 Key Interface Screens

#### 5.3.1 Login Page
**Purpose**: User authentication and access control

**Features**:
- Username and password input fields
- Role-based login (automatic role detection)
- "Forgot Password" link
- "Register" link for new users
- Beautiful gradient background with university branding
- Responsive form layout

**User Actions**:
- Enter credentials
- Click "Login" button
- Navigate to registration or password recovery

#### 5.3.2 Student Dashboard
**Purpose**: Overview of student's repair requests and system statistics

**Features**:
- Key Performance Indicator (KPI) cards showing:
  - Total repair requests
  - Pending requests
  - In-progress requests
  - Resolved requests
- Navigation menu with icons:
  - 📊 Dashboard
  - 📋 My Repairs
  - ➕ Quick Repair
- User information display
- Logout button

**Layout**:
- Header with system logo and navigation
- Main content area with KPI cards in grid layout
- Modern card-based design with shadows and hover effects

#### 5.3.3 Create Repair Request Page
**Purpose**: Allow students to submit new repair requests

**Features**:
- Form fields:
  - Title (required)
  - Description (required, textarea)
  - Location (required)
  - Urgency level (Normal/Urgent/Emergency) with color-coded badges
  - Scheduled time (optional, datetime picker)
  - Image upload (multiple images supported)
- Image preview functionality
- Form validation
- Submit and Cancel buttons

**Design Elements**:
- Clean form layout
- Visual feedback for required fields
- Image upload with drag-and-drop support
- Urgency selector with color indicators

#### 5.3.4 Student Repair List View
**Purpose**: Display all repair requests created by the student

**Features**:
- List of repair request cards
- Each card displays:
  - Title
  - Status badge with background color:
    - Submitted (Blue)
    - Accepted (Light Blue)
    - Assigned (Orange)
    - In Progress (Orange)
    - Resolved (Green)
    - Closed (Green)
    - Canceled (Red)
  - Urgency badge with background color:
    - Normal (Gray)
    - Urgent (Orange)
    - Emergency (Red)
  - Location
  - Creation date
- Click on card to view details
- Empty state message when no requests exist

#### 5.3.5 Repair Request Detail View (Student)
**Purpose**: Show complete information about a specific repair request

**Features**:
- **Request Information Card**:
  - Title and status badge
  - Description
  - Location
  - Urgency
  - Creation date
  - Assigned worker (if assigned)

- **Status Timeline Component**:
  - Visual timeline showing status changes
  - Each status change displays:
    - Status name
    - Operator name
    - Timestamp
    - Reason (if provided)
  - Color-coded timeline dots

- **Repair Report Section** (if report exists):
  - Report content
  - Completion date
  - Worker name
  - Repair images (clickable for full-size view)

- **Acceptance Section** (if status is Resolved):
  - Approve button (green)
  - Reject button (red)
  - Rejection reason input

- **Feedback Section**:
  - Display existing feedbacks
  - "Add Feedback" button (if status is Closed)
  - Feedback dialog with:
    - Star rating (1-5)
    - Feedback content
    - Image upload

**Interactive Elements**:
- Clickable images for full-screen preview
- Expandable sections
- Action buttons with loading states

#### 5.3.6 Admin Dashboard
**Purpose**: System overview for administrators

**Features**:
- KPI cards showing:
  - Total repair requests
  - Pending requests
  - In-progress requests
  - Resolved requests
  - Average resolution time (hours)
  - Urgent repair requests
- Navigation menu:
  - 📊 Dashboard
  - 🔧 Repair Management
  - 👥 Maintenance Team

#### 5.3.7 Admin Repair Management Page
**Purpose**: Manage all repair requests in the system

**Features**:
- **Filter Bar**:
  - Status filter dropdown
  - Refresh button
  - Export CSV button

- **Repair Request Table**:
  - Checkbox column for batch operations
  - Columns:
    - Title
    - Status (with colored badge)
    - Urgency (with colored badge)
    - Creator name
    - Assignee name
    - Creation date
    - Actions (Details button)
  - Hover effects on table rows
  - Responsive table design

- **Batch Operations**:
  - Select all checkbox
  - Batch assign functionality
  - Batch complete functionality

#### 5.3.8 Admin Repair Detail View
**Purpose**: Detailed view and management of a repair request

**Features**:
- Request information display
- **Action Buttons**:
  - Accept button (if status is Submitted)
  - Assign/Reassign button (if status is Accepted/Assigned/Reassigned)

- **Assign Dialog**:
  - Worker selection dropdown
  - Worker information (name, department, status)
  - Assignment reason (optional)
  - Confirm and Cancel buttons

- Status timeline
- Repair report section (if exists)
- Feedback section (shows all feedbacks)

#### 5.3.9 Maintenance Team Management Page
**Purpose**: Manage maintenance worker accounts

**Features**:
- **Filter Bar**:
  - Search input (by name or department)
  - Refresh button
  - Add Worker button

- **Worker Cards**:
  - Worker name
  - Department
  - Status (Available/Busy/Offline) with colored badge
  - Grid layout

- **Add Worker Dialog**:
  - Form fields:
    - Name (required)
    - Username (required)
    - Email (required)
    - Password (required)
    - Phone (optional)
    - Department (required)
    - Status (required: Available/Busy/Offline)
  - Create and Cancel buttons
  - Form validation

#### 5.3.10 Worker Dashboard
**Purpose**: Overview for maintenance workers

**Features**:
- KPI cards showing assigned work statistics
- Navigation menu:
  - 📊 Dashboard
  - 📋 My Repairs

#### 5.3.11 Worker Repair List View
**Purpose**: Display repair requests assigned to the worker

**Features**:
- **Tabs**:
  - Pending (Assigned status)
  - In Progress (InProgress status)

- **Repair Request Cards**:
  - Title
  - Status badge
  - Location
  - Urgency badge
  - Click to view details

#### 5.3.12 Worker Repair Detail View
**Purpose**: View and manage assigned repair requests

**Features**:
- Request information display
- **Action Buttons**:
  - Accept button (if status is Assigned)
  - Submit Report button (if status is InProgress)

- **Submit Report Dialog**:
  - Report content textarea (required)
  - Image upload (optional)
  - Submit and Cancel buttons

- Status timeline
- Repair report section (if submitted)

### 5.4 Component Design

#### 5.4.1 Status Badge Component
- Rounded corners (12px border-radius)
- Padding: 4px 12px
- Font weight: 600
- Background color based on status
- Text color contrasts with background

#### 5.4.2 Urgency Badge Component
- Same styling as status badge
- Color scheme:
  - Normal: Gray background (#F5F7FA) with gray text (#606266)
  - Urgent: Orange background (#FFF7E6) with orange text (#E6A23C)
  - Emergency: Red background (#FEF0F0) with red text (#F56C6C)

#### 5.4.3 Image Preview Component
- Full-screen overlay with dark background
- Centered image display
- Navigation controls (Previous/Next) for multiple images
- Image counter (e.g., "1 / 3")
- Close button
- Click outside to close

#### 5.4.4 Status Timeline Component
- Vertical timeline with connecting lines
- Timeline dots for each status change
- Status information with:
  - Status label (color-coded)
  - Operator name
  - Timestamp
  - Reason (if provided)
- Active state highlighting for latest status

### 5.5 Responsive Design

- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Adapted grid layouts, collapsible navigation
- **Mobile**: Stacked layouts, hamburger menu, touch-friendly buttons

---

## 6. Architecture Design

### 6.1 System Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Student    │  │    Admin     │  │    Worker    │ │
│  │   Interface  │  │  Interface   │  │  Interface   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 Presentation Layer                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Vue 3 Single Page Application           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │  Router  │  │  Pinia   │  │ Components│      │  │
│  │  │  (SPA)   │  │  State   │  │          │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Application Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Auth Store  │  │ Ticket Store │  │Worker Store  │ │
│  │              │  │              │  │              │ │
│  │  - Login     │  │  - Create    │  │  - List      │ │
│  │  - Register  │  │  - Update    │  │  - Create    │ │
│  │  - Logout    │  │  - Assign    │  │  - Update    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │ Feedback     │  │  KPI Store   │                    │
│  │ Store        │  │              │                    │
│  └──────────────┘  └──────────────┘                    │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Mock API Services                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │  │
│  │  │  Auth    │  │  Ticket  │  │  Worker  │      │  │
│  │  │   API    │  │   API    │  │   API    │      │  │
│  │  └──────────┘  └──────────┘  └──────────┘      │  │
│  │  ┌──────────┐  ┌──────────┐                    │  │
│  │  │Feedback  │  │   KPI    │                    │  │
│  │  │   API    │  │   API    │                    │  │
│  │  └──────────┘  └──────────┘                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Layer (Mock)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Mock Users  │  │ Mock Tickets │  │Mock Workers  │ │
│  │   Array      │  │    Array     │  │   Array      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐                                      │
│  │Mock Feedback │                                      │
│  │    Array     │                                      │
│  └──────────────┘                                      │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Frontend Architecture

#### 6.2.1 Technology Stack

**Core Framework**:
- **Vue 3** (Composition API): Modern reactive framework
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

**State Management**:
- **Pinia**: Vue 3 state management library
  - Auth Store: User authentication and session
  - Ticket Store: Repair request data and operations
  - Worker Store: Maintenance worker data
  - Feedback Store: Feedback data
  - KPI Store: Dashboard statistics

**Routing**:
- **Vue Router**: Client-side routing
  - Route guards for authentication
  - Role-based route access control
  - Lazy loading for code splitting

**UI Components**:
- Custom Vue components
- Reusable component library:
  - TicketStatusTimeline
  - ImageUpload
  - ImagePreview

**Styling**:
- Scoped CSS in Vue components
- Global CSS for common styles
- Responsive design with CSS Grid and Flexbox

#### 6.2.2 Component Architecture

```
src/
├── components/           # Reusable components
│   ├── TicketStatusTimeline.vue
│   ├── ImageUpload.vue
│   └── ImagePreview.vue
├── layouts/             # Layout components
│   └── MainLayout.vue
├── views/               # Page components
│   ├── auth/
│   │   ├── LoginView.vue
│   │   ├── RegisterView.vue
│   │   └── ForgotPasswordView.vue
│   ├── admin/
│   │   ├── TicketListView.vue
│   │   ├── TicketDetailView.vue
│   │   └── WorkersView.vue
│   ├── student/
│   │   ├── TicketListView.vue
│   │   ├── TicketDetailView.vue
│   │   └── CreateTicketView.vue
│   ├── worker/
│   │   ├── TicketListView.vue
│   │   └── TicketDetailView.vue
│   ├── DashboardView.vue
│   └── NotFoundView.vue
├── stores/              # Pinia stores
│   ├── auth.ts
│   ├── tickets.ts
│   ├── workers.ts
│   ├── feedback.ts
│   └── kpi.ts
├── services/            # API services
│   └── api.ts           # Mock API implementation
├── router/              # Routing configuration
│   └── index.ts
├── types/               # TypeScript types
│   └── index.ts
└── utils/               # Utility functions
    └── ticketStateMachine.ts
```

#### 6.2.3 Data Flow Architecture

```
User Action
    │
    ▼
Component (View)
    │
    ▼
Store Action (Pinia)
    │
    ▼
API Service Call
    │
    ▼
Mock API (In-memory data)
    │
    ▼
Store State Update
    │
    ▼
Component Re-render (Reactive)
```

### 6.3 State Management Architecture

#### 6.3.1 Auth Store
```typescript
State:
- user: User | null
- token: string | null

Computed:
- isAuthenticated: boolean
- role: UserRole | null
- isStudent: boolean
- isAdmin: boolean
- isWorker: boolean

Actions:
- login(credentials)
- register(data)
- logout()
- fetchCurrentUser()
- forgotPassword(email)
```

#### 6.3.2 Ticket Store
```typescript
State:
- tickets: Ticket[]
- currentTicket: Ticket | null
- selectedTicketIds: string[]
- loading: boolean

Computed:
- draftTickets: Ticket[]
- submittedTickets: Ticket[]
- acceptedTickets: Ticket[]
- assignedTickets: Ticket[]
- inProgressTickets: Ticket[]
- resolvedTickets: Ticket[]
- closedTickets: Ticket[]

Actions:
- fetchTickets(filter?)
- fetchTicket(id)
- createTicket(data)
- updateTicketStatus(data)
- assignTicket(data)
- reassignTicket(data)
- batchAssign(data)
- submitReport(data)
- confirmTicket(data)
- exportCSV()
```

#### 6.3.3 Worker Store
```typescript
State:
- workers: WorkerProfile[]
- loading: boolean

Actions:
- fetchWorkers(search?)
- getWorker(id)
- createWorker(data)
- updateWorker(id, data)
```

#### 6.3.4 Feedback Store
```typescript
State:
- feedbacks: Feedback[]
- loading: boolean

Actions:
- createFeedback(data)
- fetchFeedbackByTicket(ticketId)
- fetchAllFeedbacks()
```

#### 6.3.5 KPI Store
```typescript
State:
- kpi: KPI | null
- loading: boolean

Actions:
- fetchKPI()
```

### 6.4 Routing Architecture

#### 6.4.1 Route Structure
```
/ (root)
├── /login (public)
├── /register (public)
├── /forgot-password (public)
└── /app (protected, requires auth)
    ├── /dashboard
    ├── /student
    │   ├── /tickets
    │   ├── /tickets/create
    │   └── /tickets/:id
    ├── /admin
    │   ├── /tickets
    │   ├── /tickets/:id
    │   └── /workers
    └── /worker
        ├── /tickets
        └── /tickets/:id
```

#### 6.4.2 Route Guards
- **Authentication Guard**: Redirects to login if not authenticated
- **Role Guard**: Restricts access based on user role
- **Navigation Guard**: Handles route transitions

### 6.5 State Machine Architecture

#### 6.5.1 State Transition Rules
The system implements a finite state machine for ticket status management:

**States**:
- Draft, Submitted, Accepted, Assigned, InProgress, Resolved, Closed, Canceled, Reassigned

**Transitions**:
- Controlled by user role and current state
- Validated before state change
- Recorded in status history

**Implementation**:
- Centralized state machine logic in `ticketStateMachine.ts`
- Validation functions:
  - `canTransition(fromStatus, toStatus, userRole)`
  - `getAvailableTransitions(currentStatus, userRole)`
  - `getStatusLabel(status)`
  - `getStatusColor(status)`
  - `getStatusBgColor(status)`

### 6.6 API Architecture (Mock)

#### 6.6.1 API Structure
```
Auth API:
- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /auth/me
- POST /auth/forgot-password

Ticket API:
- GET /tickets (with filters)
- GET /tickets/:id
- POST /tickets
- PUT /tickets/:id/status
- POST /tickets/:id/assign
- POST /tickets/:id/reassign
- POST /tickets/:id/submit-report
- POST /tickets/:id/confirm
- POST /tickets/batch-assign
- GET /tickets/export

Worker API:
- GET /workers
- GET /workers/:id
- POST /workers
- PUT /workers/:id

Feedback API:
- POST /feedback
- GET /feedback/ticket/:ticketId
- GET /feedback

KPI API:
- GET /kpi
```

#### 6.6.2 Mock Data Structure
- In-memory arrays for each entity type
- Simulated network delay (300ms)
- Data resets on page refresh

### 6.7 Security Architecture

#### 6.7.1 Authentication
- Token-based authentication (mock JWT)
- Session management in Pinia store
- Route guards for protected routes

#### 6.7.2 Authorization
- Role-based access control (RBAC)
- Route-level permissions
- Component-level permission checks

#### 6.7.3 Data Validation
- TypeScript type checking
- Form validation in components
- State machine validation for status transitions

### 6.8 Future Backend Integration Architecture

#### 6.8.1 Proposed Backend Stack
- **Runtime**: Node.js / Python / Java
- **Framework**: Express / NestJS / Django / Spring Boot
- **Database**: PostgreSQL / MySQL
- **Cache**: Redis
- **Storage**: AWS S3 / Local File System
- **Authentication**: JWT Tokens

#### 6.8.2 API Integration Strategy
- Replace mock API with actual HTTP calls
- Use Axios or Fetch API for HTTP requests
- Implement request/response interceptors
- Error handling and retry logic
- Loading states and progress indicators

#### 6.8.3 Database Schema (Proposed)
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tickets Table
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    scheduled_time TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    current_assignee INTEGER REFERENCES users(id),
    report TEXT,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Status History Table
CREATE TABLE ticket_status_history (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW(),
    reason TEXT
);

-- Worker Profiles Table
CREATE TABLE worker_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    department VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL,
    rating DECIMAL(3,2),
    completed_tickets INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feedback Table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id),
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    rating INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 7. Conclusion

### 7.1 Project Summary

The USM Dormitory Facilities Repair and Feedback System is a comprehensive web application designed to modernize and streamline facility management processes within university dormitories. The system successfully addresses key challenges in traditional repair request management through:

1. **Digital Transformation**: Complete digitization of the repair request workflow
2. **Role-Based Access**: Tailored interfaces for students, administrators, and maintenance workers
3. **Real-Time Tracking**: Transparent status tracking throughout the repair lifecycle
4. **Workflow Automation**: State machine-based workflow ensuring proper process adherence
5. **Feedback Integration**: Built-in feedback mechanism for continuous improvement

### 7.2 Key Achievements

1. **Functional Completeness**: All major functionalities implemented and working
   - User authentication and registration
   - Repair request creation and management
   - Work assignment and tracking
   - Feedback collection
   - KPI dashboard

2. **User Experience**: Intuitive and user-friendly interfaces
   - Clean and modern design
   - Consistent navigation
   - Visual status indicators
   - Responsive layout

3. **Technical Excellence**: Robust architecture and code quality
   - Type-safe development with TypeScript
   - Modular component architecture
   - State management with Pinia
   - Reusable utility functions

4. **Design Quality**: Professional and polished appearance
   - Consistent color scheme
   - Appropriate visual hierarchy
   - Clear information architecture
   - Accessibility considerations

### 7.3 Future Enhancements

1. **Backend Integration**: Connect to actual backend server and database
2. **Real-Time Notifications**: Push notifications for status updates
3. **Advanced Analytics**: More detailed reporting and analytics
4. **Mobile Application**: Native mobile apps for iOS and Android
5. **Email Integration**: Email notifications for important events
6. **Chat System**: Real-time chat between students and workers
7. **Rating System**: More comprehensive rating and review system

### 7.4 Learning Outcomes

Through this project, we have gained valuable experience in:
- Modern web application development with Vue 3
- State management and data flow
- User interface design and user experience
- Workflow modeling and state machines
- Software architecture and design patterns
- Project planning and execution

### 7.5 Final Remarks

This project demonstrates a complete, functional web application prototype that effectively addresses the identified problem domain. The system is ready for backend integration and can serve as a solid foundation for a production-ready facility management solution. The modular architecture ensures scalability and maintainability, while the user-centric design guarantees excellent user experience.

---

## Appendices

### Appendix A: Technology Versions

- Vue: 3.4.21
- TypeScript: 5.3.3
- Vite: 5.1.4
- Pinia: 2.1.7
- Vue Router: 4.3.0

### Appendix B: Browser Compatibility

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Appendix C: Development Tools

- Visual Studio Code
- Vue DevTools
- Git Version Control
- pnpm Package Manager

---

**End of Report**

