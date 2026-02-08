import type { CalendarEvent, Subscription } from "@/lib/types";

export const demoSubscriptions: Subscription[] = [
  {
    id: "sub_lakers_2026",
    subscriptionKey: "lakers-2026",
    displayName: "湖人 2026 赛程",
    timezone: "America/Los_Angeles",
    feedToken: "feed_lakers_2026_mock",
    updatedAt: "2026-02-06T10:00:00Z",
  },
  {
    id: "sub_superbowl",
    subscriptionKey: "super-bowl-schedule",
    displayName: "超级碗重点赛程",
    timezone: "America/New_York",
    feedToken: "feed_super_bowl_mock",
    updatedAt: "2026-02-06T09:30:00Z",
  },
  {
    id: "sub_movie_release",
    subscriptionKey: "movie-release-us",
    displayName: "影视上映（美国）",
    timezone: "America/Los_Angeles",
    feedToken: "feed_movie_release_mock",
    updatedAt: "2026-02-06T09:00:00Z",
  },
];

export const demoEventsBySubscription: Record<string, CalendarEvent[]> = {
  sub_lakers_2026: [
    {
      id: "evt_lal_2026_03_08",
      subscriptionId: "sub_lakers_2026",
      externalId: "nba_2026_03_08_nyk_lal",
      title: "New York Knicks at Los Angeles Lakers",
      description: "常规赛",
      startAt: "2026-03-08T12:30:00-08:00",
      timezone: "America/Los_Angeles",
      location: "Los Angeles, CA",
      status: "scheduled",
      sourceUrl: "https://www.nba.com/",
      labels: ["sports", "nba", "lakers"],
    },
    {
      id: "evt_lal_2026_04_12",
      subscriptionId: "sub_lakers_2026",
      externalId: "nba_2026_04_12_uta_lal",
      title: "Utah Jazz at Los Angeles Lakers",
      description: "常规赛收官",
      startAt: "2026-04-12T17:30:00-07:00",
      timezone: "America/Los_Angeles",
      location: "Los Angeles, CA",
      status: "scheduled",
      sourceUrl: "https://www.nba.com/",
      labels: ["sports", "nba", "lakers"],
    },
  ],
  sub_superbowl: [
    {
      id: "evt_sb_2026_final",
      subscriptionId: "sub_superbowl",
      externalId: "nfl_2026_super_bowl_lx",
      title: "Super Bowl LX",
      description: "NFL 冠军赛",
      startAt: "2026-02-08T18:30:00-05:00",
      timezone: "America/New_York",
      location: "Santa Clara, CA",
      status: "scheduled",
      sourceUrl: "https://www.nfl.com/",
      labels: ["sports", "nfl", "super-bowl"],
    },
  ],
  sub_movie_release: [
    {
      id: "evt_movie_1",
      subscriptionId: "sub_movie_release",
      externalId: "movie_2026_example_1",
      title: "Example Film A - US Theatrical Release",
      startAt: "2026-06-12T00:00:00-07:00",
      timezone: "America/Los_Angeles",
      status: "scheduled",
      sourceUrl: "https://www.imdb.com/",
      labels: ["entertainment", "movie", "release"],
    },
    {
      id: "evt_movie_2",
      subscriptionId: "sub_movie_release",
      externalId: "movie_2026_example_2",
      title: "Example Film B - US Streaming Launch",
      startAt: "2026-09-20T00:00:00-07:00",
      timezone: "America/Los_Angeles",
      status: "scheduled",
      sourceUrl: "https://www.themoviedb.org/",
      labels: ["entertainment", "movie", "streaming"],
    },
  ],
};

export function getSubscriptionById(id: string): Subscription | undefined {
  return demoSubscriptions.find((item) => item.id === id);
}

export function getSubscriptionByFeedToken(
  feedToken: string,
): Subscription | undefined {
  return demoSubscriptions.find((item) => item.feedToken === feedToken);
}

export function getEventsBySubscriptionId(subscriptionId: string): CalendarEvent[] {
  return demoEventsBySubscription[subscriptionId] ?? [];
}
