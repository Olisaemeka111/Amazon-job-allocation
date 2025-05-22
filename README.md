# Amazon Job Allocation System

A sophisticated warehouse task allocation and management system built with Next.js, React, TypeScript, and Tailwind CSS.

## Overview

This application provides a comprehensive solution for managing and optimizing task allocation in Amazon warehouse environments. It features an intelligent task allocation engine that automatically assigns tasks to qualified employees based on their skills, workload balance, and fatigue prevention.

## Key Features

### Task Allocation Engine
- **Multiple Allocation Algorithms**:
  - Constraint-based allocation using OptaPlanner
  - Weighted rotation for fair workload distribution
  - Real-time rebalancing for dynamic environments
- **Smart Task Assignment**: Automatically matches tasks to qualified employees
- **Optimization Scoring**: Evaluates allocation quality with a scoring system

### Employee Management
- **Skills and Certifications Tracking**: Records employee capabilities
- **Performance Monitoring**: Measures and visualizes employee metrics
- **Status Tracking**: Real-time monitoring of employee activity
- **Shift Management**: Organizes employee schedules and coverage

### Dashboard & Visualization
- **Real-time Analytics**: Displays current warehouse operations
- **Task Distribution Charts**: Visualizes task allocation across zones
- **Performance Metrics**: Monitors and displays employee productivity
- **Warehouse Mapping**: Visual representation of warehouse zones with activity heatmaps

### Notification System
- **Alert Management**: Generates and tracks system alerts
- **Priority Categorization**: Organizes issues by importance
- **Resolution Tracking**: Monitors alert resolution status

## Tech Stack

- **Frontend**: Next.js 15+, React 19+, TypeScript
- **UI**: Tailwind CSS, Radix UI components
- **Data Visualization**: Recharts
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (with fallback to in-memory database)
- **Authentication**: Custom authentication system with bcrypt

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Olisaemeka111/Amazon-job-allocation.git

# Navigate to the project directory
cd Amazon-job-allocation

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Default Login
- **Email**: admin@amazon-warehouse.com
- **Password**: admin123

## Application Structure

- **/app**: Next.js app directory structure with routes and pages
- **/components**: Reusable React components
- **/lib**: Utility functions and database clients
- **/public**: Static assets
- **/styles**: Global CSS styles
- **/hooks**: Custom React hooks
- **/types**: TypeScript type definitions

## Key Pages

- **Dashboard**: Overview of warehouse operations
- **Task Allocation**: Configure and monitor task assignments
- **Employees**: Manage employee profiles and skills
- **Settings**: Configure system settings
- **Login**: Authentication portal

## Future Enhancements

- Integration with physical warehouse systems (conveyor belts, robots)
- Machine learning-based prediction for task duration
- Mobile app for floor managers
- Advanced analytics and reporting
- Real-time employee location tracking

## License

This project is proprietary and confidential.

## Acknowledgments

- Built using Next.js framework
- UI components based on shadcn/ui
- Icons from Lucide React
