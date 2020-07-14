import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class PilotProfile {

  @IsNotEmpty()
  name = "";

  @IsNotEmpty()
  surname = "";

  @IsNotEmpty()
  gender = "";

  @IsNotEmpty()
  phone = "";

  @IsNotEmpty()
  licenseId = "";

  @IsNotEmpty()
  wing = "";

  @IsNotEmpty()
  wingClass: 'A' | 'B' | 'C' | 'D' | 'other' = 'A';

  @IsOptional()
  @IsBoolean()
  retrieveNeeded?= false;

  @IsOptional()
  @IsBoolean()
  firstTime?= false;

  @IsNotEmpty()
  emergencyContactName = "";

  @IsNotEmpty()
  emergencyContactPhone = "";

  constructor() { }
}
