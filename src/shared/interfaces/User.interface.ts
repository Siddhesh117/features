interface SortInfo {
  columnKey: string | undefined;
  order: string | undefined;
}


interface UserListInterface {
    id:number;
    username:string;
    first_name:string;
    last_name:string;
    //emailId:any;
    roleName:String;
     }

     interface UserFormInterface{
      // id:number;
      username:string;
      first_name:string;
      last_name:string;
      //emailId:any;
      password:any;
      roleName:string;
     }
  
 
  
  export type {SortInfo, UserListInterface,UserFormInterface };
  