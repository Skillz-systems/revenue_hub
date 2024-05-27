<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\Request;
use OpenApi\Annotations as OA;


/**
 * Class User.
 *
 *
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     title="Staff Model",
 *     description="Staff model",
 * )
 */

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    public const ROLE_ADMIN = 1;
    public const ROLE_ENFORCERS = 2;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'zone',
        'role_id',
        'remember_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function role()
    {
        return $this->hasOne(Role::class, "id", "role_id");
    }

    public function sendPasswordResetNotification($token)
    {
        $url = Request::url() . '/reset-password?token=' . $token;

        $this->notify(new ResetPasswordNotification($url));
    }
}
