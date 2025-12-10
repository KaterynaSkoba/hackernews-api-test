import { test, expect, APIRequestContext } from "@playwright/test";

const BASE = "https://hacker-news.firebaseio.com/v0";
const TOP_STORIES = `${BASE}/topstories.json`;
const ITEM = (id: number | string) => `${BASE}/item/${id}.json`;

// Get top story IDs from the Hacker News API
async function getTopStories(request: APIRequestContext) {
  const response = await request.get(TOP_STORIES);
  await expect(response).toBeOK();
  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
  return data as number[];
}

// Get a single item (story or comment)
async function getItem(request, id: number) {
  const response = await request.get(ITEM(id));
  await expect(response).toBeOK();
  return response.json();
}

// Get the first top story
async function getFirstTopStory(request: APIRequestContext): Promise<any> {
    const ids = await getTopStories(request);
  
    for (const id of ids) {
      const item = await getItem(request, id);
      if (item && item.type === "story") {
        return item;
      }
    }
    throw new Error("No item of type 'story' found in top stories");
  }

test("Get top stories", async ({ request }) => {
  const ids = await getTopStories(request);
  expect(ids.length).toBeGreaterThan(0);
  expect(typeof ids[0]).toBe("number");
});

test("Get first story", async ({ request }) => {
  const story = await getFirstTopStory(request);
  expect(story).not.toBeNull();
  expect(story.type).toBe("story");
});

test("Get a top story and its first comment", async ({ request }) => {
  const topStory = await getFirstTopStory(request);

  // If the story has no comments, do nothing
  if (!Array.isArray(topStory.kids) || topStory.kids.length === 0) {
    return;
  }

  const firstCommentId = topStory.kids[0];
  const comment = await getItem(request, firstCommentId);

  if (!comment) {
    return;
  }

  expect(comment.type).toBe("comment");
});

test("Invalid item ID should not return a valid story", async ({ request }) => {
  const response = await request.get(ITEM(-12345));
  await expect(response).toBeOK();

  const body: any = await response.json();
  if (body && typeof body === "object") {
    expect(body.type).not.toBe("story");
  }
});
