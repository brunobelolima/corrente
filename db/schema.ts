import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  email: text("email").primaryKey(),
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  city: text("city").notNull(),
  level: text("level").notNull(),
  bio: text("bio").notNull(),
  surftripDestination: text("surftrip_destination").notNull().default(""),
  surftripDate: text("surftrip_date").notNull().default(""),
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
