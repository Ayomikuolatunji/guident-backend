import bcrypt from "bcrypt";
import { generateUsername } from "unique-username-generator";
import generator from "generate-password";

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

export function binarySearch(
  array: any[],
  key: any,
  compare: (a: any, b: any) => any
) {
  let left = 0;
  let right = array.length - 1;
  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const comparison = compare(array[middle], key);

    if (comparison === 0) {
      return middle;
    } else if (comparison < 0) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }
  return -1;
}

export const getUniqueName = (name: string) => {
  const username = generateUsername(name, 3);
  return username;
};

export const password = generator.generate({
  length: 10,
  numbers: true,
});
