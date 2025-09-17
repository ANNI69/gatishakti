export const mockUsers = [
  {
    id: "1",
    email: "admin@railway.gov.in",
    password: "admin123",
    firstName: "Rajesh",
    lastName: "Kumar",
    employeeId: "RLY001",
    role: "admin",
    department: "System Administration",
    permissions: ["all"],
  },
  {
    id: "2",
    email: "official@railway.gov.in",
    password: "official123",
    firstName: "Priya",
    lastName: "Sharma",
    employeeId: "RLY002",
    role: "railway-official",
    department: "Track Maintenance Division",
    permissions: ["dashboard", "components", "inspection", "analytics"],
  },
  {
    id: "3",
    email: "vendor@supplier.com",
    password: "vendor123",
    firstName: "Amit",
    lastName: "Patel",
    employeeId: "VND001",
    role: "vendor",
    department: "ABC Track Components Ltd",
    permissions: ["dashboard", "components"],
  },
  {
    id: "4",
    email: "inspector@railway.gov.in",
    password: "inspector123",
    firstName: "Sunita",
    lastName: "Singh",
    employeeId: "INS001",
    role: "inspector",
    department: "Quality Assurance",
    permissions: ["dashboard", "components", "inspection", "scanner"],
  },
]

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  employeeId: string
  role: string
  department: string
  permissions: string[]
}

export const authenticateUser = (email: string, password: string, role: string): User | null => {
  const user = mockUsers.find((u) => u.email === email && u.password === password && u.role === role)
  return user || null
}

export const registerUser = (userData: Omit<User, "id" | "permissions"> & { password: string }): User => {
  // In a real app, this would save to database
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    firstName: userData.firstName,
    lastName: userData.lastName,
    employeeId: userData.employeeId,
    role: userData.role,
    department: userData.department,
    permissions: getDefaultPermissions(userData.role),
  }

  // Mock saving to localStorage for demo
  const existingUsers = JSON.parse(localStorage.getItem("mock-users") || "[]")
  existingUsers.push({ ...newUser, password: userData.password })
  localStorage.setItem("mock-users", JSON.stringify(existingUsers))

  return newUser
}

const getDefaultPermissions = (role: string): string[] => {
  switch (role) {
    case "admin":
      return ["all"]
    case "railway-official":
      return ["dashboard", "components", "inspection", "analytics"]
    case "vendor":
      return ["dashboard", "components"]
    case "inspector":
      return ["dashboard", "components", "inspection", "scanner"]
    default:
      return ["dashboard"]
  }
}
