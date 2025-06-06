import mitt, { Emitter } from 'mitt';

type GPTEvents = {
  response: { prompt: string; response: string };
  [key: string]: any;
};

export const GPTEventHub: Emitter<GPTEvents> = mitt<GPTEvents>();
