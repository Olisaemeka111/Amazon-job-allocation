"use client"

import * as LucideIcons from "lucide-react"
import { FC, HTMLAttributes } from "react"

export interface IconProps extends HTMLAttributes<SVGElement> {
  name: keyof typeof LucideIcons
  size?: number
  color?: string
}

export const Icon: FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = "currentColor", 
  ...props 
}) => {
  // Use the imported icon directly with the "as" naming convention for React 19
  const iconName = `${name}`
  // Handle the case where the icon name already ends with "Icon"
  const cleanIconName = iconName.endsWith('Icon') 
    ? iconName.substring(0, iconName.length - 4) 
    : iconName
    
  // Get the icon component using the naming convention for React 19
  const LucideIcon = LucideIcons[cleanIconName as keyof typeof LucideIcons] as any
  
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in Lucide icons`)
    return null
  }
  
  return <LucideIcon size={size} color={color} {...props} />
} 