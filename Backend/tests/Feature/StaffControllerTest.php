<?php

namespace Tests\Feature;

use App\Mail\ForgotPasswordMail;
use Mockery;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Mail\RegisterMail;
use App\Service\StaffService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class StaffControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    public function test_that_staff_members_can_be_fetched()
    {
        // Arrange
        $role = Role::factory()->create();

        User::factory()->count(5)->create(["role_id" => $role->id]); // Assuming you have a User factory
        // Act
        $response = $this->actingAsTestUser()->getJson('/api/staff');
        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'email',
                        'phone',
                        'zone',
                        'role',
                    ]
                ],
            ]);
    }

    public function test_return_of_no_staff_found()
    {
        // Arrange
        // Mock the StaffService
        $staffServiceMock = Mockery::mock(StaffService::class);
        $staffServiceMock->shouldReceive('viewAllStaff')
            ->once()
            ->andReturn(null);

        $this->app->instance(StaffService::class, $staffServiceMock);

        // Act
        $response = $this->actingAsTestUser()->getJson('/api/staff');

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Staff found',
            ]);
    }

    public function it_should_return_error_when_required_fields_are_missing()
    {
        $response = $this->actingAsTestUser()->postJson('/api/staff', []);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required ',
            ]);
    }

    /** @test */
    public function it_should_return_success_when_user_is_registered()
    {
        Mail::fake();

        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '12345678901',
            'role_id' => "1",
            'zone' => 'Zone 1',

        ];

        $response = $this->actingAsTestUser()->postJson('/api/staff', $data);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'message' => 'Register Successfully',
            ]);

        // Assert that a mail was sent to the given email
        Mail::assertSent(RegisterMail::class, function ($mail) use ($data) {
            return $mail->hasTo($data['email']);
        });

        // Assert that the user was registered
        $this->assertDatabaseHas('users', [
            'email' => $data['email'],

        ]);
    }

    public function it_should_return_success_when_admin_requests_existing_user()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
        $staff = User::factory()->create();

        $this->actingAs($admin);

        $response = $this->getJson("/api/staff/{$staff->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $staff->id,
                    'name' => $staff->name,
                    'email' => $staff->email,
                    // Add other fields that you expect in the response
                ],
            ]);
    }

    /** @test */
    public function it_should_return_error_when_admin_requests_non_existing_user()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);

        $this->actingAs($admin);

        $response = $this->getJson("/api/staff/99999"); // Assuming 99999 is a non-existing user ID

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Staff Found',
            ]);
    }

    /** @test */
    public function it_should_return_error_when_non_admin_requests_user()
    {
        $user = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);
        $staff = User::factory()->create();

        $this->actingAs($user);

        $response = $this->getJson("/api/staff/{$staff->id}");

        $response->assertStatus(403);
    }

    public function admin_can_update_any_user()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
        $staff = User::factory()->create();

        $this->actingAs($admin);

        $response = $this->putJson("/api/users/{$staff->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
            'role_id' => 'new-role',
            'zone' => 'new-zone',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Update Successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $staff->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
            'role_id' => 'new-role',
            'zone' => 'new-zone',
        ]);
    }

    /** @test */
    public function user_can_update_their_own_profile()
    {
        $user = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);

        $this->actingAs($user);

        $response = $this->putJson("/api/staff/{$user->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Update Successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
        ]);
    }

    /** @test */
    public function user_cannot_update_another_users_profile()
    {
        $user = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);
        $otherUser = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);

        $this->actingAs($user);

        $response = $this->putJson("/api/staff/{$otherUser->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Credential error: You are not authorize',
            ]);
    }

    /** @test */
    public function update_fails_with_invalid_data()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
        $staff = User::factory()->create();

        $this->actingAs($admin);

        $response = $this->putJson("/api/staff/{$staff->id}", [
            'email' => 'not-an-email',
            'phone' => 'short',
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required ',
                'data' => [
                    'email' => ['The email field must be a valid email address.'],
                    'phone' => ['The phone field must be at least 11 characters.'],
                ],
            ]);
    }

    public function admin_can_delete_a_user()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);
        $staff = User::factory()->create();

        $this->actingAs($admin);

        $response = $this->deleteJson("/api/staff/{$staff->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Staff deleted successfully',
            ]);

        $this->assertDatabaseMissing('users', ['id' => $staff->id]);
    }

    /** @test */
    public function non_admin_cannot_delete_a_user()
    {
        $user = User::factory()->create(['role_id' => User::ROLE_ENFORCERS]);
        $staff = User::factory()->create();

        $this->actingAs($user);

        $response = $this->deleteJson("/api/staff/{$staff->id}");

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'You dont Have Permission',
            ]);

        $this->assertDatabaseHas('users', ['id' => $staff->id]);
    }

    /** @test */
    public function admin_cannot_delete_non_existent_user()
    {
        $admin = User::factory()->create(['role_id' => User::ROLE_ADMIN]);

        $this->actingAs($admin);

        $response = $this->deleteJson("/api/staff/999");

        $response->assertStatus(402)
            ->assertJson([
                'status' => 'error',
                'message' => 'An error occurred',
            ]);
    }

    public function user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'email',
                    'name',
                    // add other expected fields here
                ],
                'status',
                'message',
            ]);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Credential not match',
            ]);
    }

    /** @test */
    public function validation_errors_are_returned_for_invalid_input()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => '',
            'password' => '',
        ]);

        $response->assertStatus(400)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'email',
                    'password',
                ],
            ]);
    }

    public function it_requires_all_fields()
    {
        $response = $this->postJson('/api/auth/store-password', []);

        $response->assertStatus(403)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'password',
                    'user',
                    'token',
                ],
            ]);
    }

    /** @test */
    public function it_creates_password_successfully()
    {
        $user = User::factory()->create(["remember_token" => "valid-token"]);
        $password = 'password123';
        $token = 'valid-token';

        // Mock the StaffService to return true
        // $this->mock(StaffService::class, function ($mock) use ($password, $user, $token) {
        //     $mock->shouldReceive('storePassword')
        //         ->once()
        //         ->andReturn(true);
        // });

        $response = $this->postJson('/api/auth/store-password', [
            'password' => $password,
            'password_confirmation' => $password,
            'user' => $user->id,
            'token' => $token,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Password Created successful',
            ]);
    }

    /** @test */
    public function it_returns_error_if_password_not_saved()
    {
        $user = User::factory()->create();
        $password = 'password123';
        $token = 'valid-token';

        // Mock the StaffService to return false
        // $this->mock(StaffService::class, function ($mock) use ($password, $user, $token) {
        //     $mock->shouldReceive('storePassword')
        //         ->once()
        //         ->andReturn(false);
        // });

        $response = $this->postJson('/api/auth/store-password', [
            'password' => $password,
            'password_confirmation' => $password,
            'user' => $user->id,
            'token' => $token,
        ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Something went wrong',
            ]);
    }

    public function test_forgot_password_email_sent_successfully()
    {
        // Disable actual email sending during the test
        Mail::fake();

        // Arrange: Create a test user
        $user = User::factory()->create([
            'email' => 'test@example.com',
        ]);

        // Act: Make a POST request to the forgot password endpoint
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'test@example.com',
        ]);

        // Assert: Check the response
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Password Reset Email Sent Successfully',
            ]);

        // Assert: Verify that an email was sent to the correct user
        Mail::assertSent(ForgotPasswordMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_forgot_password_with_invalid_email()
    {
        // Act: Make a POST request to the forgot password endpoint with an invalid email
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'invalid-email',
        ]);

        // Assert: Check the response
        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'All fields are required ',
            ]);
    }

    public function test_forgot_password_with_nonexistent_email()
    {
        // Act: Make a POST request to the forgot password endpoint with a nonexistent email
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        // Assert: Check the response
        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Something went wrong',
            ]);
    }

    public function test_that_staff_details_can_be_updated_with_token()
    {
        $staff = User::factory()->create(["remember_token" => "abc-1234567"]);

        $response = $this->putJson("/api/staff/update-staff-details/{$staff->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
            'role_id' => 'new-role',
            'zone' => 'new-zone',
            'remember_token' => 'abc-1234567',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Update Successfully',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $staff->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'phone' => '12345678901',
            'role_id' => 'new-role',
            'zone' => 'new-zone',
        ]);
    }


    /** @test */
    public function it_returns_user_with_token_successfully()
    {
        // Arrange
        $staff = User::factory()->create(['remember_token' => 'valid_token']);

        // Act
        $response = $this->postJson('/api/user-with-token/' . $staff->id, [
            'token' => 'valid_token',
        ]);

        // Assert
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);
    }

    /** @test */
    public function it_returns_no_staff_found_error()
    {
        // Arrange
        $staff = User::factory()->create(['remember_token' => 'valid_token']);
        // Act
        $response = $this->postJson('/api/user-with-token/' . 33, [
            'token' => 'valid_token',
        ]);

        // Assert
        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
                'message' => 'No Staff Found',
            ]);
    }

    /** @test */
}
