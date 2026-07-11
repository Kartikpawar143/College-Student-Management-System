export interface Faculty {
  _id?: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
}

export class FacultyModel {
  static create(data: Partial<Faculty>): Faculty {
    return {
      name: data.name || '',
      email: data.email || '',
      department: data.department || '',
      designation: data.designation || '',
      subjects: data.subjects || [],
      ...data
    };
  }
}
