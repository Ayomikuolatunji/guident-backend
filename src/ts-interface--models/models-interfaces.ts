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

export { SchoolSchema };
