<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HorariActivitat extends Model
{
    use HasFactory;

    protected $table = 'horaris_activitat';

    protected $fillable = [
        'activitat_id',
        'hora_inici',
        'hora_final',
    ];

    public function activitat()
    {
        return $this->belongsTo(Activitat::class, 'activitat_id');
    }
}