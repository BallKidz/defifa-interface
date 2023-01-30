import useGoogleSheets from 'use-google-sheets';

export function CurrentScore(apiKey, sheetId, sheetName ){
  const { data, loading, error } = useGoogleSheets({
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_API_KEY,
  sheetId: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_ID,
  sheetsOptions: [{ id: process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_SHEETS_NAME }],
  // sheetsOptions: [{ id: 'Sheet1' }],
  });

  if (loading) {
    return ['Loading...'];
  }

  if (error) {
    return ['Error'];
  }
  
  return data[0].data;
};