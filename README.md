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

## Deployment

### Production Build

```bash
# Create a production build
pnpm build

# Start the production server
pnpm start
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. Add environment variables in the Vercel dashboard
4. Deploy

#### Docker
A Dockerfile is provided for containerized deployment:

```bash
# Build the Docker image
docker build -t amazon-job-allocation .

# Run the container
docker run -p 3000:3000 amazon-job-allocation
```

#### AWS Elastic Beanstalk
1. Create an Elastic Beanstalk environment with Node.js platform
2. Package the application: `zip -r deploy.zip . -x "node_modules/*" ".git/*"`
3. Upload the zip file to Elastic Beanstalk
4. Configure environment variables in the AWS console

#### Self-Hosted
1. Set up a Linux server with Node.js installed
2. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "amazon-job-allocation" -- start
   pm2 save
   pm2 startup
   ```

## Infrastructure Requirements

### Database
- **Development**: In-memory database (included)
- **Production**: Supabase or PostgreSQL
  - Minimum specs: 2 vCPUs, 4GB RAM
  - Storage: Start with 10GB, scale as needed

### Server Requirements
- **Minimum**: 2 vCPUs, 2GB RAM
- **Recommended**: 4 vCPUs, 8GB RAM
- **Storage**: 20GB SSD

### Scaling Considerations
- Use load balancing for high-traffic environments
- Consider serverless deployment for cost-efficiency
- Database connection pooling recommended for high concurrency

### Monitoring
- Set up application monitoring with services like:
  - New Relic
  - Datadog
  - AWS CloudWatch

### Security Considerations
- Enable HTTPS/TLS
- Implement rate limiting
- Set up regular database backups
- Use environment variables for sensitive information
- Implement proper user authentication and authorization

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
