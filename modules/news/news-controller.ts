import { FastifyReply, FastifyRequest } from 'fastify';
import { createNews, deleteNewsById, getNewsD, getNewsById, getTotalNews, updateNews } from './db/news';
import { BackendError } from '../../index';
import { deleteNewsFromStorage, getNewsFromStorage, updateNewsInStorage, uploadNewsToStorage } from './storage/news';

const newsPublicFilter = 'published';

async function getNews(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply, filter?: 'published') {
  const newsId = req.params.id;

  const news = await getNewsById(newsId, filter);

  if (!news) {
    throw new BackendError('News not found', 404);
  }

  const htmlContent = await getNewsFromStorage(news.htmlDocumentName);

  reply.sendWithStatus(200, {
    ...news,
    htmlContent,
  });
}

export function getNewsPublic(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getNews(req, reply, newsPublicFilter);
}

export function getNewsPrivate(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  return getNews(req, reply);
}

async function getNewsList(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply,
  filter?: 'published'
) {
  const { offset = 0, limit = 10 } = req.query;

  const newsList = await getNewsD(offset, limit, filter);
  const newsTotal = await getTotalNews(filter);

  if (!newsList) {
    throw new BackendError('News not found', 404);
  }

  reply.sendWithPagination(200, newsList, newsTotal);
}

export function getNewsListPublic(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  return getNewsList(req, reply, newsPublicFilter);
}

export function getNewsListPrivate(
  req: FastifyRequest<{ Querystring: { offset?: number; limit?: number } }>,
  reply: FastifyReply
) {
  return getNewsList(req, reply);
}

interface ICreateNewsBody {
  title: string;
  images: string[];
  htmlContent: string;
  status: 'draft' | 'published';
  isPrimary: boolean;
}

export async function postNews(req: FastifyRequest<{ Body: ICreateNewsBody }>, reply: FastifyReply) {
  const htmlContent = req.body.htmlContent;
  const htmlDocumentName = await uploadNewsToStorage(htmlContent);

  if (!htmlDocumentName) {
    throw new BackendError('News not created', 409);
  }

  const news = await createNews({
    ...req.body,
    htmlDocumentName,
  });

  if (!news) {
    throw new BackendError('News not created', 409);
  }

  reply.sendWithStatus(200, { ...news, htmlContent });
}

export async function patchNews(
  req: FastifyRequest<{ Params: { id: string }; Body: Partial<ICreateNewsBody> }>,
  reply: FastifyReply
) {
  const newsId = req.params.id;

  const news = await updateNews(newsId, req.body);

  if (!news) {
    throw new BackendError('News not updated', 409);
  }

  if (req.body.htmlContent) {
    const htmlDocumentName = await updateNewsInStorage(req.body.htmlContent, news.htmlDocumentName);

    if (!htmlDocumentName) {
      throw new BackendError('News not updated', 409);
    }
  }

  const htmlContent = await getNewsFromStorage(news.htmlDocumentName);

  reply.sendWithStatus(200, {
    ...news,
    htmlContent,
  });
}

export async function deleteNews(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const news = await deleteNewsById(req.params.id);

  if (!news) {
    throw new BackendError('News not deleted', 409);
  }

  try {
    const deleteStatus = await deleteNewsFromStorage(news.htmlDocumentName);
  } catch (e: unknown) {
    console.error(e);
  }

  reply.sendWithStatus(200, news);
}
