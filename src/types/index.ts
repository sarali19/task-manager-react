export type Task = {
  id: number;
  title: string;
  status: Status ;
  label: Label;
  priority: Priority;
  description: string;
  dueDate: Date;
  createdAt: string;
  project: Project;
  member: Member;
};

export type Project ={
  id:number , 
  name:string , 
  description : string ,
  createdAt:string,
  teamLeader: TeamLeader
}

export type TeamLeader ={
  id: number,
  email: string,
  firstName: string,
  lastName: string
}

export type Member={
  id: number,
  email: string,
  firstName: string,
  lastName: string
}

export type Status= "InProgress" | "Backlog" | "Todo" | "Canceled" | "Done"
export type Priority= "High" | "Medium" | "Low"
export type Label= "Documentation" | "Bug" | "Feature"