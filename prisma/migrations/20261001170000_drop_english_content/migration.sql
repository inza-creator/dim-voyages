ALTER TABLE "Experience" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Experience" DROP COLUMN IF EXISTS "subtitleEn";
ALTER TABLE "Experience" DROP COLUMN IF EXISTS "excerptEn";
ALTER TABLE "Experience" DROP COLUMN IF EXISTS "descriptionEn";
ALTER TABLE "Experience" DROP COLUMN IF EXISTS "highlightsEn";

ALTER TABLE "Service" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "excerptEn";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "descriptionEn";

ALTER TABLE "Destination" DROP COLUMN IF EXISTS "nameEn";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "regionEn";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "excerptEn";
ALTER TABLE "Destination" DROP COLUMN IF EXISTS "descriptionEn";

ALTER TABLE "Offer" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Offer" DROP COLUMN IF EXISTS "destinationLabelEn";
ALTER TABLE "Offer" DROP COLUMN IF EXISTS "excerptEn";
ALTER TABLE "Offer" DROP COLUMN IF EXISTS "descriptionEn";
ALTER TABLE "Offer" DROP COLUMN IF EXISTS "badgeEn";

ALTER TABLE "Article" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "Article" DROP COLUMN IF EXISTS "excerptEn";
ALTER TABLE "Article" DROP COLUMN IF EXISTS "contentEn";

ALTER TABLE "Testimonial" DROP COLUMN IF EXISTS "contentEn";

ALTER TABLE "Faq" DROP COLUMN IF EXISTS "questionEn";
ALTER TABLE "Faq" DROP COLUMN IF EXISTS "answerEn";

ALTER TABLE "GalleryItem" DROP COLUMN IF EXISTS "titleEn";
ALTER TABLE "GalleryItem" DROP COLUMN IF EXISTS "captionEn";

DELETE FROM "SiteSetting" WHERE "key" IN ('addressEn', 'signatureEn', 'awardEn', 'aboutTextEn');
