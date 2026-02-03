-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_original_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_professional_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_service_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_tenant_id_fkey";

-- DropIndex
DROP INDEX "idx_appointments_end_time";

-- DropIndex
DROP INDEX "idx_appointments_start_time";

-- AlterTable
ALTER TABLE "app_clients" ADD COLUMN     "avatar_url" TEXT;

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "app_client_id" UUID;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "address" VARCHAR(255),
ADD COLUMN     "address_num" VARCHAR(20),
ADD COLUMN     "city" VARCHAR(100),
ADD COLUMN     "cover_url" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "latitude" DECIMAL(10,8),
ADD COLUMN     "logo_url" TEXT,
ADD COLUMN     "longitude" DECIMAL(11,8),
ADD COLUMN     "neighborhood" VARCHAR(100),
ADD COLUMN     "phone" VARCHAR(20),
ADD COLUMN     "state" VARCHAR(2),
ADD COLUMN     "zip_code" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_app_client_id_fkey" FOREIGN KEY ("app_client_id") REFERENCES "app_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_original_appointment_id_fkey" FOREIGN KEY ("original_appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
