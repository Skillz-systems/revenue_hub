<?php

namespace App\Http\Controllers;

use App\Models\DemandNotice;
use App\Models\Property;
use Illuminate\Http\Request;

class DemandNoticeController extends Controller
{
    // public function index()
    // {
    //     $demandNotices = DemandNotice::with('property')->get();
    //     return response()->json($demandNotices);
    // }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'status' => 'required|string',
            'date_issued' => 'required|date',
        ]);

        $demandNotice = DemandNotice::create($validated);
        return response()->json($demandNotice, 201);
    }

    // public function show(DemandNotice $demandNotice)
    // {
    //     return response()->json($demandNotice->load('property'));
    // }

    // public function edit(DemandNotice $demandNotice)
    // {
    //     // Typically return a view for editing demand notice
    // }

    // public function update(Request $request, DemandNotice $demandNotice)
    // {
    //     $validated = $request->validate([
    //         'property_id' => 'required|exists:properties,id',
    //         'notice' => 'required|string',
    //         'date_issued' => 'required|date',
    //         'due_date' => 'required|date|after_or_equal:date_issued',
    //     ]);

    //     $demandNotice->update($validated);
    //     return response()->json($demandNotice);
    // }

    public function destroy(DemandNotice $demandNotice)
    {
        $demandNotice->delete();
        return response()->json(null, 204);
    }
}
