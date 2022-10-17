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
  
}

interface ParentSchema {
  student_name: String;
  date_of_birth: Date;
  nationality: String;
  state_of_origin: String;
  local_government_area: String;
  profile_picture: String;
  parents_name: String;
  parents_phone_number: Number;
  parents_address: String;
  students_intended_class: String;
}

export { SchoolSchema, ParentSchema };
