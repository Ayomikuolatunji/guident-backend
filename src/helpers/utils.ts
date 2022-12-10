export const getMutatedMongooseField = (field: any, item: string) => {
  const newField: any = { ...field };
  delete newField[item];
  return newField;
};
