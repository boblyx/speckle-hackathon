/**
 * FMan.ts
 * - Unique classes for FamilyMan
 * @author Bob Lee
 */
export class Family{
  uuid : string;
  name : string;
  ftype : string;
  count : number;

  constructor(uuid : string, name : string, family_type : string, count = 0){
    this.uuid = uuid;
    this.name = name;
    this.ftype = family_type;
    this.count = count;
  }
}
