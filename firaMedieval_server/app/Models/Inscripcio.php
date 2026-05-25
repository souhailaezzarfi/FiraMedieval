<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Activitat;
use App\Models\HorariActivitat;

class Inscripcio extends Model
{

    protected $table = 'inscripcions';

    protected $fillable = ['activitat_id', 'horari_id', 'user_id', 'estat'];

    public function activitat()
    {
        return $this->belongsTo(Activitat::class);
    }

    public function horari()
    {
        return $this->belongsTo(HorariActivitat::class, 'horari_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
