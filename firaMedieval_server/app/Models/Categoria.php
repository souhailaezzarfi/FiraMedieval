<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categoria';

    protected $fillable = [
        'nom',
    ];

    public function activitats()
    {
        return $this->belongsToMany(Activitat::class, 'categoria_activitat', 'categoria_id', 'activitat_id');
    }
}