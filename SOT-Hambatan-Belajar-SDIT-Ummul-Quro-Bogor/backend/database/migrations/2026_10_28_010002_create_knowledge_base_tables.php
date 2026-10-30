<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kb_versions', function (Blueprint $table) {
            $table->id();
            $table->string('version_code', 20)->unique();
            $table->enum('status', ['draft', 'review', 'approved', 'active', 'archived'])->default('draft');
            $table->string('reviewer_name', 150)->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
        });

        Schema::create('hypotheses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kb_version_id')->constrained('kb_versions')->cascadeOnDelete();
            $table->string('code', 20);
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->timestamps();

            $table->unique(['kb_version_id', 'code']);
        });

        Schema::create('indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kb_version_id')->constrained('kb_versions')->cascadeOnDelete();
            $table->string('code', 20);
            $table->text('operational_text');
            $table->text('observation_guide')->nullable();
            $table->timestamps();

            $table->unique(['kb_version_id', 'code']);
        });

        Schema::create('cf_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hypothesis_id')->constrained('hypotheses')->cascadeOnDelete();
            $table->foreignId('indicator_id')->constrained('indicators')->cascadeOnDelete();
            $table->decimal('expert_mb', 4, 3);
            $table->decimal('expert_md', 4, 3);
            $table->decimal('expert_cf', 4, 3);
            $table->timestamps();

            $table->unique(['hypothesis_id', 'indicator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cf_rules');
        Schema::dropIfExists('indicators');
        Schema::dropIfExists('hypotheses');
        Schema::dropIfExists('kb_versions');
    }
};
