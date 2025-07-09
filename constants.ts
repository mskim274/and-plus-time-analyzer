import { Activity, Level, FormDiscipline } from './types';

export const SUB_ACTIVITY_MAP: Record<string, string[]> = {
  [Activity.REVIEW_ANALYSIS]: [
    "1-00. 작업대기",
    "1-01. 도면 검토/분석",
    "1-02. Modeling 검토/분석",
    "1-03. 내역서 검토 및 Coding",
    "1-04. Work Volume 파악 / 질의서 작성",
  ],
  [Activity.MODELING]: [
    "2-01. Modeling 작업",
    "2-02. Family(Library) 수정 및 신규",
    "2-03. Revit (Template) Setting",
  ],
  [Activity.BCMS]: [
    "3-01. 속성 표준화",
    "3-02. 산출항목 Mapping",
    "3-03. WBS Mapping",
    "3-04. Rvt Upload 및 오류수정",
  ],
  [Activity.REPORT]: [
    "4-01. Summary 작성",
    "4-02. Basis 작성",
  ],
  [Activity.MANAGEMENT]: [
    "5-01. Project Management 업무",
  ],
  [Activity.AND_WORKS]: [
    "9-01. And 직원교육준비",
    "9-02. And 업무 교육수강 및 교육활동",
    "9-03. And 기타업무",
    "9-04. 휴가",
  ],
};

export const LEVEL_OPTIONS = Object.values(Level);
export const DISCIPLINE_OPTIONS = Object.values(FormDiscipline);
export const ACTIVITY_OPTIONS = Object.values(Activity);