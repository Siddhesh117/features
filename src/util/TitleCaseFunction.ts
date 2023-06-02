const TitleCaseFunction = (data: string) => {
  return data?.toString().replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter?.toUpperCase());
};

export default TitleCaseFunction;
