/**
 * @description 问卷 单选
 */

import QuestionRadioComponent from "./QuestionRadioComponent.vue";
import PropComponent from "./PropComponent.vue";
import { QuestionRadioDefaultProps } from "./interface";
import StatComponent from "./StatComponent.vue";
export type { QuestionRadioStatPropsType } from "./interface";
export type { QuestionRadioPropsType } from "./interface";

export default {
  title: "单选",
  type: "questionRadio",
  component: QuestionRadioComponent,
  PropComponent,
  defaultProps: QuestionRadioDefaultProps,
  StatComponent,
};
