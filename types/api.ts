export type AlarmReportParams = {
  MajorToken: string;
  MinorToken: string;
  IMEIs: string[];
  Emails: string[];
  Export: "PDF";
  Logo: string;
  DateFrom: string;
  DateTo: string;
  AlertIds: string[];
};
