export function parseViews(views)
{
  if (views > 1000000) {
    return `${Math.round(views / 100000) / 10}}m`;
  }
  if (views > 1000) {
    return `${Math.round(views / 100) / 10}k`;
  }
  return views;
}