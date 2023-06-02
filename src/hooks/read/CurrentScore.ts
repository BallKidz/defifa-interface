import useGoogleSheets from "use-google-sheets";

export function CurrentScore(): Array<{ [key: string]: any }> {
  const apiKey =
    process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY ??
    "AIzaSyBJyq4HCKG4V85vgQrcZDN3dBpYB8TTleg";
  const sheetId =
    process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_ID ??
    "1iFaGzj6pW_dsbDtIBi34irMx0fiIERfTQg4TdUz1zUQ";
  const sheetName =
    process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME ?? "Sheet6";

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
