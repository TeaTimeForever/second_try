export interface PilotProfile {
  name: string;
  surname: string;
  mobile: string;
  
  licenseId: string;
  wing: string;
  wingLevel: string;

  retrieveNeeded: boolean;
  firstTime: boolean;

  emergencyContactName: string;
  emergencyContactPhone: string;
}
