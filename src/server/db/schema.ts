import { relations, sql } from "drizzle-orm";
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
import type { AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `project_${name}`);

export const donationsTypeEnum = pgEnum("donationsEnum", [
  "CRYPTO",
  "FIAT",
])

export const donationStatusEnum = pgEnum("donationStatusEnum", [
  "PENDING",
  "CANCELED",
  "COMPLITED",
])

export const donations = createTable("donations", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  transactionId: varchar("transaction_id", { length: 255 })
    .unique(),
  idempotencyKey: varchar("idempotency_key", { length: 255 })
    .unique(),

  confirmationUrl: text("confirmation_url"),
  type: donationsTypeEnum("donation_type")
    .notNull(),
  status: donationStatusEnum("donation_status")
    .notNull()
    .default("PENDING"),

  senderId: varchar("sender_id", { length: 255 })
    .references(() => users.id),

  recipientId: varchar("recipient_id", { length: 255 })
    .notNull()
    .references(() => users.id),

  votingId: varchar("voting_id", { length: 255 })
    .notNull()
    .references(() => votings.id),

  amount: integer("amount")
    .notNull(),
  comment: varchar("comment", {length:160}),

  createdAt: timestamp("created_at",{
    withTimezone:true,
    mode:"date",
  })
    .notNull()
    .defaultNow(),
})

export const wallets = createTable("wallets", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId", { length: 255 })
    .notNull(),
  wallet: text("wallet")
    .notNull(),
})

export const votes = createTable("votes", {
  userId: varchar("userId", { length: 255 })
    .notNull(),
  votingId:varchar("votingId", {length:255})
    .notNull(),
  answerId:varchar("answerId", {length:255})
    .notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),

}, (vote) => ({
    compoundKey: primaryKey({
      columns:[vote.userId, vote.votingId]
    }),
    userIdx: index("user_vote_idx").on(
      vote.userId,
    ),
    voteIdx: index("event_vote_idx").on(
      vote.votingId,
    ),
  })
);

export const voteRelations = relations(votes, ({one}) => ({
  user:one(users, {
    fields:[votes.userId],
    references:[users.id],
    relationName:"vote_user",
  }),
  voting:one(votings, {
    fields:[votes.votingId],
    references:[votings.id],
    relationName:"voting_vote",
  }),
  answer:one(answers, {
    fields:[votes.answerId],
    references:[answers.id],
    relationName:"voting_answer",
  }),
}))

export const answers = createTable("answers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  description: text("description")
    .notNull(),
  votingId: varchar("votingId", { length: 255 })
    .notNull()
    .references(() => votings.id),
})

export const answerRelation = relations(answers, ({one, many}) => ({
  voting: one(votings,{
    fields:[answers.votingId],
    references:[votings.id],
    relationName:"voting_answer"
  }),
  votes: many(votes)
}))

export const votings = createTable("votings", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  imageId: varchar("imageId", { length: 255 })
    .notNull()
    .references(() => files.id),
  question: varchar("question", {length:255})
    .notNull(),
  description: text("description")
    .notNull(),

  from: timestamp("from", {withTimezone:true})
    .notNull(),
  to: timestamp("to", {withTimezone:true})
    .notNull(),

  isDeleted: boolean("isDeleted")
    .notNull()
    .default(false),
  createdBy: varchar("createdBy", { length: 255 })
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const votingRelations = relations(votings, ({ one, many }) => ({
  answers:many(answers),
  votes: many(votes),
  owner: one(users, {
    fields:[votings.createdBy],
    references:[users.id],
    relationName:"voting_owner",
  })
}))

export const statusEnum = pgEnum("status", [
  "WAITING",
  "ACCEPTED",
  "CANCELED",
])

export const reviews = createTable("reviews", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status:statusEnum("status")
    .notNull()
    .default("WAITING"),
  description: text("description")
    .notNull(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  anonymous: boolean("anonymous")
    .notNull()
    .default(false),
  isDeleted: boolean("isDeleted")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const reviewRelations = relations(reviews, ({one}) => ({
  user:one(users,{
    fields:[reviews.userId],
    references:[users.id],
    relationName:"review_user"
  })
}))

export const files = createTable("files", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileSize: integer("file_size").notNull(),
  contentType: varchar("content_type", { length: 255 }).notNull(),

  objectId: varchar("object_id", { length: 255 }).notNull(),
  createdById: varchar("created_by", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "USER"]);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  balance: integer("balance")
    .notNull()
    .default(0),
  image: varchar("image", { length: 255 })
  .references(() => files.id),
  role: userRoleEnum("role").default("USER"),

  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  deletedAt: timestamp("deleted_at", {
    mode: "date",
    withTimezone: true,
  }),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  avatar: one(files, {
    fields:[users.image],
    references:[files.id],
    relationName:"user_avatar"
  }),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

