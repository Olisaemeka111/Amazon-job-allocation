export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: number
          name: string
          email: string
          role: string
          skills: string[]
          certifications: string[]
          shift: string
          status: "active" | "break" | "offline"
          current_task: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          role: string
          skills: string[]
          certifications: string[]
          shift: string
          status?: "active" | "break" | "offline"
          current_task?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          role?: string
          skills?: string[]
          certifications?: string[]
          shift?: string
          status?: "active" | "break" | "offline"
          current_task?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          type: string
          priority: "high" | "medium" | "low"
          duration: number
          required_skills: string[]
          assigned_to: number | null
          status: "pending" | "assigned" | "in-progress" | "completed" | "blocked"
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          priority: "high" | "medium" | "low"
          duration: number
          required_skills: string[]
          assigned_to?: number | null
          status?: "pending" | "assigned" | "in-progress" | "completed" | "blocked"
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          priority?: "high" | "medium" | "low"
          duration?: number
          required_skills?: string[]
          assigned_to?: number | null
          status?: "pending" | "assigned" | "in-progress" | "completed" | "blocked"
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: number
          email: string
          password: string
          name: string
          role: string
          created_at: string
          last_login: string | null
        }
        Insert: {
          id?: number
          email: string
          password: string
          name: string
          role: string
          created_at?: string
          last_login?: string | null
        }
        Update: {
          id?: number
          email?: string
          password?: string
          name?: string
          role?: string
          created_at?: string
          last_login?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
