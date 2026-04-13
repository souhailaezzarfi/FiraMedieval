<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

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
        return $this->belongsToMany(Activitat::class, 'inscripcion', 'user_id', 'activitat_id')
            ->withPivot('estat')
            ->withTimestamps();
    }

    public function reservaAutocaravana()
    {
        return $this->hasOne(ReservaAutocaravana::class);
    }
}