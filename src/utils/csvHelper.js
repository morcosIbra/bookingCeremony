import { Parser } from 'json2csv';

export const downloadResource = (res, fileName, fields, data) => {
  const json2csv = new Parser({ fields, withBOM :true });
  const csv = json2csv.parse(data);
  console.log("here csv");
  res.header('Content-Type', 'text/csv');
  res.attachment(fileName);
  return res.send(csv);
};