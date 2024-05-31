<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function actingAsTestUser()
    {
        $user = User::factory()->create(["role_id" => 1]);
        return $this->actingAs($user);
    }
}
