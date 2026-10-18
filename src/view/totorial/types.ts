export type TutorialChapter = {
  id: string;
  title: string;
  content: string;
};

export type TutorialGroup = {
  id: string;
  title: string;
  children: TutorialChapter[];
};

export type TutorialCatalogItem = {
  id: string;
  text: string;
  level: number;
};

export type TutorialCourse = {
  id: string;
  title: string;
  learners: number;
};
