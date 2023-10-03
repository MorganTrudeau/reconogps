import moment, { MomentInput } from "moment";

export const formatDateRange = (start: string, end: string) => {
  const startMoment = moment.utc(start).local();
  const endMoment = moment.utc(end).local();

  return `${startMoment.format("MMM D h:mma")} - ${endMoment.format(
    startMoment.isSame(endMoment, "date") ? "h:mma" : "MMM D h:mma"
  )}`;
};

export const formatDuration = (input: MomentInput) => {
  let ms = moment().diff(input, "milliseconds");

  //   const years = Math.floor(now.diff(input, "years"));
  //   const months = Math.floor(now.diff(input, "months"));
  //   const days = Math.floor(now.diff(input, "days"));
  //   const hours = Math.floor(now.diff(input, "hours"));
  //   const minutes = Math.floor(now.diff(input, "minutes"));

  const daysMs = 1000 * 60 * 60 * 24;
  const hoursMs = 1000 * 60 * 60;
  const minsMs = 1000 * 60;

  let days = Math.floor(ms / daysMs);

  ms = ms % daysMs;

  let hours = Math.floor(ms / hoursMs);

  ms = ms % hoursMs;

  let minutes = Math.floor(ms / minsMs);
  //   if (seconds < 60) return seconds + " Sec";
  //   else if (minutes < 60) return minutes + " Min";
  //   else if (hours < 24) return hours + " Hrs";
  //   else return days + " Days";

  if (minutes === 0) {
    return "0m";
  }

  return `${days ? days + "d" : ""}${hours ? hours + "h " : ""}${
    minutes ? minutes + "m" : ""
  }`;
};
