export const stages = [
  {
    id: 0,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "finished"
  },
  {
    id: 1,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "ongoing"
  },
  {
    id: 2,
    location: "53.1, 42.7",
    place: "Blakus lidlaukam",
    date: "7.02.2020",
    price: "35 eur",
    status: "announced"
  }
]

export type stageStatus = "announced" | "finished" | "ongoing";

const activeStageId = 1;