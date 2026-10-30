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
        Schema::create('screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->restrictOnDelete();
            $table->foreignId('conducted_by_user_id')->constrained('users')->restrictOnDelete();
            $table->foreignId('kb_version_id')->constrained('kb_versions')->restrictOnDelete();
            $table->string('observation_period', 50);
            $table->enum('status', ['draft', 'submitted', 'reviewed', 'completed'])->default('submitted');
            $table->timestamps();
        });

        Schema::create('screening_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('screening_id')->constrained('screenings')->cascadeOnDelete();
            $table->foreignId('indicator_id')->constrained('indicators')->restrictOnDelete();
            $table->enum('answer_value', ['tidak-pernah', 'jarang', 'kadang', 'sering', 'selalu', 'belum']);
            $table->decimal('cf_user', 4, 3)->nullable();
            $table->timestamps();

            $table->unique(['screening_id', 'indicator_id']);
        });

        Schema::create('screening_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('screening_id')->constrained('screenings')->cascadeOnDelete();
            $table->foreignId('hypothesis_id')->constrained('hypotheses')->restrictOnDelete();
            $table->decimal('final_cf', 4, 3)->nullable();
            $table->enum('indication_level', ['belum_cukup_data', 'rendah', 'sedang', 'kuat']);
            $table->unsignedInteger('answered_count');
            $table->unsignedInteger('total_indicators');
            $table->timestamps();

            $table->unique(['screening_id', 'hypothesis_id']);
        });

        Schema::create('screening_result_traces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('screening_result_id')->constrained('screening_results')->cascadeOnDelete();
            $table->foreignId('cf_rule_id')->constrained('cf_rules')->restrictOnDelete();
            $table->decimal('cf_user', 4, 3);
            $table->decimal('cf_expert', 4, 3);
            $table->decimal('cf_evidence', 4, 3);
            $table->unsignedInteger('step_order');
            $table->decimal('running_cf', 4, 3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('screening_result_traces');
        Schema::dropIfExists('screening_results');
        Schema::dropIfExists('screening_answers');
        Schema::dropIfExists('screenings');
    }
};
