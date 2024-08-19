import { SuccessOrFailure } from '../../../shared/core/Result';
import { EmailBody } from './emailBody';

let emailBodyOrError: SuccessOrFailure<EmailBody>;

describe('EmailBody', () => {
  it('should be able to create email body from html string', () => {
    emailBodyOrError = EmailBody.create({ html: '<html>hello world</html>' });

    expect(emailBodyOrError.isSuccess).toBe(true);
  });

  it('should fail to create email body when passed with invalid html', () => {
    emailBodyOrError = EmailBody.create({ html: 'invalid html' });

    expect(emailBodyOrError.isFailure).toBe(true);
  });

  it('should be able to create email body with compiled html using valid html contents', () => {
    emailBodyOrError = EmailBody.create({ html: '<html>{{{data}}}</html>', htmlContents: { data: 'hello world' } });

    expect(emailBodyOrError.isSuccess).toBe(true);
  });

  it('should fail to create email body with compiled html when there is extraneous keys inside html', () => {
    emailBodyOrError = EmailBody.create({
      html: '<html>{{{data}}} and {{{anotherData}}}</html>',
      htmlContents: { data: 'hello world' },
    });

    expect(emailBodyOrError.isFailure).toBe(true);
  });

  it('should fail to create email body with compiled html when there is missing content keys', () => {
    emailBodyOrError = EmailBody.create({
      html: '<html>{{{data}}}</html>',
      htmlContents: { data: 'hello world', anotherData: 'bye world' },
    });

    expect(emailBodyOrError.isFailure).toBe(true);
  });

  it('should be able to create email body with compiled html with valid link in it', () => {
    emailBodyOrError = EmailBody.create({
      html: '<html><a href="{{{url}}}"></html>',
      htmlContents: { url: 'test.com?query=123' },
    });

    expect(emailBodyOrError.isSuccess).toBe(true);
    expect(emailBodyOrError.getValue()?.html).toBe('<html><a href="test.com?query=123"></html>');
  });
});
