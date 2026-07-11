export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  profileImage?: string;
  department?: string;
  rollNo?: string;
  semester?: number;
  branch?: string;
  subjects?: string[];
}

export interface Student extends User {
  phone: string;
  semester?: number;
  branch?: string;
  faceEmbeddings?: number[][];
}

export interface Teacher extends User {
  phone: string;
  subjects: string[];
}

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category: string;
  postedBy: string;
  createdAt: string;
}

export interface Placement {
  _id: string;
  companyName: string;
  jobRole: string;
  salary: string;
  location: string;
  description: string;
  lastDate: string;
  link?: string;
}
