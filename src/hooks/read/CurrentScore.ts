import useGoogleSheets from "use-google-sheets";

export function CurrentScore(sheetNameIn): Array<{ [key: string]: any }> {
  const apiKey = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY ?? "";
  const sheetId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_ID ?? "";
  const sheetName = sheetNameIn ?? "";

  const { data, loading, error } = useGoogleSheets({
    apiKey,
    sheetId,
    sheetsOptions: [{ id: sheetName }],
  });

  if (loading) {
    return [{ loading: "Table is loading" }];
  }

  if (error) {
    return [{ error: "Error" }];
  }

  return data[0].data;
}
