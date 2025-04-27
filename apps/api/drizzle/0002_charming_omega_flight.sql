CREATE TYPE "public"."payment_statuses" AS ENUM('waiting_for_capture', 'pending', 'succeeded', 'canceled');--> statement-breakpoint
CREATE TABLE "project_payments" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"amount" double precision NOT NULL,
	"yookassa_id" varchar(255) NOT NULL,
	"status" "payment_statuses" DEFAULT 'waiting_for_capture' NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"idempotency_key" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "project_payments_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "project_payments" ADD CONSTRAINT "project_payments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;