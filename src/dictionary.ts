// Mainly based on piStar mapping
// About piStar, please refer to https://github.com/jhcp/pistar

const nodeName = {
  "istar.Actor": "actor",
  "istar.Agent": "agent",
  "istar.Resource": "resource",
  "istar.Quality": "softgoal",
  "istar.Role": "role",
  "istar.Task": "task",
  "istar.Goal": "goal",
};

const nodeSize = {
  // from shape.js
  actor: [80, 80],
  agent: [80, 80],
  role: [80, 80],
  goal: [90, 35],
  resource: [90, 35],
  task: [95, 36],
  softgoal: [90, 55],
};

const linkName = {
  "istar.IsALink": "ISA",
  "istar.ParticipatesInLink": "P",
  "istar.DependencyLink": "d",
  "istar.AndRefinementLink": "and-d",
  "istar.OrRefinementLink": "or-d",
  "istar.ContributionLink": "contribution",
};

export { nodeName, nodeSize, linkName };
