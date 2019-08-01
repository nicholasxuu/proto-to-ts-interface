export enum Message1Type {
   IMAGE = 'IMAGE',
   VIDEO = 'VIDEO',
}

export enum Message2Type {
   IMAGE = 'IMAGE',
   AUDIO = 'AUDIO',
}

export enum AfterMessageEnum {
   VIDEO = 'VIDEO',
   AUDIO = 'AUDIO',
}

export enum Message3Type {
   IMAGE = 'IMAGE',
   VIDEO = 'VIDEO',
}

export interface Message1 {
   msg: string;
}

export interface Message2 {
   name1: string;
   name_2: number;
   name3: string;
   ref: Message1;
   name_type: Message2Type;
   other_type: Message1Type;
   after_type: AfterMessageEnum;
   after_message_type: Message3Type;
   str_list: string[];
   ref_list: Message1[];
}

export interface Message3 {
   msg: string;
}