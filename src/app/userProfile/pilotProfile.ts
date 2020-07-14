import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class PilotProfile {

  @IsNotEmpty({message: 'Vārds ir obligāts'})
  name = "";

  @IsNotEmpty({message: 'Uzvārds ir obligāts'})
  surname = "";

  gender = "M";

  @IsNotEmpty({message: 'Tel. numurs ir obligāts'})
  phone = "";

  @IsNotEmpty({message: 'Licences numurs ir obligāts'})
  licenseId = "";

  @IsNotEmpty({message: 'Spārna modelis ir obligāts'})
  wing = "";

  @IsNotEmpty({message: 'Spārna klase ir obligāta'})
  wingClass: 'A' | 'B' | 'C' | 'D' | 'other' = 'B';

  @IsOptional()
  @IsBoolean()
  retrieveNeeded?= true;

  @IsOptional()
  @IsBoolean()
  firstTime?= false;

  @IsNotEmpty({message: 'Ārkārtas kontakta vārds ir obligāts'})
  emergencyContactName = "";

  @IsNotEmpty({message: 'Ārkārtas kontakta numurs ir obligāts'})
  emergencyContactPhone = "";

  constructor() { }
}
