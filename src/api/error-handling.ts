export const catchError = (ex: any) => {
  console.error(ex);

  const responseMessage = ex?.response?.data
    ? typeof ex.response?.data === "string"
      ? ex.response?.data
      : ex.response?.data?.message
    : undefined;

  throw responseMessage ?? "Något gick fel";
};
