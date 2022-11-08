interface mongooseId {
  _id?: string;
}

interface DocumentResult<T> {
  _doc: T;
}

interface SchoolSchema extends mongooseId, DocumentResult<SchoolSchema> {
  school_name: string;
  school_adress: string;
  rc_number: number;
  school_logo: string;
  admin_firstname: string;
  admin_lastname: string;
  phone_number: number;
  school_email: string;
  admin_position: string;
  admin_password: string;
  school_students_parents?: any;
}

interface ParentSchema extends mongooseId, DocumentResult<ParentSchema> {
  student_name: string;
  date_of_birth: Date;
  nationality: string;
  state_of_origin: string;
  local_government_area: string;
  profile_picture: string;
  parent_name: string;
  parent_phone_number: number;
  parent_email?: string;
  parent_address: string;
  school_ref?: string;
  parent_password?: string;
  student_intended_class: string;
}

export { SchoolSchema, ParentSchema };
