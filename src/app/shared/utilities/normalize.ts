import * as _ from 'lodash';

export function normalize(value: number, outputMin: number, outputMax: number) {
  const result = (value - outputMin) / (outputMax - outputMin);
  return _.clamp(result, outputMin, outputMax);
}
