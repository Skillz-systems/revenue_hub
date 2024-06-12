<?php

namespace App\Models;

use OpenApi\Annotations as OA;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;


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
    public const ROLE_MD = 1;
    public const ROLE_ADMIN = 2;
    public const ROLE_ENFORCERS = 3;
    public const ROLE_OTHERS = 4;

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

    public function checkIsAdminOrMd()
    {
        return $this->role_id == 1;
    }
}
