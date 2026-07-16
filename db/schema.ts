import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  gender: text("gender").notNull().default(""),
  heightCm: integer("height_cm").notNull().default(0),
  relationshipIntent: text("relationship_intent").notNull().default(""),
  alcoholUse: text("alcohol_use").notNull().default(""),
  smokingUse: text("smoking_use").notNull().default(""),
  politicalView: text("political_view").notNull().default(""),
  musicTaste: text("music_taste").notNull().default(""),
  instagramUsername: text("instagram_username").notNull().default(""),
  spotifyUrl: text("spotify_url").notNull().default(""),
  city: text("city").notNull(),
  level: text("level").notNull(),
  boardType: text("board_type").notNull().default(""),
  bio: text("bio").notNull(),
  surftripDestination: text("surftrip_destination").notNull().default(""),
  surftripDate: text("surftrip_date").notNull().default(""),
  surftripArrivalDate: text("surftrip_arrival_date").notNull().default(""),
  surftripDepartureDate: text("surftrip_departure_date").notNull().default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const profilePhotos = sqliteTable("profile_photos", {
  id: text("id").primaryKey(),
  profileEmail: text("profile_email").notNull().references(() => profiles.email, { onDelete: "cascade" }),
  objectKey: text("object_key").notNull(),
  position: integer("position").notNull(),
  contentType: text("content_type").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const tripGroupMembers = sqliteTable("trip_group_members", {
  groupId: text("group_id").notNull(),
  profileEmail: text("profile_email").notNull(),
  joinedAt: integer("joined_at").notNull(),
}, table => [primaryKey({ columns: [table.groupId, table.profileEmail] })]);

export const tripGroupMessages = sqliteTable("trip_group_messages", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull(),
  profileEmail: text("profile_email").notNull(),
  authorName: text("author_name").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at").notNull(),
});
