<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;

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
        Redis::throttle('upload-csv')->allow(1)->every(30)->then(function () {
            $data = array_map('str_getcsv', file($this->file));

            foreach ($data as $row) {
                // add to database
            }

            // delete the file after adding it to database
            unlink($this->file);
        }, function () {
            return $this->release(10);
        });
    }
}
