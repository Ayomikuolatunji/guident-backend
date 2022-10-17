interface _id {
  _id: string;
}

interface SchoolSchema {
  _id?: string;
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

interface ParentSchema {
  _id?: string;
  student_name: string;
  date_of_birth: Date;
  nationality: string;
  state_of_origin: string;
  local_government_area: string;
  profile_picture: string;
  parents_name: string;
  parents_phone_number: number;
  parents_email?: string;
  parents_address: string;
  school_ref: string;
  parent_password?: string;
  students_intended_class: string;
}

export { SchoolSchema, ParentSchema };
