/** A reference for each participation in each stage */
export interface Participant {
  isFirstCompetition?: boolean;
  isRetrieveNeeded?: boolean;
  cancelled?: boolean;
}

export interface HasId {
  id: string
}