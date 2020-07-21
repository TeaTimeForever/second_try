/** A reference for each participation in each stage */
export interface Participant {
  isFirstCompetition?: boolean;
  isRetrieveNeeded?: boolean;
  cancelled?: boolean;

  score?: number;
  distance?: string;
  maxHeight?: number;
  start?: string;
  dns?: boolean;
  registrationNumber?: number;
}

export interface HasId {
  id: string
}