<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'cognoms',
        'email',
        'telefon',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function inscripcionsActivitats()
    {
        return $this->belongsToMany(Activitat::class, 'inscripcions', 'user_id', 'activitat_id')
            ->withPivot('estat')
            ->withTimestamps();
    }

    public function reservaAutocaravana()
    {
        return $this->hasOne(ReservaAutocaravana::class);
    }
}