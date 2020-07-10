export const stages = [
  {
    id: 1,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "25.04.2020. - 25.04.2020.",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 2,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "30.05.2020.-31.05.2020.",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 3,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "13.06.2020.-14.06.2020.",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 4,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "14.06.2020.",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 5,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 6,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "ongoing"
  },
  {
    id: 7,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "announced"
  }
]

export type stageStatus = "announced" | "finished" | "ongoing" | "canceled";

const activeStageId = 1;