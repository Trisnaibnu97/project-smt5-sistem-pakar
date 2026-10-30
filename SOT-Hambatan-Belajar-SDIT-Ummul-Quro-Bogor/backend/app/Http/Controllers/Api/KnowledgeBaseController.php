<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\CfRule;
use App\Models\Hypothesis;
use App\Models\Indicator;
use App\Models\KbVersion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KnowledgeBaseController extends Controller
{
    /**
     * List all knowledge base versions.
     */
    public function indexVersions(): JsonResponse
    {
        $versions = KbVersion::withCount(['hypotheses', 'indicators'])
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'versions' => $versions,
        ]);
    }

    /**
     * Get active knowledge base with hypotheses and indicators.
     */
    public function getActive(): JsonResponse
    {
        $activeKb = KbVersion::where('status', 'active')
            ->with(['hypotheses.cfRules.indicator'])
            ->first();

        if (!$activeKb) {
            return response()->json(['message' => 'Tidak ada basis pengetahuan aktif.'], 404);
        }

        return response()->json([
            'kb_version' => $activeKb,
        ]);
    }

    /**
     * Create new KB version draft.
     */
    public function storeVersion(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'version_code'  => 'required|string|max:20|unique:kb_versions,version_code',
            'reviewer_name' => 'nullable|string|max:150',
            'notes'         => 'nullable|string',
        ]);

        $version = KbVersion::create([
            'version_code'  => $validated['version_code'],
            'status'        => 'draft',
            'reviewer_name' => $validated['reviewer_name'] ?? null,
            'notes'         => $validated['notes'] ?? null,
        ]);

        AuditLog::record($request->user()->id, 'CREATE_KB_VERSION', 'kb_versions', $version->id, [
            'version_code' => $version->version_code,
        ], $request->ip());

        return response()->json([
            'message' => 'Draft versi basis pengetahuan berhasil dibuat.',
            'version' => $version,
        ], 201);
    }

    /**
     * Activate a reviewed KB version.
     */
    public function activateVersion(Request $request, int $id): JsonResponse
    {
        $version = KbVersion::findOrFail($id);

        // Archive currently active versions
        KbVersion::where('status', 'active')->update(['status' => 'archived']);

        $version->update([
            'status'       => 'active',
            'activated_at' => now(),
        ]);

        AuditLog::record($request->user()->id, 'ACTIVATE_KB_VERSION', 'kb_versions', $version->id, [
            'version_code' => $version->version_code,
        ], $request->ip());

        return response()->json([
            'message' => "Versi {$version->version_code} berhasil diaktifkan.",
            'version' => $version,
        ]);
    }

    /**
     * Create or update hypothesis.
     */
    public function storeHypothesis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kb_version_id' => 'required|exists:kb_versions,id',
            'code'          => 'required|string|max:20',
            'name'          => 'required|string|max:150',
            'description'   => 'nullable|string',
        ]);

        $hypothesis = Hypothesis::updateOrCreate(
            ['kb_version_id' => $validated['kb_version_id'], 'code' => $validated['code']],
            $validated
        );

        return response()->json([
            'message'    => 'Kategori hipotesis berhasil disimpan.',
            'hypothesis' => $hypothesis,
        ]);
    }

    /**
     * Create or update indicator.
     */
    public function storeIndicator(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kb_version_id'     => 'required|exists:kb_versions,id',
            'code'              => 'required|string|max:20',
            'operational_text'  => 'required|string',
            'observation_guide' => 'nullable|string',
        ]);

        $indicator = Indicator::updateOrCreate(
            ['kb_version_id' => $validated['kb_version_id'], 'code' => $validated['code']],
            $validated
        );

        return response()->json([
            'message'   => 'Indikator observasi berhasil disimpan.',
            'indicator' => $indicator,
        ]);
    }

    /**
     * Create or update CF rule.
     */
    public function storeRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hypothesis_id' => 'required|exists:hypotheses,id',
            'indicator_id'  => 'required|exists:indicators,id',
            'expert_mb'     => 'required|numeric|between:0,1',
            'expert_md'     => 'required|numeric|between:0,1',
        ]);

        $expertCf = round($validated['expert_mb'] - $validated['expert_md'], 3);

        $rule = CfRule::updateOrCreate(
            [
                'hypothesis_id' => $validated['hypothesis_id'],
                'indicator_id'  => $validated['indicator_id'],
            ],
            [
                'expert_mb' => $validated['expert_mb'],
                'expert_md' => $validated['expert_md'],
                'expert_cf' => $expertCf,
            ]
        );

        return response()->json([
            'message' => 'Aturan bobot pakar Certainty Factor berhasil disimpan.',
            'rule'    => $rule,
        ]);
    }
}
