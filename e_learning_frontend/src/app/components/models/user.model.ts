export interface Role {
  id: number;
  name: string;
  // Add other fields as necessary
}



export class User   {
  id: number;
  staffId: string;
  name: string;
  email: string;
  doorLogNo: number;
  team: string;
  department: string;
  division: string;
  status: string;
  photo: string;
  password: string;
  createdAt: number;
  createdDate: string;
  roles: Role[];
  roleIdList: number[];

  constructor( ) {
    this.id = 1;
    this.staffId = '';
    this.name ='';
    this.email = '';
    this.doorLogNo = 1;
    this.team = '';
    this.department = '';
    this.division = '';
    this.status = '';
    this.photo = '';
    this.password = '';
    this.createdAt = 1;
    this.createdDate = '';
    this.roles = [];
    this.roleIdList = [];
  }
}
