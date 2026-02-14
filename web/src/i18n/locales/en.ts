const en = {
  // metadata
  "meta.title": "iCalAgent | AI Calendar Subscriptions",
  "meta.description": "Universal AI Calendar Subscription Platform",

  // nav
  "nav.mySubscriptions": "My Subscriptions",
  "nav.apiKeys": "API Keys",
  "nav.skillDownload": "Skill Download",
  "nav.logout": "Logout",

  // landing
  "landing.hero.title": "Calendar subscriptions, ",
  "landing.hero.titleHighlight": "simplified",
  "landing.cta.dashboard": "Dashboard",
  "landing.cta.getStarted": "Get Started",
  "landing.cta.login": "Sign In",
  "landing.feature.aiAgent.title": "AI Agent Powered",
  "landing.feature.aiAgent.desc": "Automatically searches global information and syncs to your calendar. Subscribe with just one sentence.",
  "landing.feature.allScenarios.title": "All Scenarios",
  "landing.feature.allScenarios.desc": "Sports, movies, financial earnings and more. If it has a date, you can subscribe.",
  "landing.feature.liveCalendar.title": "Live Calendar",
  "landing.feature.liveCalendar.desc": "Works with Apple/Google/Outlook. Subscribe once, get dynamic updates across all devices.",
  "landing.feature.reliable.title": "Trustworthy",
  "landing.feature.reliable.desc": "Traceable event sources with confidence scores. Easily identify and verify information.",

  // agent demo
  "demo.scenario1.query": "Subscribe to NBA Lakers schedule 🏀",
  "demo.scenario1.title": "NBA Lakers 2024-25 Season Schedule",
  "demo.scenario2.query": "Subscribe to Nolan's movie releases 🎬",
  "demo.scenario2.title": "Christopher Nolan Movies Release Dates",
  "demo.scenario3.query": "Subscribe to SpaceX launches 🚀",
  "demo.scenario3.title": "SpaceX Launch Manifest",
  "demo.state.thinking": "AI is analyzing intent...",
  "demo.state.searching": "Searching the web...",
  "demo.state.working": "Generating calendar feed...",
  "demo.badge.active": "Active",
  "demo.result.description": "Irrelevant info filtered out. Only key events kept.",

  // dashboard
  "dashboard.title": "My Subscriptions",
  "dashboard.subtitle.prefix": "",
  "dashboard.subtitle.suffix": " active calendar subscriptions",
  "dashboard.empty.title": "No subscriptions yet",
  "dashboard.empty.description": "Use a Skill or the API to create your first calendar subscription",
  "dashboard.tab.calendar": "Calendar",
  "dashboard.tab.subscriptions": "Subscriptions",
  "dashboard.search.placeholder": "Search subscriptions...",
  "dashboard.search.noMatch": "No matching subscriptions",
  "dashboard.search.empty": "No subscriptions yet",

  // subscription card
  "subscription.details": "Details",

  // subscription detail
  "subscriptionDetail.backLabel": "Subscription Details",
  "subscriptionDetail.events": "Events",
  "subscriptionDetail.updated": "Updated",
  "subscriptionDetail.feedLink": "Feed Link",
  "subscriptionDetail.feedUrlLabel": "iCal Feed URL",
  "subscriptionDetail.calendarPreview": "Calendar Preview",
  "subscriptionDetail.eventList": "Event List",

  // calendar view
  "calendar.monthLabel": "{month} {year}",
  "calendar.backToToday": "Today",
  "calendar.eventsOfDate": " Events",
  "calendar.noEvents": "No events on this day",
  "calendar.weekdays": "Mon,Tue,Wed,Thu,Fri,Sat,Sun",

  // event table
  "eventTable.empty": "No events to display for this subscription.",
  "eventTable.colTitle": "Event Title",
  "eventTable.colTime": "Time",
  "eventTable.colStatus": "Status",
  "eventTable.colSource": "Source",
  "eventTable.viewSource": "View",
  "eventTable.status.scheduled": "Scheduled",
  "eventTable.status.cancelled": "Cancelled",
  "eventTable.status.postponed": "Postponed",

  // master feed card
  "masterFeed.title": "All Calendars",
  "masterFeed.description": "Add this link to your calendar app to see all events",

  // copy
  "copy": "Copy",

  // delete subscription
  "delete.confirmTitle": "Confirm Delete",
  "delete.confirmDescription": "Are you sure you want to delete \"{name}\"? All associated events and sync records will be permanently removed.",
  "delete.cancel": "Cancel",
  "delete.confirm": "Delete",
  "delete.deleting": "Deleting...",

  // subscription filter
  "filter.filterCalendars": "Filter",
  "filter.allCalendars": "All Calendars",
  "filter.selected": "{selected}/{total} selected",
  "filter.searchPlaceholder": "Search calendars...",
  "filter.noMatch": "No matches",
  "filter.all": "All",
  "filter.saveFailed": "Save failed, please retry",
  "filter.saved": "Saved, subscription updated",
  "filter.networkError": "Network error, please retry",

  // API keys
  "keys.title": "API Keys",
  "keys.description": "Manage keys for Skill and REST API access",
  "keys.create": "Create Key",
  "keys.createDialog.title": "Create API Key",
  "keys.createDialog.description": "Set a name for the key to identify it",
  "keys.createDialog.placeholder": "Key name (optional)",
  "keys.createDialog.creating": "Creating...",
  "keys.createDialog.submit": "Create",
  "keys.createDialog.defaultName": "Default Key",
  "keys.createdDialog.title": "Key Created",
  "keys.createdDialog.description": "Copy the key now. You won't be able to see the full key after closing.",
  "keys.createdDialog.copied": "Copied",
  "keys.createdDialog.copy": "Copy Key",
  "keys.createdDialog.close": "Close",
  "keys.list.title": "Created Keys",
  "keys.list.description": "Keys are used to access iCalAgent services via REST API",
  "keys.list.loading": "Loading...",
  "keys.list.empty": "No keys created yet",
  "keys.list.revoked": "Revoked",
  "keys.list.createdAt": "Created",
  "keys.list.copyTitle": "Copy key",
  "keys.list.copied": "Copied",
  "keys.list.revokeTitle": "Revoke key",
  "keys.revoke.title": "Confirm Revoke Key",
  "keys.revoke.description": "Key \"{name}\" ({prefix}...) will be immediately invalidated. All services using this key will lose access. This cannot be undone.",
  "keys.revoke.cancel": "Cancel",
  "keys.revoke.confirm": "Revoke",
  "keys.error.cannotReveal": "Cannot retrieve key",
  "keys.error.network": "Network error",

  // skill download
  "skill.title": "Skill Download",
  "skill.description": "Download the Skill file and configure it in your AI client",
  "skill.card.title": "iCalAgent Skill",
  "skill.card.description": "The Skill file is a guide for AI agents, telling them how to search information and use the iCalAgent API to create calendar subscriptions.",
  "skill.loadingKeys": "Loading keys...",
  "skill.noKeys.prefix": "You don't have any API keys yet. Please ",
  "skill.noKeys.createLink": "create an API key",
  "skill.noKeys.suffix": " first, then come back to download the configured Skill file.",
  "skill.downloadRaw": "Download raw SKILL.md",
  "skill.selectKey": "Select API Key",
  "skill.selectKeyHint": "The downloaded SKILL.md will embed the selected key and service URL automatically.",
  "skill.download": "Download SKILL.md",
  "skill.install.title": "Installation Guide",
  "skill.install.description": "The downloaded SKILL.md includes the API key and service URL. Just place it in the right directory.",

  // auth
  "auth.login.title": "Sign in to iCalAgent",
  "auth.login.description": "Sign in with your email and password",
  "auth.login.email": "Email",
  "auth.login.password": "Password",
  "auth.login.passwordPlaceholder": "At least 6 characters",
  "auth.login.submitting": "Signing in...",
  "auth.login.submit": "Sign In",
  "auth.login.noAccount": "Don't have an account? ",
  "auth.login.register": "Sign Up",
  "auth.login.backHome": "Back to Home",
  "auth.login.failed": "Sign in failed",
  "auth.login.networkError": "Network error, please retry",

  "auth.register.title": "Sign up for iCalAgent",
  "auth.register.description": "Create an account to manage your calendar subscriptions",
  "auth.register.email": "Email",
  "auth.register.password": "Password",
  "auth.register.passwordPlaceholder": "At least 6 characters",
  "auth.register.confirmPassword": "Confirm Password",
  "auth.register.confirmPlaceholder": "Enter password again",
  "auth.register.submitting": "Signing up...",
  "auth.register.submit": "Sign Up",
  "auth.register.passwordMismatch": "Passwords do not match",
  "auth.register.passwordTooShort": "Password must be at least 6 characters",
  "auth.register.hasAccount": "Already have an account? ",
  "auth.register.login": "Sign In",
  "auth.register.failed": "Sign up failed",
  "auth.register.networkError": "Network error, please retry",

  // not found
  "notFound.title": "Subscription Not Found",
  "notFound.description": "This subscription may not exist, or the link token is invalid.",
  "notFound.backHome": "Back to Home",
} as const;

export default en;
