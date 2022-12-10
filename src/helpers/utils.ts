import bcrypt from "bcrypt";

type removeItemType = {
  item: string;
};
export const getMutatedMongooseField = <T extends removeItemType>(field: T) => {
  const { item, ...otherValue } = field;
  return otherValue;
};

export const salt = async () => <string>await bcrypt.genSalt(15);
