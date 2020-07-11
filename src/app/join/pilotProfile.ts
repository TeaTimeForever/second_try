import { IsNotEmpty } from 'class-validator';

export class PilotProfile {

  @IsNotEmpty()
  name = "";

  @IsNotEmpty()
  surname = "";

  @IsNotEmpty()
  mobile = "";

  @IsNotEmpty()
  licenseId = "";

  @IsNotEmpty()
  wing = "";

  @IsNotEmpty()
  wingLevel = "";

  @IsNotEmpty()
  retrieveNeeded = true;

  @IsNotEmpty()
  firstTime = false;

  @IsNotEmpty()
  emergencyContactName = "";

  @IsNotEmpty()
  emergencyContactPhone = "";

  constructor() {}
}
