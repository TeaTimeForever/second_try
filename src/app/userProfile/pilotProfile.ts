import { IsNotEmpty } from 'class-validator';

export class PilotProfile {

  @IsNotEmpty()
  name = "";

  @IsNotEmpty()
  surname = "";

  @IsNotEmpty()
  phone = "";

  @IsNotEmpty()
  licenseId = "";

  @IsNotEmpty()
  wing = "";

  @IsNotEmpty()
  wingClass: 'A' | 'B' | 'C' | 'D' | 'other' = 'A';

  @IsNotEmpty()
  retrieveNeeded = true;

  @IsNotEmpty()
  firstTime = false;

  @IsNotEmpty()
  emergencyContactName = "";

  @IsNotEmpty()
  emergencyContactPhone = "";

  constructor() { }
}
