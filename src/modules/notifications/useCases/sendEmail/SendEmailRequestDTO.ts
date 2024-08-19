export interface SendEmailRequestDTO {
  recipientName: string;
  recipientEmailAddress: string;
  senderName: string;
  senderEmailAddress: string;
  subject: string;
  html: string;
}
