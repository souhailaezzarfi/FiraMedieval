<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activitat extends Model
{
    use HasFactory;

    protected $table = 'activitat';

    protected $fillable = [
        'nom',
        'organitzador',
        'descripcio',
        'categoria_id',
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
        return $this->belongsToMany(Categoria::class, 'categoria_activitat', 'activitat_id', 'categoria_id');
    }

    public function inscripcionsUsuaris()
    {
        return $this->belongsToMany(User::class, 'inscripcion', 'activitat_id', 'user_id')
            ->withPivot('estat')
            ->withTimestamps();
    }
}