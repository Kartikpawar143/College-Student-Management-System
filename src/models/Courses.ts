export interface Course {
  _id?: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  semester: number;
}

export class CourseModel {
  static create(data: Partial<Course>): Course {
    return {
      name: data.name || '',
      code: data.code || '',
      credits: data.credits || 0,
      department: data.department || '',
      semester: data.semester || 1,
      ...data
    };
  }
}
