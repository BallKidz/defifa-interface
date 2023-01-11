const versusTeamNames = [
  "Buffalo",
  "Cincinnati",
  "Jacksonville",
  "San Francisco",
  "Minnesota",
  "Tampa Bay",
];

export const formBrackets = (
  array: any[],
  order: string[]
): { teamName: string }[] => {
  const reorderedArray = [];
  for (const name of order) {
    const foundElem = array.find((val) => val.teamName === name);
    if (foundElem) {
      if (versusTeamNames.includes(foundElem.teamName)) {
        foundElem.isSpecial = true;
      }
      reorderedArray.push(foundElem);
    }
  }
  const remaining = array.filter((val) => !order.includes(val.teamName));
  return reorderedArray.concat(remaining);
};
