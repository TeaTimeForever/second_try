import { firestore } from "firebase/app";

export type StageStatus = "announced" | "finished" | "ongoing" | "cancelled";

export interface Stage {
  nr: number;
  location: firestore.GeoPoint;
  place: string;
  date: firestore.Timestamp;
  status: StageStatus;
  description: string;
  /** The participation fee (price) */
  fee: string;
  retrieve: string;
}
