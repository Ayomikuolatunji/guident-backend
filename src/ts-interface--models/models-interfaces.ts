interface mongooseId {
  _id?: string;
}
interface DocumentResult<T> {
  _doc?: T;
}
interface SchoolSchema extends mongooseId, DocumentResult<SchoolSchema> {
  push(newObj: SchoolSchema): unknown;
  school_name?: string;
  school_address?: string;
  rc_number?: number;
  school_logo?: string;
  admin_first_name?: string;
  admin_last_name?: string;
  phone_number?: number;
  school_email?: string;
  admin_position?: string;
  admin_password?: string;
  school_students?: any[];
  school_parents?: any[];
  profile_completed?: boolean;
  emailVerification: boolean;
  otp?: string;
  tokenVerification?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}

interface StudentSchema extends mongooseId, DocumentResult<StudentSchema> {
  student_name: string;
  date_of_birth: Date;
  nationality: string;
  state_of_origin: string;
  local_government_area: string;
  profile_picture: string;
  school_ref?: string;
  parent_ref?: string;
  student_intended_class?: string;
  user_name?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

interface ParentSchema extends mongooseId, DocumentResult<ParentSchema> {
  push(newObj: SchoolSchema): unknown;
  parent_name?: string;
  parent_phone_number?: number;
  parent_email?: string;
  parent_address?: string;
  school_ref?: string;
  parent_password?: string;
  students?: any;
}

export { SchoolSchema, StudentSchema, ParentSchema };
