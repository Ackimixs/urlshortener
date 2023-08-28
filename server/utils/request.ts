import { RequestData } from "./Type";

export const requestData = (event: any): RequestData => {
  return {
    method: event.node.req.method,
    path: event.path,
    params: event.context.params,
    query: getQuery(event),
    date: new Date(),
  };
};
