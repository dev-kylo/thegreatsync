import { rest } from 'msw';

const signIn = rest.post('/getCourse', (_req, res, ctx) => {
    return res(ctx.json({}));
});

const getCourse = rest.get('/getCourse', (_req, res, ctx) => {
    return res(ctx.json({}));
});

const getChapters = rest.get('/getCourse', (_req, res, ctx) => {
    return res(ctx.json({}));
});

const getPage = rest.get('/getCourse', (_req, res, ctx) => {
    return res(ctx.json({}));
});

export const handlers = [signIn, getCourse, getChapters, getPage];
