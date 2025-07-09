
export enum Level {
  SPECIAL = "특급",
  SENIOR = "고급",
  MID = "중급",
  JUNIOR = "초급",
}

export enum Discipline {
  ALL = "ALL",
  ARCHITECTURE = "건축",
  MEP = "설비",
  ELECTRICAL = "전기",
}

export enum FormDiscipline {
  ARCHITECTURE = "건축",
  MEP = "설비",
  ELECTRICAL = "전기",
}

export enum Activity {
  REVIEW_ANALYSIS = "1. 검토 및 분석",
  MODELING = "2. Modeling",
  BCMS = "3. BCMS",
  REPORT = "4. Report",
  MANAGEMENT = "5. Management",
  AND_WORKS = "9. AND Works",
}

export interface TimeEntry {
  id: string;
  name: string;
  level: Level;
  projectName: string;
  discipline: FormDiscipline;
  activity: Activity;
  subActivity: string;
  role: string;
  hours: number;
  date: string;
}