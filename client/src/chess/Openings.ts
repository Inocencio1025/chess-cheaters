export type Opening = {
  name: string;
  moves: string[];
  type: "setup" | "opening";
  reward: number;
  color: "white" | "black";
  requires?: string[];
};


export const openings: Opening[] = [
  {
    name: "King's Pawn Setup",
    type: "setup",
    moves: [
      "E2-E4"
    ],
    reward: 1,
    color: "white"
  },

  {
    name: "Queen's Pawn Setup",
    type: "setup",
    moves: [
      "D2-D4"
    ],
    reward: 1,
    color: "white"
  },

  {
    name: "English Setup",
    type: "setup",
    moves: [
      "C2-C4"
    ],
    reward: 1,
    color: "white"
  },

  {
    name: "Sicilian Defense",
    type: "opening",
    moves: [
      "C7-C5"
    ],
    reward: 1,
    color: "black",
    requires: [
      "E2-E4"
    ]
  },

  {
    name: "French Defense",
    type: "opening",
    moves: [
      "E7-E6",
      "D7-D5"
    ],
    reward: 2,
    color: "black",
    requires: [
      "E2-E4"
    ]
  },

  {
    name: "Caro-Kann Defense",
    type: "opening",
    moves: [
      "C7-C6",
      "D7-D5"
    ],
    reward: 2,
    color: "black",
    requires: [
      "E2-E4"
    ]
  },

  {
    name: "Scandinavian Defense",
    type: "opening",
    moves: [
      "D7-D5"
    ],
    reward: 1,
    color: "black",
    requires: [
      "E2-E4"
    ]

  },

  {
    name: "Pirc Defense",
    type: "opening",
    moves: [
      "D7-D6"
    ],
    reward: 1,
    color: "black",
    requires: [
      "E2-E4"
    ]
  },

  {
    name: "Queen's Gambit",
    type: "opening",
    moves: [
      "D2-D4",
      "C2-C4"
    ],
    reward: 2,
    color: "white"
  },

  {
    name: "London System",
    type: "opening",
    moves: [
      "D2-D4",
      "G1-F3",
      "C1-F4"
    ],
    reward: 2,
    color: "white"
  },

  {
    name: "Italian Game",
    type: "opening",
    moves: [
      "E2-E4",
      "G1-F3",
      "F1-C4"
    ],
    reward: 1,
    color: "white"
  },

  {
    name: "Ruy Lopez",
    type: "opening",
    moves: [
      "E2-E4",
      "G1-F3",
      "F1-B5"
    ],
    reward: 2,
    color: "white"
  },

  {
    name: "King's Indian Defense",
    type: "opening",
    moves: [
      "G8-F6",
      "G7-G6",
      "F8-G7"
    ],
    reward: 2,
    color: "black"
  },

  {
    name: "Nimzo-Indian Defense",
    type: "opening",
    moves: [
      "G8-F6",
      "E7-E6",
      "F8-B4"
    ],
    reward: 2,
    color: "black",
    requires: [
      "D2-D4",
      "C2-C4"
    ]
  },

  {
    name: "King's Knight Opening",
    type: "setup",
    moves: [
      "E2-E4",
      "G1-F3"
    ],
    reward: 1,
    color: "white"
  },

  {
    name: "Scotch Game",
    type: "opening",
    moves: [
      "E2-E4",
      "G1-F3",
      "D2-D4"
    ],
    reward: 2,
    color: "white"
  },

  {
    name: "Vienna Game",
    type: "opening",
    moves: [
      "E2-E4",
      "B1-C3"
    ],
    reward: 2,
    color: "white"
  },

  {
    name: "Slav Defense",
    type: "opening",
    moves: [
      "D7-D5",
      "C7-C6"
    ],
    reward: 2,
    color: "black",
    requires: [
      "D2-D4"
    ]
  },

  {
    name: "Central Pawn Setup",
    type: "setup",
    moves: [
      "E7-E5"
    ],
    reward: 1,
    color: "black"
  },

  {
    name: "Queen's Pawn Setup",
    type: "setup",
    moves: [
      "D7-D5"
    ],
    reward: 1,
    color: "black"
  },

];

