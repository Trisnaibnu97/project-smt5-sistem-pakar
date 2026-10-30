<?php

namespace Tests\Feature;

use App\Models\SchoolClass;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationAndAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'wali3a@sdit-uq.sch.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'role', 'classes'],
            ]);

        $this->assertEquals('wali_kelas', $response->json('user.role'));
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $response = $this->postJson('/api/auth/login', [
            'email'    => 'wali3a@sdit-uq.sch.id',
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $response = $this->getJson('/api/classes/mine');
        $response->assertStatus(401);
    }

    public function test_wali_kelas_can_only_access_assigned_classes(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();
        $class3a = SchoolClass::where('name', '3A')->firstOrFail();
        $class4b = SchoolClass::where('name', '4B')->firstOrFail();

        // Wali 3A accessing 3A -> 200 OK
        $responseOk = $this->actingAs($wali3a)->getJson("/api/classes/{$class3a->id}/students");
        $responseOk->assertStatus(200)
            ->assertJsonStructure(['class', 'students']);

        // Wali 3A accessing 4B -> 403 Forbidden
        $responseForbidden = $this->actingAs($wali3a)->getJson("/api/classes/{$class4b->id}/students");
        $responseForbidden->assertStatus(403)
            ->assertJson(['message' => 'Akses ditolak: Anda tidak ditugaskan pada kelas ini.']);
    }

    public function test_guru_bk_can_access_all_classes(): void
    {
        $guruBk = User::where('email', 'bk@sdit-uq.sch.id')->firstOrFail();
        $class4b = SchoolClass::where('name', '4B')->firstOrFail();

        $response = $this->actingAs($guruBk)->getJson("/api/classes/{$class4b->id}/students");
        $response->assertStatus(200);
    }

    public function test_wali_kelas_cannot_perform_admin_actions(): void
    {
        $wali3a = User::where('email', 'wali3a@sdit-uq.sch.id')->firstOrFail();

        $response = $this->actingAs($wali3a)->postJson('/api/admin/kb-versions', [
            'version_code' => 'v2.0-UNAUTHORIZED',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_view_audit_logs(): void
    {
        $admin = User::where('email', 'admin@sdit-uq.sch.id')->firstOrFail();

        $response = $this->actingAs($admin)->getJson('/api/admin/audit-logs');
        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'current_page']);
    }

    public function test_user_can_register_as_wali_kelas(): void
    {
        $class3b = SchoolClass::where('name', '3B')->firstOrFail();

        $response = $this->postJson('/api/auth/register', [
            'name'     => 'Ustadzah Baru, S.Pd',
            'email'    => 'ustadzah.baru@sdit-uq.sch.id',
            'password' => 'secret123',
            'role'     => 'wali_kelas',
            'class_id' => $class3b->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'token', 'user'])
            ->assertJsonPath('user.role', 'wali_kelas');

        $this->assertDatabaseHas('users', [
            'email' => 'ustadzah.baru@sdit-uq.sch.id',
            'role'  => 'wali_kelas',
        ]);
    }

    public function test_admin_and_guru_bk_quota_limit_to_two_accounts_and_redirects_to_wali_kelas(): void
    {
        // 1. Tambah admin ke-2 (di seeder sudah ada 1 admin)
        $this->postJson('/api/auth/register', [
            'name'     => 'Admin Dua, S.Kom',
            'email'    => 'admin2@sdit-uq.sch.id',
            'password' => 'secret123',
            'role'     => 'admin',
        ])->assertStatus(201)->assertJsonPath('user.role', 'admin');

        $this->assertEquals(2, User::where('role', 'admin')->count());

        // 2. Coba daftar sebagai admin ke-3 -> Kuota penuh (>=2), dialihkan ke wali_kelas
        $resThirdAdmin = $this->postJson('/api/auth/register', [
            'name'     => 'Calon Admin Ketiga',
            'email'    => 'admin3@sdit-uq.sch.id',
            'password' => 'secret123',
            'role'     => 'admin',
        ]);

        $resThirdAdmin->assertStatus(201)
            ->assertJsonPath('user.role', 'wali_kelas')
            ->assertJsonPath('redirected_to_wali', true);

        // Jumlah admin di database tetap 2
        $this->assertEquals(2, User::where('role', 'admin')->count());

        // 3. Tambah Guru BK ke-2 (di seeder sudah ada 1 Guru BK)
        $this->postJson('/api/auth/register', [
            'name'     => 'Guru BK Dua, S.Psi',
            'email'    => 'bk2@sdit-uq.sch.id',
            'password' => 'secret123',
            'role'     => 'guru_bk',
        ])->assertStatus(201)->assertJsonPath('user.role', 'guru_bk');

        $this->assertEquals(2, User::where('role', 'guru_bk')->count());

        // 4. Coba daftar sebagai Guru BK ke-3 -> Kuota penuh (>=2), dialihkan ke wali_kelas
        $resThirdBk = $this->postJson('/api/auth/register', [
            'name'     => 'Calon BK Ketiga',
            'email'    => 'bk3@sdit-uq.sch.id',
            'password' => 'secret123',
            'role'     => 'guru_bk',
        ]);

        $resThirdBk->assertStatus(201)
            ->assertJsonPath('user.role', 'wali_kelas')
            ->assertJsonPath('redirected_to_wali', true);

        // Jumlah Guru BK di database tetap 2
        $this->assertEquals(2, User::where('role', 'guru_bk')->count());
    }
}
