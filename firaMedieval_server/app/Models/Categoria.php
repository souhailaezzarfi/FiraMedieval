<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'nom',
    ];

    public function activitats()
    {
        return $this->belongsToMany(Activitat::class, 'activitat_categoria', 'categoria_id', 'activitat_id');
    }
}