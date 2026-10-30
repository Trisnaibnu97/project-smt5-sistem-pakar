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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('grade_level'); // 1 to 6
            $table->string('name', 50)->unique();       // e.g. '3A', '4B'
            $table->string('academic_year', 20);       // e.g. '2026/2027'
            $table->timestamps();
        });

        Schema::create('user_class_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'class_id']);
        });

        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_code', 50)->unique();
            $table->string('name', 150);
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
        Schema::dropIfExists('user_class_assignments');
        Schema::dropIfExists('classes');
    }
};
