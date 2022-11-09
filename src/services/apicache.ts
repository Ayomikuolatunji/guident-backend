import express, { Request, Response } from "express";
import apicache from "apicache";

let cache = apicache.middleware;

const onlyStatus200 = (req: Request, res: Response) => res.statusCode === 200;

const cacheSuccesses = cache("5 minutes", onlyStatus200);

export default cacheSuccesses;
