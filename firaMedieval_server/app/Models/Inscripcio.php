<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Activitat;



class Inscripcio extends Model
{
    protected $fillable = ['activitat_id', 'user_id', 'estat'];

    public function activitat()
    {
        return $this->belongsTo(Activitat::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
