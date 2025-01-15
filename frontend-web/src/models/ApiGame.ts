//src\models\game.ts
import { ApiValue } from "./ApiValues";
import { ApiDate } from "./ApiDate";

export interface ApiGame {
  id: number;
  name: string;
  genres: ApiValue[];
  platforms: ApiValue[];
  cover?: { url: string };
  summary?: string;
  rating?:number;
  release_dates:ApiDate[];
}