<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aparcament extends Model
{
    use HasFactory;

    protected $table = 'aparcaments';

    protected $fillable = [
        'nom',
        'aforament',
        'data_inici',
        'data_final',
    ];

    public function reserves()
    {
        return $this->hasMany(ReservaAutocaravana::class, 'aparcament_id');
    }
}