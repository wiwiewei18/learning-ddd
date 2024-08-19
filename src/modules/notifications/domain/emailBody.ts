import handlebars from 'handlebars';
import { Guard } from '../../../shared/core/Guard';
import { Result, SuccessOrFailure } from '../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface HtmlContents {
  [key: string]: string;
}

interface EmailBodyProps {
  html: string;
  htmlContents?: HtmlContents;
}

export class EmailBody extends ValueObject<EmailBodyProps> {
  get html(): string {
    return this.props.html;
  }

  private constructor(props: EmailBodyProps) {
    super(props);
  }

  private static compileHtml(rawHtml: string, contents: HtmlContents): SuccessOrFailure<string> {
    const contentKeys = Object.keys(contents);
    const extraneousKeys: string[] = [];

    const regex = /\{{{(.*?)\}}}/g;
    let match = regex.exec(rawHtml);
    while (match !== null) {
      const key = match[1];
      if (!contentKeys.includes(key) && !extraneousKeys.includes(key)) {
        extraneousKeys.push(key);
      }
      match = regex.exec(rawHtml);
    }

    if (extraneousKeys.length) {
      return Result.fail(`Extraneous content keys inside rawHtml: ${extraneousKeys.join(', ')}`);
    }

    for (const key of contentKeys) {
      if (!rawHtml.includes(`{{{${key}}}}`)) {
        return Result.fail(`rawHtml not contain ${key} content key`);
      }
    }

    const compiledHtml = handlebars.compile(rawHtml);
    const htmlResult = compiledHtml(contents);

    return Result.ok<string>(htmlResult);
  }

  private static isValidHtml(html: string): boolean {
    const regex = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
    return regex.test(html);
  }

  static create(props: EmailBodyProps): SuccessOrFailure<EmailBody> {
    const nullGuard = Guard.againstNullOrUndefined(props.html, 'html');

    if (nullGuard.isFailure) {
      return Result.fail<EmailBody>(nullGuard.getErrorValue());
    }

    if (!this.isValidHtml(props.html)) {
      return Result.fail<EmailBody>(`Html is not valid`);
    }

    if (!props.htmlContents) {
      return Result.ok<EmailBody>(new EmailBody(props));
    }

    const compiledHtmlOrError = this.compileHtml(props.html, props.htmlContents);
    if (compiledHtmlOrError.isFailure) {
      return Result.fail<EmailBody>(compiledHtmlOrError.getErrorValue());
    }

    const html = compiledHtmlOrError.getValue() as string;

    return Result.ok<EmailBody>(new EmailBody({ html, htmlContents: props.htmlContents }));
  }
}
