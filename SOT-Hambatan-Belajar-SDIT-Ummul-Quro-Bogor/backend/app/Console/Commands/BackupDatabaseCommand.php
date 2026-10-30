<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class BackupDatabaseCommand extends Command
{
    protected $signature = 'sipakar:backup-db';
    protected $description = 'Otomatisasi backup database SQLite SiPakar dengan timestamp dan retensi berkala';

    public function handle()
    {
        $this->info('Memulai proses backup database SiPakar...');

        $databasePath = database_path('database.sqlite');
        if (!File::exists($databasePath)) {
            $this->error("Database file tidak ditemukan di: {$databasePath}");
            return Command::FAILURE;
        }

        $backupDir = storage_path('backups');
        if (!File::exists($backupDir)) {
            File::makeDirectory($backupDir, 0755, true);
        }

        $timestamp = date('Y-m-d_H-i-s');
        $targetFile = $backupDir . DIRECTORY_SEPARATOR . "sipakar_backup_{$timestamp}.sqlite";

        if (File::copy($databasePath, $targetFile)) {
            $sizeKb = round(File::size($targetFile) / 1024, 2);
            $this->info("Backup berhasil dibuat: {$targetFile} ({$sizeKb} KB)");

            $files = File::files($backupDir);
            $cutoff = time() - (30 * 24 * 60 * 60);
            $deletedCount = 0;

            foreach ($files as $file) {
                if ($file->getMTime() < $cutoff) {
                    File::delete($file->getPathname());
                    $deletedCount++;
                }
            }

            if ($deletedCount > 0) {
                $this->info("Retensi backup: {$deletedCount} file backup lama (>30 hari) berhasil dibersihkan.");
            }

            return Command::SUCCESS;
        }

        $this->error('Gagal menyalin file database ke direktori backup.');
        return Command::FAILURE;
    }
}