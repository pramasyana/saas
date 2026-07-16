<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('booking_id')->nullable();
            $table->uuid('customer_id')->nullable();
            $table->string('number')->unique();
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'pending', 'paid', 'partial', 'cancelled'])->default('pending');
            $table->string('payment_method')->nullable();
            $table->decimal('paid_amount', 15, 2)->default(0);
            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'customer_id']);
        });

        Schema::create('customer_invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('invoice_id');
            $table->enum('type', ['service', 'addon', 'discount', 'tax']);
            $table->string('name');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('total_price', 15, 2)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('invoice_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_invoice_items');
        Schema::dropIfExists('customer_invoices');
    }
};
