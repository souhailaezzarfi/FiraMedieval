<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activitat;
use App\Models\Categoria;

class ActivitatsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $catInstitucional = Categoria::firstOrCreate(['nom' => 'Institucional']);
        $catEspectacle = Categoria::firstOrCreate(['nom' => 'Espectacle']);
        $catGastronomia = Categoria::firstOrCreate(['nom' => 'Gastronomia']);
        $catInfantil = Categoria::firstOrCreate(['nom' => 'Infantil']);

        $act1 = Activitat::create([
            'nom' => 'Inauguració del Mercat Medieval',
            'organitzador' => 'Ajuntament d\'Hostalric',
            'descripcio' => 'Obertura oficial del mercat amb pregó i cercavila pels carrers del nucli antic.',
            'ubicacio' => 'Plaça dels Bous',
            'aforament' => null,
            'imatge' => null,
        ]);

        $act1->horaris()->create([
            'hora_inici' => '2026-04-03 10:00:00',
            'hora_final' => '2026-04-03 11:30:00',
        ]);
        $act1->categories()->attach($catInstitucional->id);

        $act2 = Activitat::create([
            'nom' => 'Gran Torneig de Cavallers',
            'organitzador' => 'Vescomtat de Cabrera',
            'descripcio' => 'Lluita d\'espases i justes a cavall per aconseguir el favor del públic.',
            'ubicacio' => 'Camp de justes',
            'aforament' => 500,
            'imatge' => null,
        ]);

        $act2->horaris()->create([
            'hora_inici' => '2026-04-03 17:00:00',
            'hora_final' => '2026-04-03 18:30:00',
        ]);
        $act2->horaris()->create([
            'hora_inici' => '2026-04-04 12:00:00',
            'hora_final' => '2026-04-04 13:30:00',
        ]);
        $act2->categories()->attach($catEspectacle->id);

        $act3 = Activitat::create([
            'nom' => 'Sopar Medieval',
            'organitzador' => 'Hostalers de la Vila',
            'descripcio' => 'Sopar tradicional amb productes de la terra, vi i música en directe.',
            'ubicacio' => 'Castell d\'Hostalric',
            'aforament' => 150,
            'imatge' => null,
        ]);

        $act3->horaris()->create([
            'hora_inici' => '2026-04-05 21:00:00',
            'hora_final' => '2026-04-05 23:59:00',
        ]);
        $act3->categories()->attach($catGastronomia->id);

        $act4 = Activitat::create([
            'nom' => 'Taller de creació d\'escuts',
            'organitzador' => 'Artesans Locals',
            'descripcio' => 'Els més petits podran dissenyar i pintar el seu propi escut heràldic.',
            'ubicacio' => 'Plaça de la Vila',
            'aforament' => 30,
            'imatge' => null,
        ]);

        $act4->horaris()->create([
            'hora_inici' => '2026-04-04 11:00:00',
            'hora_final' => '2026-04-04 13:00:00',
        ]);
        $act4->categories()->attach($catInfantil->id);
    }
}