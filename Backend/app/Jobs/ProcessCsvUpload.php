<?php

namespace App\Jobs;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\Redis;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class ProcessCsvUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $file;
    /**
     * Create a new job instance.
     */
    public function __construct(string $file)
    {
        $this->file = $file;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        // this allows one file to be processed every 30 seconds
        Redis::throttle('upload-csv')->allow(1)->every(20)->then(function () {

            dump("Processing files : " . $this->file);
            $data = array_map('str_getcsv', file($this->file));

            foreach ($data as $row) {
                // add to database
                Property::create([
                    'pid' => $row[0],
                    'occupant' => $row[1],
                    'prop_addr' => $row[2],
                    'street_name' => $row[3],
                    'asset_no' => $row[4],
                    'cadastral_zone' => $row[5],
                    'prop_type' => $row[6],
                    'prop_use' => $row[7],
                    'rating_dist' => $row[8],
                    'annual_value' => $row[9],
                    'rate_payable' => $row[10],
                    //'arrears' => $row[11],
                    //'penalty' => $row[12],
                    'grand_total' => $row[13],
                    'category' => $row[14],
                    'group' => $row[15],
                    'active' => $row[16],
                ]);
            }

            dump("Done Inserting file : " . $this->file);
            // delete the file after adding it to database
            unlink($this->file);
        }, function () {
            return $this->release(20);
        });
    }
}
