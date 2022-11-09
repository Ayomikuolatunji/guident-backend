export const getMutatedMomgooseField = (field: any, item: string) => {
  const newField: any = { ...field };
  delete newField[item];
  return newField;
};
