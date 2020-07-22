/** A reference for each participation in each stage */
export interface Participant {
  isFirstCompetition?: boolean;
  isRetrieveNeeded?: boolean;
  cancelled?: boolean;

  score?: number;
  tasks?: Task[],
  registrationNumber?: number;
}
export interface Task {
  score?: number;
  distance?: number;
  speed?: number;
  maxHeight?: number;
  start?: string;
  finish?: string;
}

export interface HasId {
  id: string
}