import {
	boolean,
	index,
	integer,
	pgEnum,
	pgTableCreator,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { relations } from "drizzle-orm";
export * from "./auth-schema";

export const createTable = pgTableCreator(name => `project_${name}`);

export const files = createTable("files", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => Bun.randomUUIDv7()),
	fileName: varchar("file_name", { length: 255 }).notNull(),
	fileSize: integer("file_size").notNull(),
	placeholder: text("placeholder"),
	contentType: varchar("content_type", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const votes = createTable(
	"votes",
	{
		userId: varchar("userId", { length: 255 }).notNull(),
		votingId: varchar("votingId", { length: 255 }).notNull(),
		answerId: varchar("answerId", { length: 255 }).notNull(),

		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	vote => ({
		compoundKey: primaryKey({
			columns: [vote.userId, vote.votingId],
		}),
		userIdx: index("user_vote_idx").on(vote.userId),
		voteIdx: index("event_vote_idx").on(vote.votingId),
	}),
);

export const voteRelations = relations(votes, ({ one }) => ({
	user: one(user, {
		fields: [votes.userId],
		references: [user.id],
		relationName: "vote_user",
	}),
	voting: one(votings, {
		fields: [votes.votingId],
		references: [votings.id],
		relationName: "voting_vote",
	}),
	answer: one(answers, {
		fields: [votes.answerId],
		references: [answers.id],
		relationName: "voting_answer",
	}),
}));

export const answers = createTable("answers", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	description: text("description").notNull(),
	votingId: varchar("votingId", { length: 255 })
		.notNull()
		.references(() => votings.id),
});

export const answerRelation = relations(answers, ({ one, many }) => ({
	voting: one(votings, {
		fields: [answers.votingId],
		references: [votings.id],
		relationName: "voting_answer",
	}),
	votes: many(votes),
}));

export const votings = createTable("votings", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),

	imageId: varchar("imageId", { length: 255 })
		.notNull()
		.references(() => files.id),
	question: varchar("question", { length: 255 }).notNull(),
	description: text("description").notNull(),

	from: timestamp("from", { withTimezone: true }).notNull(),
	to: timestamp("to", { withTimezone: true }).notNull(),

	isDeleted: boolean("isDeleted").notNull().default(false),
	createdBy: varchar("createdBy", { length: 255 })
		.notNull()
		.references(() => user.id),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const votingRelations = relations(votings, ({ one, many }) => ({
	answers: many(answers),
	votes: many(votes),
	owner: one(user, {
		fields: [votings.createdBy],
		references: [user.id],
		relationName: "voting_owner",
	}),
}));

export const statusEnum = pgEnum("status", ["WAITING", "ACCEPTED", "CANCELED"]);

export const reviews = createTable("reviews", {
	id: varchar("id", { length: 255 })
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	status: statusEnum("status").notNull().default("WAITING"),
	description: text("description").notNull(),
	userId: varchar("userId", { length: 255 })
		.notNull()
		.references(() => user.id),
	anonymous: boolean("anonymous").notNull().default(false),
	isDeleted: boolean("isDeleted").notNull().default(false),
	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviewRelations = relations(reviews, ({ one }) => ({
	user: one(user, {
		fields: [reviews.userId],
		references: [user.id],
		relationName: "review_user",
	}),
}));
