export type OptionType = {
  value: string;
  text: string;
};

export type QuestionRadioPropsType = {
  title?: string;
  options?: OptionType[];
  isVertical?: boolean;
  defaultOption?: string;
  value?: string;
  onChange?: (newProps: QuestionRadioPropsType) => void;
  disabled?: boolean;
};

export const QuestionRadioDefaultProps: QuestionRadioPropsType = {
  title: "单选标题",
  isVertical: false,
  options: [
    { value: "item1", text: "选项1" },
    { value: "item2", text: "选项2" },
    { value: "item3", text: "选项3" },
  ],
  value: "",
};

/**
 * @description 单选组件的统计类型
 * */
export type QuestionRadioStatPropsType = {
  stat: Array<{ name: string; count: number }>;
};
