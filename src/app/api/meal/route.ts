import { formatDate, getLatestMenuDocumentIds, getMealMenu } from '@/utils/meal';

export async function GET(request: Request) {
  try {
    const dateParam = new URL(request.url).searchParams.get('date');
    if (!dateParam) {
      return Response.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const menuPosts = await getLatestMenuDocumentIds();
    const targetPost = menuPosts.find((post) => {
      const [_, month, day] = post.title.match(/(\d+)월\s*(\d+)일/) || [];
      if (!month || !day) return false;

      const currentYear = new Date().getFullYear();
      const postDate = new Date(currentYear, Number.parseInt(month) - 1, Number.parseInt(day));
      return formatDate(postDate) === formatDate(new Date(dateParam));
    });

    if (!targetPost) {
      return Response.json({ error: 'Menu not found for the specified date' }, { status: 404 });
    }

    const mealMenu = await getMealMenu(targetPost.documentId);
    return Response.json(mealMenu);
  } catch (error) {
    console.error('Error fetching meal menu:', error);
    return Response.json({ error: 'Failed to fetch meal menu' }, { status: 500 });
  }
}
