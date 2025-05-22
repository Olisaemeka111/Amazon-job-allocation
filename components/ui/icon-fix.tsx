"use client"

import React, { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';

// Create a map of all Lucide icons with proper type safety
const IconMap: Record<string, React.FC<React.ComponentProps<typeof LucideIcons.AlertCircle>>> = {};

// Populate the map with all Lucide icons
Object.entries(LucideIcons).forEach(([key, Icon]) => {
  // Skip non-component exports
  if (typeof Icon === 'function') {
    IconMap[key] = Icon as any;
  }
});

// Props for our Icon component
export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Mapping of our icon names to Lucide icon names
const iconNameMap: Record<string, string> = {
  // Navigation icons
  'Home': 'Home',
  'Users': 'Users2', // Changed from Users to Users2
  'Users2': 'Users2',
  'User': 'User',
  'Settings': 'Settings2', // Changed from Settings to Settings2
  'Settings2': 'Settings2',
  'Cog': 'Settings2', // Changed from Settings to Settings2
  'BarChart': 'BarChart',
  'BarChart2': 'BarChart2',
  'BarChart3': 'BarChart3',
  'PieChart': 'PieChart',
  'Clock': 'Clock',
  'Calendar': 'Calendar',
  
  // Task related icons
  'ClipboardList': 'ClipboardList',
  'Package': 'Package2', // Changed from Package to Package2
  'Package2': 'Package2',
  'Boxes': 'Package2', // Map Boxes to Package2
  'Box': 'Box',
  'Truck': 'Truck',
  'ShoppingCart': 'ShoppingCart',
  'CheckSquare': 'CheckSquare',
  
  // Layout icons
  'LayoutDashboard': 'LayoutDashboard',
  'Layout': 'Layout',
  'Layers': 'Layers',
  'Grid': 'Grid',
  
  // Alert icons
  'AlertTriangle': 'AlertTriangle',
  'AlertCircle': 'AlertCircle',
  'AlertOctagon': 'AlertOctagon',
  'Bell': 'Bell',
  'BellRing': 'BellRing',
  'Info': 'Info',
  
  // Action icons
  'Edit': 'Pencil',
  'Pencil': 'Pencil',
  'Trash2': 'Trash2',
  'Trash': 'Trash',
  'Save': 'Save',
  'Download': 'Download',
  'Upload': 'Upload',
  'Plus': 'Plus',
  'Minus': 'Minus',
  'X': 'X',
  'Check': 'Check',
  'Search': 'Search',
  'Filter': 'Filter',
  
  // Media control icons
  'Play': 'Play',
  'Pause': 'Pause',
  'Stop': 'Square',
  'SkipBack': 'SkipBack',
  'SkipForward': 'SkipForward',
  'RefreshCw': 'RefreshCw',
  'RefreshCcw': 'RefreshCcw',
  
  // User related icons
  'UserPlus': 'UserPlus',
  'UserMinus': 'UserMinus',
  'UserCheck': 'UserCheck',
  'UserX': 'UserX',
  'LogIn': 'LogIn',
  'LogOut': 'LogOut',
  
  // Commonly used in the app
  'Eye': 'Eye',
  'EyeOff': 'EyeOff',
  'Copy': 'Copy',
  'Clipboard': 'Clipboard',
  'Star': 'Star',
  'Heart': 'Heart',
  'ExternalLink': 'ExternalLink',
  
  // Mobile menu icons
  'Menu': 'Menu',
  
  // Additional icons
  'Activity': 'Activity',
  'Maximize2': 'Maximize2',
  'PanelLeft': 'PanelLeft',
  'Bug': 'Bug',
  'Loader2': 'Loader2',
};

// List of all available icons for debugging
export const availableIcons = Object.keys(LucideIcons).filter(
  key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function'
);

// Our custom Icon component
export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = "currentColor",
  className = "", 
  ...props 
}) => {
  // Try to map the icon name first
  const mappedName = iconNameMap[name] || name;
  
  // Get the icon component
  const IconComponent = LucideIcons[mappedName as keyof typeof LucideIcons] as any;
  
  // Check if we found the icon
  if (!IconComponent) {
    console.warn(`Icon "${name}" (mapped to "${mappedName}") not found in Lucide icons`);
    
    // Log all available icons that might match what we're looking for
    const possibleMatches = availableIcons.filter(iconName => 
      iconName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(iconName.toLowerCase())
    );
    
    if (possibleMatches.length > 0) {
      console.log(`Possible matches for "${name}": ${possibleMatches.join(', ')}`);
    }
    
    // Fall back to a basic icon if the requested one doesn't exist
    const FallbackIcon = LucideIcons.HelpCircle;
    return (
      <FallbackIcon 
        size={size} 
        color={color} 
        className={className}
        {...props} 
      />
    );
  }
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className}
      {...props} 
    />
  );
};

// Re-export all the icons from Lucide for convenience
export { LucideIcons }; 