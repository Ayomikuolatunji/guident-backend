import bcrypt from "bcrypt";

type removeItemType = {
  item: string;
};
export const getMutatedMongooseField = <T extends removeItemType>(field: T) => {
  const { item, ...otherValue } = field;
  return otherValue;
};

export const salt = async () => <string>await bcrypt.genSalt(15);

export function diff_minutes(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
