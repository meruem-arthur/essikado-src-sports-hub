import * as s from "@/db/schema";

export type Field = { name: string; label: string; required?: boolean;
  type: "text"|"textarea"|"number"|"bool"|"select"|"date"|"datetime"|"image"|"ref";
  options?: string[]; ref?: { table: any; label: string }; folder?: string };
export type Resource = { key: string; label: string; table: any; perm: string; slugFrom?: string; titleCol: string; cols: string[]; fields: Field[] };

const t = (name: string, label: string, required = false): Field => ({ name, label, type: "text", required });
const area = (name: string, label: string, required = false): Field => ({ name, label, type: "textarea", required });
const bool = (name: string, label: string): Field => ({ name, label, type: "bool" });
const num = (name: string, label: string): Field => ({ name, label, type: "number" });
const img = (name: string, label: string, folder: string): Field => ({ name, label, type: "image", folder });
const sel = (name: string, label: string, options: string[]): Field => ({ name, label, type: "select", options, required: true });
const ref = (name: string, label: string, table: any, l: string, required = false): Field => ({ name, label, type: "ref", ref: { table, label: l }, required });
const dt = (name: string, label: string, required = false): Field => ({ name, label, type: "datetime", required });
const status = sel("status", "Status", ["draft", "published"]);

// One config drives list, form, validation and permissions. Add a resource = add an entry.
const BASE: Record<string, Resource> = {
  sports: { key: "sports", label: "Sports", table: s.sports, perm: "sports:write", slugFrom: "name", titleCol: "name", cols: ["name", "isActive", "displayOrder"],
    fields: [t("name", "Name", true), area("description", "Description"), img("coverImage", "Cover image", "site"), num("displayOrder", "Display order"), bool("isActive", "Active")] },
  teams: { key: "teams", label: "Teams", table: s.teams, perm: "teams:write", slugFrom: "name", titleCol: "name", cols: ["name", "gender", "isActive"],
    fields: [t("name", "Name", true), ref("sportId", "Sport", s.sports, "name", true), { name: "gender", label: "Category", type: "select", options: ["men", "women", "mixed"] },
      area("description", "Description"), img("logo", "Logo", "teams"), img("coverImage", "Cover image", "teams"), bool("isActive", "Active")] },
  players: { key: "players", label: "Players", table: s.players, perm: "players:write", titleCol: "fullName", cols: ["fullName", "jerseyNumber", "position", "isActive"],
    fields: [t("fullName", "Full name", true), ref("teamId", "Team", s.teams, "name", true), num("jerseyNumber", "Jersey number"), t("position", "Position / event"),
      area("bio", "Biography"), img("profileImage", "Profile image", "players"), bool("isActive", "Active")] },
  competitions: { key: "competitions", label: "Competitions", table: s.competitions, perm: "competitions:write", slugFrom: "name", titleCol: "name", cols: ["name", "season", "status"],
    fields: [t("name", "Name", true), ref("sportId", "Sport", s.sports, "name", true), t("season", "Season / year", true), area("description", "Description"),
      { name: "startDate", label: "Start date", type: "date" }, { name: "endDate", label: "End date", type: "date" },
      img("coverImage", "Cover image", "site"), sel("status", "Status", ["upcoming", "ongoing", "completed"])] },
  news: { key: "news", label: "News", table: s.news, perm: "news:write", slugFrom: "title", titleCol: "title", cols: ["title", "status", "isFeatured", "publishedAt"],
    fields: [t("title", "Title", true), ref("sportId", "Sport", s.sports, "name"), t("excerpt", "Excerpt"), area("content", "Content", true), img("coverImage", "Cover image", "news"),
      t("author", "Author"), bool("isFeatured", "Featured"), status, dt("publishedAt", "Published at")] },
  announcements: { key: "announcements", label: "Announcements", table: s.announcements, perm: "announcements:write", slugFrom: "title", titleCol: "title", cols: ["title", "priority", "status", "expiresAt"],
    fields: [t("title", "Title", true), area("description", "Description", true), ref("sportId", "Sport", s.sports, "name"), img("flyer", "Flyer", "news"),
      sel("priority", "Priority", ["low", "normal", "high", "urgent"]), dt("publishedAt", "Publish date"), dt("expiresAt", "Expiry date"), status] },
  events: { key: "events", label: "Events", table: s.events, perm: "events:write", slugFrom: "title", titleCol: "title", cols: ["title", "startsAt", "venue", "status"],
    fields: [t("title", "Title", true), area("description", "Description"), ref("sportId", "Sport", s.sports, "name"), dt("startsAt", "Starts", true), dt("endsAt", "Ends"),
      t("venue", "Venue"), img("coverImage", "Cover image", "events"), bool("isFeatured", "Featured"), status] },
  committee: { key: "committee", label: "Committee", table: s.committeeMembers, perm: "committee:write", titleCol: "fullName", cols: ["fullName", "position", "isActive", "displayOrder"],
    fields: [t("fullName", "Full name", true), t("position", "Position", true), t("email", "Official email"), area("bio", "Biography"),
      img("profileImage", "Profile image", "committee"), num("displayOrder", "Display order"), bool("isActive", "Active")] },
  sponsors: { key: "sponsors", label: "Sponsors & Partners", table: s.sponsors, perm: "sponsors:write", titleCol: "name", cols: ["name", "isActive", "displayOrder"],
    fields: [t("name", "Name", true), img("logo", "Logo", "sponsors"), t("websiteUrl", "Website URL"), area("description", "Description"), num("displayOrder", "Display order"), bool("isActive", "Active")] },
};

const PAGES = ["sports","teams","competitions","fixtures","results","news","announcements","events","gallery","committee","contact"];
const EXTRA: Record<string, Resource> = {
  fixtures: { key: "fixtures", label: "Fixtures", table: s.fixtures, perm: "fixtures:write", titleCol: "venue", cols: ["kickoffAt", "venue", "round", "status"],
    fields: [ref("competitionId", "Competition", s.competitions, "name", true), ref("homeTeamId", "Home team", s.teams, "name", true), ref("awayTeamId", "Away team", s.teams, "name", true),
      dt("kickoffAt", "Kick-off", true), t("venue", "Venue"), t("round", "Round / matchday"), sel("status", "Status", ["scheduled", "postponed", "cancelled", "completed"]), area("notes", "Notes")] },
  coaches: { key: "coaches", label: "Coaches", table: s.coaches, perm: "players:write", titleCol: "fullName", cols: ["fullName", "role", "isActive"],
    fields: [t("fullName", "Full name", true), ref("teamId", "Team", s.teams, "name", true), t("role", "Role"), area("bio", "Biography"), img("profileImage", "Profile image", "players"), bool("isActive", "Active")] },
  "competition-teams": { key: "competition-teams", label: "Competition Teams", table: s.competitionTeams, perm: "competitions:write", titleCol: "groupName", cols: ["groupName"],
    fields: [ref("competitionId", "Competition", s.competitions, "name", true), ref("teamId", "Team", s.teams, "name", true), t("groupName", "Group")] },
  gallery: { key: "gallery", label: "Gallery Albums", table: s.galleryAlbums, perm: "gallery:write", slugFrom: "title", titleCol: "title", cols: ["title", "year", "isFeatured", "status"],
    fields: [t("title", "Title", true), area("description", "Description"), ref("sportId", "Sport", s.sports, "name"), ref("competitionId", "Competition", s.competitions, "name"), ref("teamId", "Team", s.teams, "name"),
      num("year", "Year"), { name: "albumDate", label: "Date", type: "date" }, img("coverImage", "Cover image", "gallery"), bool("isFeatured", "Featured"), status] },
  "hero-slides": { key: "hero-slides", label: "Homepage Hero", table: s.heroSlides, perm: "site:write", titleCol: "heading", cols: ["heading", "displayOrder", "isActive"],
    fields: [t("heading", "Heading", true), area("description", "Description"), { ...img("image", "Image", "hero"), required: true }, t("ctaLabel", "Button label"), t("ctaHref", "Button link"),
      t("secondaryCtaLabel", "2nd button label"), t("secondaryCtaHref", "2nd button link"), num("displayOrder", "Display order"), bool("isActive", "Active")] },
  "page-heroes": { key: "page-heroes", label: "Page Heroes", table: s.pageHeroes, perm: "site:write", titleCol: "pageKey", cols: ["pageKey", "title"],
    fields: [sel("pageKey", "Page", PAGES), t("title", "Title override"), t("subtitle", "Subtitle"), img("image", "Hero image", "hero")] },
};
export const RESOURCES: Record<string, Resource> = { ...BASE, ...EXTRA };
