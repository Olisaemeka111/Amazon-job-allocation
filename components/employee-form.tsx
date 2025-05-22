"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { toast } from "sonner"

const employeeFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string().min(1, {
    message: "Role is required.",
  }),
  shift: z.string().min(1, {
    message: "Shift is required.",
  }),
  skills: z.array(z.string()).min(1, {
    message: "At least one skill is required.",
  }),
  certifications: z.array(z.string()).optional(),
  status: z.enum(["active", "break", "offline"]).default("active"),
  performance_score: z.number().min(0).max(100).default(80),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

interface EmployeeFormProps {
  initialData?: any
  onSuccess?: () => void
}

export function EmployeeForm({ initialData, onSuccess }: EmployeeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      role: "Associate",
      shift: "Morning",
      skills: [],
      certifications: [],
      status: "active",
      performance_score: 80,
    },
  })

  async function onSubmit(values: EmployeeFormValues) {
    setIsLoading(true)
    try {
      const method = initialData ? "PUT" : "POST"
      const url = initialData 
        ? `/api/employees/${initialData.id}` 
        : "/api/employees"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save employee")
      }

      toast.success(`Employee ${initialData ? "updated" : "created"} successfully`)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error saving employee:", error)
      toast.error("Failed to save employee")
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() === "") return
    
    const currentSkills = form.getValues("skills") || []
    if (!currentSkills.includes(newSkill.trim().toLowerCase())) {
      form.setValue("skills", [...currentSkills, newSkill.trim().toLowerCase()])
    }
    setNewSkill("")
  }

  const removeSkill = (skill: string) => {
    const currentSkills = form.getValues("skills") || []
    form.setValue("skills", currentSkills.filter(s => s !== skill))
  }

  const addCertification = () => {
    if (newCertification.trim() === "") return
    
    const currentCerts = form.getValues("certifications") || []
    if (!currentCerts.includes(newCertification.trim())) {
      form.setValue("certifications", [...currentCerts, newCertification.trim()])
    }
    setNewCertification("")
  }

  const removeCertification = (cert: string) => {
    const currentCerts = form.getValues("certifications") || []
    form.setValue("certifications", currentCerts.filter(c => c !== cert))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Edit Employee" : "Create New Employee"}</CardTitle>
        <CardDescription>
          {initialData 
            ? "Update employee information, skills and certifications" 
            : "Add a new employee to the warehouse management system"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@amazon.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Associate">Associate</SelectItem>
                        <SelectItem value="Team Lead">Team Lead</SelectItem>
                        <SelectItem value="Supervisor">Supervisor</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shift" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Afternoon">Afternoon</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                        <SelectItem value="Weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="break">Break</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="performance_score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Score (0-100)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>Initial performance score for the employee</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        placeholder="Add a skill (e.g. picking)" 
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                      <Button type="button" onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("skills")?.map((skill) => (
                        <Badge key={skill} variant="outline" className="flex items-center gap-1">
                          {skill}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeSkill(skill)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="certifications"
                render={() => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <div className="flex gap-2 mb-2">
                      <Input 
                        placeholder="Add a certification (e.g. PIT)" 
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCertification();
                          }
                        }}
                      />
                      <Button type="button" onClick={addCertification}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.watch("certifications")?.map((cert) => (
                        <Badge key={cert} variant="outline" className="flex items-center gap-1">
                          {cert}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeCertification(cert)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>Optional certifications for special equipment or tasks</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : initialData ? "Update Employee" : "Create Employee"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 