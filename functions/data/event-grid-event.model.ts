export interface EventGridEvent<T> {
  id: string;
  topic: string;
  subject: string;
  eventType: string;
  eventTime: Date;
  data: T;
}
