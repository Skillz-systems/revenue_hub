<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\SimpleExcel\SimpleExcelReader;

class ProcessCSVFileInBatchJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $data;

    /**
     * Create a new job instance.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        SimpleExcelReader::create(storage_path($this->data))
            ->useDelimiter(',')
            ->noHeaderRow()
            ->getRows()
            ->chunk(5000)
            ->each(
                function ($chunk) {
                    ImportPropertyChunkJob::dispatch("others", $chunk);
                    ImportPropertyChunkJob::dispatch("property", $chunk);
                }
            );
    }
}
