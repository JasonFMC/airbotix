// Central export for all types
export type { UserProfile } from './User'
export type { UserRole } from '../constants/userRoles'

// Import UserRole for internal use
import type { UserRole } from '../constants/userRoles'

// API Response types
export interface ApiResponse<T> {
  data: T
  error: string | null
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Current User interface (for backward compatibility)
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Student Management Types
export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  date_of_birth?: string
  status: StudentStatus
  enrolled_courses: string[]
  workshops_attended: string[]
  created_at: string
  updated_at: string
}

export type StudentStatus = 'active' | 'inactive' | 'suspended'

// Teacher Management Types
export interface Teacher {
  id: string
  name: string
  email: string
  phone?: string
  bio?: string
  specializations: string[]
  status: TeacherStatus
  courses_teaching: string[]
  workshops_conducted: string[]
  created_at: string
  updated_at: string
}

export type TeacherStatus = 'active' | 'inactive' | 'on_leave'

// Workshop Management Types
export interface Workshop {
  id: string
  title: string
  description: string
  instructor_id: string
  instructor_name: string
  date: string
  start_time: string
  end_time: string
  capacity: number
  enrolled_count: number
  price: number
  location: string
  status: WorkshopStatus
  materials?: string[]
  requirements?: string[]
  created_at: string
  updated_at: string
}

export type WorkshopStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled'

// Course Management Types
export interface Course {
  id: string
  title: string
  description: string
  category: CourseCategory
  level: CourseLevel
  duration_weeks: number
  price: number
  instructor_id: string
  instructor_name: string
  status: CourseStatus
  max_students: number
  enrolled_count: number
  syllabus?: CourseSyllabus[]
  prerequisites?: string[]
  thumbnail_url?: string
  created_at: string
  updated_at: string
}

export type CourseCategory = 'robotics' | 'programming' | 'ai' | 'stem' | 'engineering'
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type CourseStatus = 'draft' | 'published' | 'archived'

export interface CourseSyllabus {
  week: number
  title: string
  description: string
  learning_objectives: string[]
  materials: string[]
}

// Content Management Types
export interface Content {
  id: string
  title: string
  type: ContentType
  content_data: ContentData
  author_id: string
  author_name: string
  status: ContentStatus
  tags: string[]
  featured: boolean
  published_at?: string
  created_at: string
  updated_at: string
}

export type ContentType = 'article' | 'video' | 'tutorial' | 'resource' | 'announcement'
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived'

export interface ContentData {
  body?: string
  video_url?: string
  attachments?: string[]
  metadata?: Record<string, unknown>
}

// Dashboard Types
export interface DashboardStats {
  total_students: number
  total_teachers: number
  active_workshops: number
  total_courses: number
  revenue_this_month: number
  new_enrollments_this_week: number
}

export interface DashboardActivity {
  id: string
  type: ActivityType
  description: string
  user_id: string
  user_name: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export type ActivityType = 'student_enrolled' | 'workshop_completed' | 'course_created' | 'user_registered'

// Form Types
export interface FormFieldProps {
  label: string
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  required?: boolean
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time'
}

export interface SelectOption {
  label: string
  value: string | number
}

// Table Types
export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, row: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
}

// Filter Types
export interface FilterOption {
  key: string
  label: string
  options: SelectOption[]
}

export interface SearchFilters {
  search?: string
  status?: string
  category?: string
  date_from?: string
  date_to?: string
  [key: string]: string | undefined
}

// Navigation Types
export interface NavItem {
  label: string
  path: string
  icon?: React.ComponentType
  children?: NavItem[]
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}