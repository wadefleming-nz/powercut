import * as _ from 'lodash';

export function normalize(value: number, inputMin: number, inputMax: number) {
  const result = (value - inputMin) / (inputMax - inputMin);
  return _.clamp(result, 0, 1);
}
