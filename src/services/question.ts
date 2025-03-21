import axios from "./ajax";
import type { ResDataType } from "./ajax";

// 获取单个问卷
export async function getQuestionService(id: string): Promise<ResDataType> {
  const url = `/api/question/${id}`;
  const data: ResDataType = await axios.get(url);
  return data;
}

// 创建问卷
export async function createQuestionService(): Promise<ResDataType> {
  const url = `/api/question`;
  const data: ResDataType = await axios.post(url);
  return data;
}
