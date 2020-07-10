import { Stage } from "./stage/stage.model";
import "firebase/firestore";
import { firestore } from "firebase/app";

export const stages: Stage[] = [
  {
    nr: 1,
    location: new firestore.GeoPoint(53.1, 42.7),
    place: "Blakus lidlaukam",
    date: new firestore.Timestamp(1594410104, 0),
    fee: "35 eur",
    status: "finished",
    description: "",
  },
  {
    nr: 2,
    location: new firestore.GeoPoint(53.1, 42.7),
    place: "Blakus lidlaukam",
    date: new firestore.Timestamp(1594410104, 0),
    fee: "35 eur",
    status: "ongoing",
    description: "",
  },
  {
    nr: 3,
    location: new firestore.GeoPoint(53.1, 42.7),
    place: "Blakus lidlaukam",
    date: new firestore.Timestamp(1594410104, 0),
    fee: "35 eur",
    status: "announced",
    description: "",
  },
];
