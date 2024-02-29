import { Request } from "express";
import { verify } from "jsonwebtoken";
import { metaData } from "../environment/meta-data";

export const decodeJwt = (request: Request | any) => {
  const token = request.headers.authorization?.split("Bearer ")[1]
  let data:any = {};
  if (token) {
    data = verify(token, metaData.base.key);
  }
  return data;
};
