import { pgTable, uuid, text, integer, boolean, timestamp, date, jsonb, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";

export type Img = { publicId: string; url: string; alt?: string };
const id = () => uuid("id").primaryKey().defaultRandom();
const stamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
};
const img = (n: string) => jsonb(n).$type<Img>();
const slug = () => text("slug").notNull().unique();

export const fixtureStatus = pgEnum("fixture_status", ["scheduled", "postponed", "cancelled", "completed"]);
export const competitionStatus = pgEnum("competition_status", ["upcoming", "ongoing", "completed"]);
export const priority = pgEnum("priority", ["low", "normal", "high", "urgent"]);
export const publishStatus = pgEnum("publish_status", ["draft", "published"]);
export const gender = pgEnum("gender", ["men", "women", "mixed"]);

// ---- Auth (permissions are strings like "news:write"; "*" = everything) ----
export const roles = pgTable("roles", {
  id: id(), key: text("key").notNull().unique(), name: text("name").notNull(),
  permissions: text("permissions").array().notNull().default([]), ...stamps,
});
export const users = pgTable("users", {
  id: id(), email: text("email").notNull().unique(), name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  roleId: uuid("role_id").notNull().references(() => roles.id),
  isActive: boolean("is_active").notNull().default(true), lastLoginAt: timestamp("last_login_at"), ...stamps,
});

// ---- Sports & teams ----
export const sports = pgTable("sports", {
  id: id(), name: text("name").notNull(), slug: slug(), description: text("description"),
  coverImage: img("cover_image"), isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  config: jsonb("config").$type<Record<string, unknown>>(),
  ...stamps,
});
export const teams = pgTable("teams", {
  id: id(), name: text("name").notNull(), slug: slug(),
  sportId: uuid("sport_id").notNull().references(() => sports.id),
  gender: gender("gender"), description: text("description"),
  logo: img("logo"), coverImage: img("cover_image"), isActive: boolean("is_active").notNull().default(true), ...stamps,
}, (t) => [index("teams_sport_idx").on(t.sportId)]);
export const players = pgTable("players", {
  id: id(), teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(), profileImage: img("profile_image"),
  jerseyNumber: integer("jersey_number"), position: text("position"), bio: text("bio"),
  isActive: boolean("is_active").notNull().default(true), ...stamps,
}, (t) => [index("players_team_idx").on(t.teamId)]);
export const coaches = pgTable("coaches", {
  id: id(), teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(), role: text("role"), profileImage: img("profile_image"),
  bio: text("bio"), isActive: boolean("is_active").notNull().default(true), ...stamps,
});

// ---- Competitions ----
export const competitions = pgTable("competitions", {
  id: id(), name: text("name").notNull(), slug: slug(),
  sportId: uuid("sport_id").notNull().references(() => sports.id),
  season: text("season").notNull(), description: text("description"),
  startDate: date("start_date"), endDate: date("end_date"), coverImage: img("cover_image"),
  status: competitionStatus("status").notNull().default("upcoming"), ...stamps,
});
export const competitionTeams = pgTable("competition_teams", {
  id: id(), competitionId: uuid("competition_id").notNull().references(() => competitions.id, { onDelete: "cascade" }),
  teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }), groupName: text("group_name"),
}, (t) => [uniqueIndex("comp_team_uq").on(t.competitionId, t.teamId)]);
export const fixtures = pgTable("fixtures", {
  id: id(), competitionId: uuid("competition_id").notNull().references(() => competitions.id, { onDelete: "cascade" }),
  homeTeamId: uuid("home_team_id").notNull().references(() => teams.id),
  awayTeamId: uuid("away_team_id").notNull().references(() => teams.id),
  kickoffAt: timestamp("kickoff_at", { withTimezone: true }).notNull(),
  venue: text("venue"), round: text("round"), status: fixtureStatus("status").notNull().default("scheduled"),
  notes: text("notes"), ...stamps,
}, (t) => [index("fixtures_kickoff_idx").on(t.kickoffAt), index("fixtures_comp_idx").on(t.competitionId)]);
export const fixtureEvents = pgTable("fixture_events", {
  id: id(), fixtureId: uuid("fixture_id").notNull().references(() => fixtures.id, { onDelete: "cascade" }),
  type: text("type").notNull(), minute: integer("minute"), teamId: uuid("team_id").references(() => teams.id),
  playerId: uuid("player_id").references(() => players.id), data: jsonb("data").$type<Record<string, unknown>>(), ...stamps,
});
export const results = pgTable("results", {
  id: id(), fixtureId: uuid("fixture_id").notNull().unique().references(() => fixtures.id, { onDelete: "cascade" }),
  homeScore: integer("home_score").notNull(), awayScore: integer("away_score").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>(),
  summary: text("summary"), ...stamps,
});
export const standings = pgTable("standings", {
  id: id(), competitionId: uuid("competition_id").notNull().references(() => competitions.id, { onDelete: "cascade" }),
  teamId: uuid("team_id").notNull().references(() => teams.id, { onDelete: "cascade" }),
  played: integer("played").notNull().default(0), won: integer("won").notNull().default(0),
  drawn: integer("drawn").notNull().default(0), lost: integer("lost").notNull().default(0),
  scoreFor: integer("score_for").notNull().default(0), scoreAgainst: integer("score_against").notNull().default(0),
  points: integer("points").notNull().default(0),
  stats: jsonb("stats").$type<Record<string, number>>(),
  ...stamps,
}, (t) => [uniqueIndex("standings_uq").on(t.competitionId, t.teamId)]);

// ---- Editorial ----
export const news = pgTable("news", {
  id: id(), title: text("title").notNull(), slug: slug(),
  sportId: uuid("sport_id").references(() => sports.id, { onDelete: "set null" }),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "set null" }),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
  excerpt: text("excerpt"), content: text("content").notNull(), coverImage: img("cover_image"),
  author: text("author"), isFeatured: boolean("is_featured").notNull().default(false),
  status: publishStatus("status").notNull().default("draft"), publishedAt: timestamp("published_at", { withTimezone: true }), ...stamps,
});
export const announcements = pgTable("announcements", {
  id: id(), title: text("title").notNull(), slug: slug(), description: text("description").notNull(),
  sportId: uuid("sport_id").references(() => sports.id, { onDelete: "set null" }),
  flyer: img("flyer"), priority: priority("priority").notNull().default("normal"),
  publishedAt: timestamp("published_at", { withTimezone: true }), expiresAt: timestamp("expires_at", { withTimezone: true }),
  status: publishStatus("status").notNull().default("draft"), ...stamps,
});
export const events = pgTable("events", {
  id: id(), title: text("title").notNull(), slug: slug(), description: text("description"),
  sportId: uuid("sport_id").references(() => sports.id, { onDelete: "set null" }),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(), endsAt: timestamp("ends_at", { withTimezone: true }),
  venue: text("venue"), coverImage: img("cover_image"), isFeatured: boolean("is_featured").notNull().default(false),
  status: publishStatus("status").notNull().default("draft"), ...stamps,
});

// ---- Media ----
export const galleryAlbums = pgTable("gallery_albums", {
  id: id(), title: text("title").notNull(), slug: slug(), description: text("description"),
  sportId: uuid("sport_id").references(() => sports.id, { onDelete: "set null" }),
  competitionId: uuid("competition_id").references(() => competitions.id, { onDelete: "set null" }),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "set null" }),
  year: integer("year"), albumDate: date("album_date"), coverImage: img("cover_image"),
  isFeatured: boolean("is_featured").notNull().default(false),
  status: publishStatus("status").notNull().default("draft"), ...stamps,
});
export const galleryImages = pgTable("gallery_images", {
  id: id(), albumId: uuid("album_id").notNull().references(() => galleryAlbums.id, { onDelete: "cascade" }),
  publicId: text("public_id").notNull(), url: text("url").notNull(), width: integer("width"), height: integer("height"),
  caption: text("caption"), altText: text("alt_text"), displayOrder: integer("display_order").notNull().default(0), ...stamps,
}, (t) => [index("gallery_album_idx").on(t.albumId)]);

// ---- Organization ----
export const committeeMembers = pgTable("committee_members", {
  id: id(), fullName: text("full_name").notNull(), position: text("position").notNull(),
  profileImage: img("profile_image"), bio: text("bio"), email: text("email"),
  isActive: boolean("is_active").notNull().default(true), displayOrder: integer("display_order").notNull().default(0), ...stamps,
});
export const sponsors = pgTable("sponsors", {
  id: id(), name: text("name").notNull(), logo: img("logo"), websiteUrl: text("website_url"), description: text("description"),
  isActive: boolean("is_active").notNull().default(true), displayOrder: integer("display_order").notNull().default(0), ...stamps,
});

// ---- Site configuration ----
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(), value: jsonb("value").notNull(), updatedAt: stamps.updatedAt,
});
export const pageHeroes = pgTable("page_heroes", {
  id: id(), pageKey: text("page_key").notNull().unique(), title: text("title"), subtitle: text("subtitle"), image: img("image"), ...stamps,
});
export const heroSlides = pgTable("hero_slides", {
  id: id(), heading: text("heading").notNull(), description: text("description"), image: img("image").notNull(),
  ctaLabel: text("cta_label"), ctaHref: text("cta_href"), secondaryCtaLabel: text("secondary_cta_label"), secondaryCtaHref: text("secondary_cta_href"),
  isActive: boolean("is_active").notNull().default(true), displayOrder: integer("display_order").notNull().default(0), ...stamps,
});
