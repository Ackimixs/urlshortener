export interface RequestData {
  method: string;
  path: string;
  params: { [key: string]: string };
  query: object;
  date: Date;
}

export interface ResponseData<T> {
  statusCode: number;
  body: {
    data?: T;
    err?: MyError;
  };
  request: RequestData;
}

export interface MyError {
  error: string;
  message?: string;
}
