export interface Semester {
  _id?: string;
  number: number;
  name: string;
  department: string;
  subjects: string[];
}

export class SemesterModel {
  static create(data: Partial<Semester>): Semester {
    return {
      number: data.number || 1,
      name: data.name || '',
      department: data.department || '',
      subjects: data.subjects || [],
      ...data
    };
  }
}
