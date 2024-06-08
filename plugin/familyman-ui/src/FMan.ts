export class Family{
  
  name : string;
  ftype : string;
  count : number;

  constructor(name : string, family_type : string, count = 0){
    this.name = name;
    this.ftype = family_type;
    this.count = count;
  }

}
