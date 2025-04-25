CREATE TYPE "public"."status" AS ENUM('WAITING', 'ACCEPTED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "project_answers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"votingId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_reviews" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'WAITING' NOT NULL,
	"description" text NOT NULL,
	"userId" varchar(255) NOT NULL,
	"anonymous" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_votes" (
	"userId" varchar(255) NOT NULL,
	"votingId" varchar(255) NOT NULL,
	"answerId" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_votes_userId_votingId_pk" PRIMARY KEY("userId","votingId")
);
--> statement-breakpoint
CREATE TABLE "project_votings" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"imageId" varchar(255) NOT NULL,
	"question" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"from" timestamp with time zone NOT NULL,
	"to" timestamp with time zone NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdBy" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_answers" ADD CONSTRAINT "project_answers_votingId_project_votings_id_fk" FOREIGN KEY ("votingId") REFERENCES "public"."project_votings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_reviews" ADD CONSTRAINT "project_reviews_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_votings" ADD CONSTRAINT "project_votings_imageId_project_files_id_fk" FOREIGN KEY ("imageId") REFERENCES "public"."project_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_votings" ADD CONSTRAINT "project_votings_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_vote_idx" ON "project_votes" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "event_vote_idx" ON "project_votes" USING btree ("votingId");