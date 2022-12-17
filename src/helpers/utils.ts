import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

type removeItemType = {
  item: string;
};
export const getMutatedMongooseField = <T extends removeItemType>(field: T) => {
  const { item, ...otherValue } = field;
  return otherValue;
};

export const salt = async () => <string>await bcrypt.genSalt(10);

export function diff_minutes(dt2: Date, dt1: Date) {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

export const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "../../logs/access.log"),
  { flags: "a" }
);
