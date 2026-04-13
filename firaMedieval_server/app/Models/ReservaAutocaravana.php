<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservaAutocaravana extends Model
{
    use HasFactory;

    protected $table = 'reserva_autocaravana';

    protected $fillable = [
        'user_id',
        'aparcament_id',
        'marca_vehicle',
        'model_vehicle',
        'matricula',
        'procedencia',
        'total_persones',
        'data_arribada',
        'data_sortida',
        'estat',
    ];

    public function usuari()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function aparcament()
    {
        return $this->belongsTo(Aparcament::class, 'aparcament_id');
    }
}