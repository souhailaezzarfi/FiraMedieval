<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activitat extends Model
{
    use HasFactory;

    protected $table = 'activitats';

    protected $fillable = [
        'nom',
        'organitzador',
        'descripcio',
        'aforament',
        'ubicacio',
        'imatge',
    ];

    public function horaris()
    {
        return $this->hasMany(HorariActivitat::class, 'activitat_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Categoria::class, 'activitat_categoria', 'activitat_id', 'categoria_id');
    }


    public function usuarisInscrits()
    {
        return $this->belongsToMany(User::class, 'inscripcions', 'activitat_id', 'user_id')
            ->withPivot('estat')
            ->withTimestamps();
    }
}