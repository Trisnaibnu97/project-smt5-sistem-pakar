<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\KbVersion;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\AuditLog;
use App\Models\CfRule;

class SmokeTestCommand extends Command
{
    protected $signature = 'sipakar:smoke-test';
    protected $description = 'Menjalankan deployment smoke test untuk memvalidasi kesiapan production SiPakar';

    public function handle()
    {
        $this->info("=================================================");
        $this->info("  SiPakar SDIT Ummul Quro - Deployment Smoke Test");
        $this->info("=================================================");

        $checks = [
            'Koneksi Database' => function () {
                DB::connection()->getPdo();
                return 'OK (Terhubung)';
            },
            'Pemeriksaan Akun Default' => function () {
                $admin = User::where('role', 'admin')->first();
                $bk = User::where('role', 'guru_bk')->first();
                $wali = User::where('role', 'wali_kelas')->first();

                if (!$admin || !$bk || !$wali) {
                    throw new \Exception('Seeder belum lengkap: Salah satu akun default role belum terdaftar.');
                }
                return 'OK (Admin, BK, Wali Kelas terdaftar)';
            },
            'Basis Pengetahuan Aktif' => function () {
                $activeKb = KbVersion::where('status', 'active')->first();
                if (!$activeKb) {
                    throw new \Exception('Tidak ada versi Knowledge Base aktif.');
                }
                $hypoCount = $activeKb->hypotheses()->count();
                $indicatorCount = $activeKb->indicators()->count();
                $ruleCount = CfRule::whereIn('hypothesis_id', $activeKb->hypotheses()->pluck('id'))->count();
                return "OK (Versi: {$activeKb->version_code}, Hipotesis: {$hypoCount}, Indikator: {$indicatorCount}, Aturan CF: {$ruleCount})";
            },
            'Integritas Kelas & Siswa Demo' => function () {
                $classesCount = SchoolClass::count();
                $studentsCount = Student::count();
                if ($classesCount === 0 || $studentsCount === 0) {
                    throw new \Exception('Data kelas atau siswa demo kosong.');
                }
                return "OK ({$classesCount} Kelas, {$studentsCount} Siswa)";
            },
            'Audit Logging System' => function () {
                AuditLog::record(null, 'smoke_test', 'system', null, ['status' => 'success', 'test' => 'deployment_readiness']);
                return 'OK (Tamper-evident audit log aktif)';
            },
        ];

        $failed = 0;
        foreach ($checks as $name => $check) {
            $this->output->write("• Menguji {$name}... ");
            try {
                $result = $check();
                $this->info("[LULUS] {$result}");
            } catch (\Throwable $e) {
                $this->error("[GAGAL] " . $e->getMessage());
                $failed++;
            }
        }

        $this->newLine();
        if ($failed === 0) {
            $this->info("✓ SEMUA SMOKE TEST LULUS DENGAN SUKSES! Siap untuk Production.");
            return Command::SUCCESS;
        }

        $this->error("✕ Terdapat {$failed} pemeriksaan yang gagal.");
        return Command::FAILURE;
    }
}