export interface HOD {
  _id?: string;
  name: string;
  email: string;
  department: string;
  facultyId: string;
}

export class HODModel {
  static create(data: Partial<HOD>): HOD {
    return {
      name: data.name || '',
      email: data.email || '',
      department: data.department || '',
      facultyId: data.facultyId || '',
      ...data
    };
  }
}
