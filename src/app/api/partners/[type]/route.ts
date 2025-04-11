import { connectDB } from '@/src/lib/db';
import Stage from '@/src/models/Stage';

export const GET = async (request: Request): Promise<Response> => {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const limit = searchParams.get('limit'); 

  const stageId = process.env[`STAGE_${type?.toUpperCase()}`];

  if (!stageId) {
    return new Response(JSON.stringify({ error: 'Неверный или отсутствующий тип' }), { status: 400 });
  }

  const stage = await Stage.findById(stageId)
    .populate({
      path: 'partners',
      select: 'name phone manager',
      populate: {
        path: 'manager',  
        select: 'name phone viber telegram whatsapp',  
      },
    });

  if (!stage) {
    return new Response(JSON.stringify({ error: 'Стадия не найдена' }), { status: 404 });
  }

  const partners = stage.partners || [];
  const limitedPartners = limit ? partners.slice(0, parseInt(limit)) : partners;

  return new Response(JSON.stringify(limitedPartners), { status: 200 });
};
