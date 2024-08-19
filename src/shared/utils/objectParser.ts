/* eslint-disable no-continue */

/**
 * credit to https://www.npmjs.com/package/append-field
 */

interface Context {
  [key: string]: any;
}

export class ObjectParser {
  private static parsePath(key: string) {
    function failure() {
      return [{ type: 'object', key, last: true }];
    }

    const firstKey = key.match(/^[^[]*/)?.[0] || '';
    if (!firstKey) return failure();

    const len = key.length;
    let pos = firstKey.length;
    let tail: any = { type: 'object', key: firstKey };
    const steps = [tail];

    while (pos < len) {
      let m;

      if (key[pos] === '[' && key[pos + 1] === ']') {
        pos += 2;
        tail.append = true;
        if (pos !== len) return failure();
        continue;
      }

      m = key.substring(pos).match(/^\[(\d+)\]/);
      if (m !== null) {
        pos += m[0].length;
        tail.nextType = 'array';
        tail = { type: 'array', key: parseInt(m[1], 10) };
        steps.push(tail);
        continue;
      }

      m = key.substring(pos).match(/^\[([^\]]+)\]/);
      if (m !== null) {
        pos += m[0].length;
        tail.nextType = 'object';
        tail = { type: 'object', key: m[1] };
        steps.push(tail);
        continue;
      }

      return failure();
    }

    tail.last = true;
    return steps;
  }

  private static valueType(value: any): 'undefined' | 'array' | 'object' | 'scalar' {
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object') return 'object';
    return 'scalar';
  }

  private static convertToType(value: any): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    const numericValue = parseFloat(value);
    return Number.isNaN(numericValue) ? value : numericValue;
  }

  private static setLastValue(context: Context, step: any, currentValue: any, entryValue: any): Context {
    switch (this.valueType(currentValue)) {
      case 'undefined':
        if (step.append) {
          context[step.key] = [this.convertToType(entryValue)];
        } else {
          context[step.key] = this.convertToType(entryValue);
        }
        break;
      case 'array':
        context[step.key].push(this.convertToType(entryValue));
        break;
      case 'object':
        return this.setLastValue(currentValue, { type: 'object', key: '', last: true }, currentValue[''], entryValue);
      case 'scalar':
        context[step.key] = [this.convertToType(context[step.key]), this.convertToType(entryValue)];
        break;
      default:
        return context;
    }

    return context;
  }

  private static setValue(context: Context, step: any, currentValue: any, entryValue: any) {
    if (step.last) return this.setLastValue(context, step, currentValue, entryValue);

    switch (this.valueType(currentValue)) {
      case 'undefined': {
        if (step.nextType === 'array') {
          context[step.key] = [];
        } else {
          context[step.key] = Object.create(null);
        }

        return context[step.key];
      }

      case 'object': {
        return context[step.key];
      }

      case 'array': {
        if (step.nextType === 'array') {
          return currentValue;
        }

        const obj = Object.create(null);
        context[step.key] = obj;
        currentValue.forEach((item: any, i: any) => {
          if (item !== undefined) obj[`${i}`] = item;
        });

        return obj;
      }

      case 'scalar': {
        const obj = Object.create(null);
        obj[''] = this.convertToType(currentValue);
        context[step.key] = obj;
        return obj;
      }

      default:
        throw new Error(`Invalid value type`);
    }
  }

  private static appendField(store: Context, key: string, value: any) {
    const steps = this.parsePath(key);

    steps.reduce((context, step) => {
      return this.setValue(context, step, context[step.key], value);
    }, store);
  }

  static parseUnparsedObject(unparsedObj: object): Context {
    const keyValuePairs = Object.entries(unparsedObj);
    if (keyValuePairs.length === 0) return unparsedObj;

    const parsedObj: Context = {};

    for (const [key, value] of keyValuePairs) {
      if (Object.hasOwn(unparsedObj, key)) {
        this.appendField(parsedObj, key, value);
      }
    }

    return parsedObj;
  }
}
