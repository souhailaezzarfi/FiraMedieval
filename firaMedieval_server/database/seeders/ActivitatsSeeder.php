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
        // 1. Creació de les categories principals
        $categories = [
            'Institucional' => Categoria::firstOrCreate(['nom' => 'Institucional']),
            'Espectacle' => Categoria::firstOrCreate(['nom' => 'Espectacle']),
            'Gastronomia' => Categoria::firstOrCreate(['nom' => 'Gastronomia']),
            'Infantil' => Categoria::firstOrCreate(['nom' => 'Infantil']),
            'Cultura' => Categoria::firstOrCreate(['nom' => 'Cultura']),
            'Taller' => Categoria::firstOrCreate(['nom' => 'Taller']),
            'Mercat' => Categoria::firstOrCreate(['nom' => 'Mercat']),
            'Animació' => Categoria::firstOrCreate(['nom' => 'Animació']),
            'Musical' => Categoria::firstOrCreate(['nom' => 'Musical']),
        ];

        // 2. Definició estricta de les activitats i els seus horaris
        // NOTA: Totes les dates de finalització no indicades al PDF es passen com a 'null'
        $activitats = [
            // --- ACTIVITATS CONTÍNUES (DESTACATS) ---
            [
                'nom' => 'Taller i exhibició de punta',
                'organitzador' => "Escola de Puntaires d'Hostalric",
                'descripcio' => "Taller i exhibició de punta a càrrec de l'escola de Puntaires d'Hostalric.",
                'ubicacio' => "Davant l'Ajuntament",
                'categories' => ['Cultura', 'Taller'],
                'horaris' => [
                    ['2026-04-03 09:00:00', '2026-04-03 13:00:00'],
                    ['2026-04-04 09:00:00', '2026-04-04 13:00:00'],
                    ['2026-04-05 09:00:00', '2026-04-05 13:00:00'],
                ]
            ],
            [
                'nom' => 'Gran Mercat Medieval',
                'organitzador' => "Ajuntament d'Hostalric",
                'descripcio' => "Gran mercat medieval amb parades d'artesania i alimentació.",
                'ubicacio' => "Via Romana, pl. de la Vila, c. Major, pl. dels Bous i c. Raval",
                'categories' => ['Mercat'],
                'horaris' => [
                    ['2026-04-03 10:30:00', '2026-04-03 21:00:00'],
                    ['2026-04-04 10:30:00', '2026-04-04 21:00:00'],
                    ['2026-04-05 10:30:00', '2026-04-05 21:00:00'],
                ]
            ],
            [
                'nom' => 'Tallers de pintura de miralls i espases',
                'organitzador' => "Love Animals",
                'descripcio' => "Tallers infantils de pintura de miralls i espases.",
                'ubicacio' => "Davant l'Ajuntament",
                'categories' => ['Infantil', 'Taller'],
                'horaris' => [
                    ['2026-04-03 10:30:00', '2026-04-03 21:00:00'],
                    ['2026-04-04 10:30:00', '2026-04-04 21:00:00'],
                    ['2026-04-05 10:30:00', '2026-04-05 21:00:00'],
                ]
            ],
            [
                'nom' => 'Taverna Medieval i Tallers Infantils',
                'organitzador' => "Club Patí Hostalric",
                'descripcio' => "Espai de taverna medieval i zona de tallers per a la mainada.",
                'ubicacio' => "Castell (Portal de Carros)",
                'categories' => ['Gastronomia', 'Infantil'],
                'horaris' => [
                    ['2026-04-03 10:30:00', '2026-04-03 19:30:00'],
                    ['2026-04-04 10:30:00', '2026-04-04 19:30:00'],
                    ['2026-04-05 10:30:00', '2026-04-05 19:30:00'],
                ]
            ],
            [
                'nom' => 'Pintacares i altres activitats',
                'organitzador' => "AFA de l'INS Vescomtat de Cabrera",
                'descripcio' => "Activitats infantils i pintacares a càrrec de l'AFA.",
                'ubicacio' => "Ajuntament i Via Romana",
                'categories' => ['Infantil'],
                'horaris' => [
                    ['2026-04-03 10:30:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 10:30:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 10:30:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => "Demostració d'oficis d'època medieval",
                'organitzador' => "Artesans Medievals",
                'descripcio' => "Demostració en directe dels oficis tradicionals de l'edat mitjana.",
                'ubicacio' => "Castell (fossat)",
                'categories' => ['Cultura', 'Mercat'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:30:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:30:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:30:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => 'Jocs de fusta XXL',
                'organitzador' => "Ludi Espai",
                'descripcio' => "Zona de jocs tradicionals de fusta gegants per a tota la família.",
                'ubicacio' => "Castell (fossat)",
                'categories' => ['Infantil', 'Animació'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:30:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:30:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:30:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => "Escola de cavalleria i taller d'escuts",
                'organitzador' => "AFA Mare de Déu dels Socors",
                'descripcio' => "Aprèn a ser un cavaller i dissenya el teu propi escut.",
                'ubicacio' => "Castell (fossat)",
                'categories' => ['Infantil', 'Taller'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:30:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:30:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:30:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => 'Campament de recreació històrica',
                'organitzador' => "Arx Corpus Dei Cordis",
                'descripcio' => "Campament militar medieval amb autèntica recreació històrica.",
                'ubicacio' => "Castell (fossat)",
                'categories' => ['Cultura', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:00:00', '2026-04-03 19:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:00:00', '2026-04-04 19:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:00:00', '2026-04-05 19:00:00'],
                ]
            ],
            [
                'nom' => 'Softcombat',
                'organitzador' => "Softcombat BCN",
                'descripcio' => "Lluita lúdica amb armes embuatades. Participació oberta.",
                'ubicacio' => "Castell (pont)",
                'categories' => ['Animació', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:00:00', '2026-04-03 19:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:00:00', '2026-04-04 19:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:00:00', '2026-04-05 19:00:00'],
                ]
            ],
            [
                'nom' => "Campament d'arquers i exhibicions",
                'organitzador' => "ARC Sant Celoni",
                'descripcio' => "Campament d'arquers amb exhibicions de tir amb arc.",
                'ubicacio' => "Fossat del camí de vila",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 19:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 19:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 19:00:00'],
                ]
            ],
            [
                'nom' => "Doble exposició: Elements de tortura i història de la bruixeria",
                'organitzador' => "Ajuntament d'Hostalric",
                'descripcio' => "Exposició històrica.",
                'ubicacio' => "Torre dels Bous Apartaments",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 16:00:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 16:00:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 16:00:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => 'Taller de malabars',
                'organitzador' => "Batec de Circ",
                'descripcio' => "Taller interactiu per aprendre les arts malabars.",
                'ubicacio' => "Ajuntament",
                'categories' => ['Taller', 'Infantil'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 13:30:00'],
                    ['2026-04-03 17:00:00', '2026-04-03 19:30:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 13:30:00'],
                    ['2026-04-04 17:00:00', '2026-04-04 19:30:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 13:30:00'],
                    ['2026-04-05 17:00:00', '2026-04-05 19:30:00'],
                ]
            ],
            [
                'nom' => "Centre d'Interpretació d'Íbers i Romans",
                'organitzador' => "Ajuntament d'Hostalric",
                'descripcio' => "Coneix els primers pobladors d'Hostalric.",
                'ubicacio' => "Ajuntament",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 13:30:00'],
                    ['2026-04-03 17:00:00', '2026-04-03 19:30:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 13:30:00'],
                    ['2026-04-04 17:00:00', '2026-04-04 19:30:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 13:30:00'],
                    ['2026-04-05 17:00:00', '2026-04-05 19:30:00'],
                ]
            ],
            [
                'nom' => "Plantada dels Gegants d'Hostalric",
                'organitzador' => "Colla Gegantera d'Hostalric",
                'descripcio' => "Mostra estàtica dels gegants d'època medieval de la vila.",
                'ubicacio' => "Ajuntament",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 13:30:00'],
                    ['2026-04-03 17:00:00', '2026-04-03 19:30:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 13:30:00'],
                    ['2026-04-04 17:00:00', '2026-04-04 19:30:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 13:30:00'],
                    ['2026-04-05 17:00:00', '2026-04-05 19:30:00'],
                ]
            ],
            [
                'nom' => "La Cova Mística: Adivinació per cartomància",
                'organitzador' => "Bruixes d'Hostalric",
                'descripcio' => "Lectura de cartes en un entorn màgic. Grups reduïts.",
                'ubicacio' => "Cova del Relliguer",
                'categories' => ['Espectacle', 'Animació'],
                'aforament' => 15,
                'horaris' => [
                    ['2026-04-03 10:00:00', null],
                    ['2026-04-04 10:00:00', null],
                    ['2026-04-05 10:00:00', null],
                ]
            ],
            [
                'nom' => "Visites Guiades al Castell",
                'organitzador' => "Turisme Hostalric",
                'descripcio' => "Visita guiada històrica a la fortalesa. Venda de tiquets anticipats a la web de Turisme.",
                'ubicacio' => "Punt d'Informació del Castell",
                'categories' => ['Cultura'],
                'aforament' => 30,
                'horaris' => [
                    ['2026-04-03 11:00:00', null],
                    ['2026-04-03 13:00:00', null],
                    ['2026-04-03 16:00:00', null],
                    ['2026-04-03 18:00:00', null],
                    ['2026-04-04 11:00:00', null],
                    ['2026-04-04 13:00:00', null],
                    ['2026-04-04 16:00:00', null],
                    ['2026-04-04 18:00:00', null],
                    ['2026-04-05 11:00:00', null],
                    ['2026-04-05 13:00:00', null],
                    ['2026-04-05 16:00:00', null],
                    ['2026-04-05 18:00:00', null],
                ]
            ],
            [
                'nom' => "Entrada Lliure al Castell",
                'organitzador' => "Turisme Hostalric",
                'descripcio' => "Venda de tiquets anticipats per a visita per lliure.",
                'ubicacio' => "Punt d'Informació del Castell",
                'categories' => ['Cultura'],
                'aforament' => 500,
                'horaris' => [
                    ['2026-04-03 10:00:00', '2026-04-03 19:00:00'],
                    ['2026-04-04 10:00:00', '2026-04-04 19:00:00'],
                    ['2026-04-05 10:00:00', '2026-04-05 19:00:00'],
                ]
            ],
            [
                'nom' => "Visita a la Torre dels Frares",
                'organitzador' => "Turisme Hostalric",
                'descripcio' => "Visita lliure. Preu: 2€ (gratuït fins a 12 anys).",
                'ubicacio' => "Torre dels Frares",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 15:00:00', '2026-04-03 19:30:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 15:00:00', '2026-04-04 19:30:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 15:00:00', '2026-04-05 19:30:00'],
                ]
            ],
            [
                'nom' => "Trenet d'enllaç",
                'organitzador' => "Ajuntament d'Hostalric",
                'descripcio' => "Trajecte des de l'aparcament de la zona esportiva fins a l'escola i viceversa. Preu: 2€.",
                'ubicacio' => "Zona esportiva i davant de l'escola",
                'categories' => ['Institucional'],
                'horaris' => [
                    ['2026-04-03 11:00:00', '2026-04-03 14:00:00'],
                    ['2026-04-03 15:45:00', '2026-04-03 20:00:00'],
                    ['2026-04-04 11:00:00', '2026-04-04 14:00:00'],
                    ['2026-04-04 15:45:00', '2026-04-04 20:00:00'],
                    ['2026-04-05 11:00:00', '2026-04-05 14:00:00'],
                    ['2026-04-05 15:45:00', '2026-04-05 20:00:00'],
                ]
            ],
            [
                'nom' => "Portes obertes: Pintures murals de Joan Carles Osuna",
                'organitzador' => "Parròquia d'Hostalric",
                'descripcio' => "Visita a les pintures murals d'estil bizantí.",
                'ubicacio' => "Església de Sta. Maria",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 11:30:00', '2026-04-03 18:30:00'],
                    ['2026-04-04 11:30:00', '2026-04-04 18:30:00'],
                    ['2026-04-05 11:30:00', '2026-04-05 18:30:00'],
                ]
            ],

            // --- ACTES CRONOLÒGICS / PUNTUALS SENSE HORA DE FINALITZACIÓ ---
            [
                'nom' => "Torneig Medieval de Bitlles Catalanes",
                'organitzador' => "CB Emmurallats",
                'descripcio' => "IV Torneig Medieval de bitlles catalanes.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Espectacle', 'Cultura'],
                'horaris' => [
                    ['2026-04-03 10:00:00', null],
                ]
            ],
            [
                'nom' => "Gran Desfilada Inaugural",
                'organitzador' => "Vescomtat de Cabrera",
                'descripcio' => "Gran desfilada inaugural dels Vescomtes de Cabrera i dels grups de recreació.",
                'ubicacio' => "Des de la plaça de l'escola",
                'categories' => ['Institucional', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 11:30:00', null],
                ]
            ],
            [
                'nom' => "Cerimònia de benvinguda als Vescomtes",
                'organitzador' => "Ajuntament d'Hostalric",
                'descripcio' => "Pregó, dansa i duel en honor als Vescomtes de Cabrera.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Institucional', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 12:00:00', null],
                ]
            ],
            [
                'nom' => "Cercavila Musical",
                'organitzador' => "Graiatus",
                'descripcio' => "Cercavila musical itinerant pels carrers del mercat.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Musical', 'Animació'],
                'horaris' => [
                    ['2026-04-03 13:00:00', null],
                    ['2026-04-03 18:30:00', null],
                    ['2026-04-03 20:00:00', null],
                    ['2026-04-04 11:30:00', null],
                    ['2026-04-04 13:00:00', null],
                    ['2026-04-04 20:00:00', null],
                    ['2026-04-05 12:45:00', null],
                    ['2026-04-05 17:30:00', null],
                    ['2026-04-05 19:30:00', null],
                ]
            ],
            [
                'nom' => "Bufonades",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Animació itinerant d'humor i circ medieval.",
                'ubicacio' => "Zona mercat (Via Romana)",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-03 13:30:00', null],
                ]
            ],
            [
                'nom' => "Cercavila de Bruixes",
                'organitzador' => "Cia. Serket Raqs",
                'descripcio' => "Espectacle itinerant de dansa i bruixeria.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 16:00:00', null],
                    ['2026-04-03 19:00:00', null],
                    ['2026-04-04 11:45:00', null],
                    ['2026-04-04 16:00:00', null],
                    ['2026-04-04 20:00:00', null],
                    ['2026-04-05 11:00:00', null],
                    ['2026-04-05 16:00:00', null],
                    ['2026-04-05 18:00:00', null],
                ]
            ],
            [
                'nom' => "Krakort el Follet del Montseny",
                'organitzador' => "Cia. Don Hueso",
                'descripcio' => "Animació itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació', 'Infantil'],
                'horaris' => [
                    ['2026-04-03 16:30:00', null],
                    ['2026-04-03 19:45:00', null],
                    ['2026-04-04 20:00:00', null],
                    ['2026-04-05 12:30:00', null],
                ]
            ],
            [
                'nom' => "El Gegant de Vímet i la seva cort",
                'organitzador' => "Cremallera Teatre",
                'descripcio' => "Espectacle itinerant i visual de gran format.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 17:00:00', null],
                    ['2026-04-04 16:30:00', null],
                    ['2026-04-05 17:30:00', null],
                ]
            ],
            [
                'nom' => "Jocs participatius d'arqueria",
                'organitzador' => "ARC Sant Celoni",
                'descripcio' => "Aprèn a tirar amb l'arc de la mà dels experts del campament.",
                'ubicacio' => "Fossat camí de vila",
                'categories' => ['Infantil', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 17:00:00', null],
                    ['2026-04-04 17:30:00', null],
                ]
            ],
            [
                'nom' => "Ballada dels Gegants d'època medieval",
                'organitzador' => "Colla Gegantera d'Hostalric",
                'descripcio' => "Ballada tradicional de la imatgeria festiva d'Hostalric.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-03 17:00:00', null],
                ]
            ],
            [
                'nom' => "El Misteri de la Rosa Blava",
                'organitzador' => "Lady Alberginia",
                'descripcio' => "Contes teatralitzats per a la mainada.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Infantil'],
                'horaris' => [
                    ['2026-04-03 17:30:00', null],
                ]
            ],
            [
                'nom' => "La catifa voladora",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Animació itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-03 17:30:00', null],
                    ['2026-04-05 17:00:00', null],
                ]
            ],
            [
                'nom' => "Taller participatiu de danses medievals",
                'organitzador' => "Acers Trempats i Graiatus",
                'descripcio' => "Taller per aprendre danses de l'edat mitjana.",
                'ubicacio' => "Cova del Relliguer i Pl. M. Teresa",
                'categories' => ['Taller', 'Musical'],
                'horaris' => [
                    ['2026-04-03 17:30:00', null],
                    ['2026-04-04 18:00:00', null],
                    ['2026-04-05 17:00:00', null],
                ]
            ],
            [
                'nom' => "L'Aldarull dels Orcs",
                'organitzador' => "Dark Fantasy",
                'descripcio' => "Espectacle itinerant fantàstic.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 17:45:00', null],
                    ['2026-04-04 11:45:00', null],
                    ['2026-04-04 17:30:00', null],
                    ['2026-04-05 11:30:00', null],
                    ['2026-04-05 16:30:00', null],
                ]
            ],
            [
                'nom' => "El besamans dels nobles",
                'organitzador' => "Infestum Espectacles",
                'descripcio' => "Recepció d'honor amb els Vescomtes de Cabrera.",
                'ubicacio' => "Portal de Barcelona",
                'categories' => ['Espectacle', 'Cultura'],
                'horaris' => [
                    ['2026-04-03 18:00:00', null],
                ]
            ],
            [
                'nom' => "Justícia Nòmada",
                'organitzador' => "Acers Trempats",
                'descripcio' => "Espectacle teatralitzat.",
                'ubicacio' => "Cova del Relliguer",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-03 18:30:00', null],
                    ['2026-04-04 11:00:00', null],
                    ['2026-04-04 17:00:00', null],
                    ['2026-04-05 11:00:00', null],
                    ['2026-04-05 18:30:00', null],
                ]
            ],
            [
                'nom' => "Els Druides del Bosc",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Animació itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-03 18:30:00', null],
                    ['2026-04-04 18:00:00', null],
                    ['2026-04-05 18:00:00', null],
                ]
            ],
            [
                'nom' => "El ball de l'ós dels Pirineus",
                'organitzador' => "Cremallera Teatre",
                'descripcio' => "Animació itinerant espectacular.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-03 19:00:00', null],
                    ['2026-04-04 19:00:00', null],
                    ['2026-04-05 19:00:00', null],
                ]
            ],
            [
                'nom' => "Preparant la guàrdia del castell",
                'organitzador' => "Infestum Espectacles",
                'descripcio' => "Recreació teatralitzada dels guàrdies de la fortalesa.",
                'ubicacio' => "Portal de Barcelona",
                'categories' => ['Espectacle', 'Cultura'],
                'horaris' => [
                    ['2026-04-03 19:30:00', null],
                    ['2026-04-04 17:30:00', null],
                ]
            ],
            [
                'nom' => "La Mort: Comparsa itinerant",
                'organitzador' => "Toniton Circ i altres",
                'descripcio' => "Gran comparsa espectacle itinerant de tancament.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació', 'Espectacle'],
                'horaris' => [
                    ['2026-04-03 20:30:00', null],
                    ['2026-04-04 20:30:00', null],
                    ['2026-04-05 20:00:00', null],
                ]
            ],
            [
                'nom' => "Espectacle de dansa de bruixes amb foc",
                'organitzador' => "Cia. Serket Raqs",
                'descripcio' => "Espectacle nocturn de foc.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-03 21:00:00', null],
                ]
            ],
            [
                'nom' => "Demostració de sega amb dalla",
                'organitzador' => "Dalladors d'Hostalric",
                'descripcio' => "Recuperació de l'ofici de dallador.",
                'ubicacio' => "Falda del castell",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-04 10:00:00', '2026-04-04 13:00:00'],
                ]
            ],
            [
                'nom' => "Benvinguda a la vila emmurallada",
                'organitzador' => "Infestum Espectacles",
                'descripcio' => "Acte protocol·lari amb els Vescomtes.",
                'ubicacio' => "Portal de Barcelona",
                'categories' => ['Espectacle', 'Institucional'],
                'horaris' => [
                    ['2026-04-04 11:00:00', null],
                    ['2026-04-05 11:30:00', null],
                    ['2026-04-05 13:00:00', null],
                ]
            ],
            [
                'nom' => "David l'Ogre",
                'organitzador' => "Cremallera Teatre",
                'descripcio' => "Espectacle itinerant amb el gran ogre.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-04 11:30:00', null],
                    ['2026-04-05 11:00:00', null],
                ]
            ],
            [
                'nom' => "El príncep de les aromes i els bufons",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Animació itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-04 11:30:00', null],
                ]
            ],
            [
                'nom' => "Exhibició de tir amb arc",
                'organitzador' => "ARC Sant Celoni",
                'descripcio' => "Exhibició oficial d'arquers professionals.",
                'ubicacio' => "Fossat del castell",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-04 12:00:00', null],
                    ['2026-04-05 12:00:00', null],
                    ['2026-04-05 17:00:00', null],
                ]
            ],
            [
                'nom' => "Contes d'aquí, rondalles d'allà",
                'organitzador' => "Lady Alberginia",
                'descripcio' => "Contes teatralitzats per als infants.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Infantil'],
                'horaris' => [
                    ['2026-04-04 12:00:00', null],
                ]
            ],
            [
                'nom' => "Venditio Armorum",
                'organitzador' => "Acers Trempats",
                'descripcio' => "Espectacle d'esgrima escènica.",
                'ubicacio' => "Cova del Relliguer",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-04 12:30:00', null],
                    ['2026-04-05 12:45:00', null],
                ]
            ],
            [
                'nom' => "L'home arbre",
                'organitzador' => "Cia. Don Hueso",
                'descripcio' => "Espectacle itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-04 12:30:00', null],
                    ['2026-04-04 17:00:00', null],
                ]
            ],
            [
                'nom' => "A buscar viandes",
                'organitzador' => "Infestum Espectacles",
                'descripcio' => "Espectacle còmic de carrer.",
                'ubicacio' => "Portal de Barcelona",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-04 13:00:00', null],
                    ['2026-04-05 17:30:00', null],
                ]
            ],
            [
                'nom' => "Els Fakirs",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Espectacle de malabars i humor extrem.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-04 13:00:00', null],
                    ['2026-04-05 13:15:00', null],
                ]
            ],
            [
                'nom' => "Climor l'alquimista",
                'organitzador' => "Cremallera Teatre",
                'descripcio' => "Espectacle itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-04 13:30:00', null],
                    ['2026-04-05 13:30:00', null],
                ]
            ],
            [
                'nom' => "Presentació: Gran Llibre de la Dalla",
                'organitzador' => "Esteve Costa",
                'descripcio' => "Presentació del llibre de Peter Vido.",
                'ubicacio' => "Centre Cultural Serafí Pitarra",
                'categories' => ['Cultura'],
                'horaris' => [
                    ['2026-04-04 17:00:00', null],
                ]
            ],
            [
                'nom' => "Vespreig Medieval a la Taverna",
                'organitzador' => "Taverna de les Majorets",
                'descripcio' => "Degustació d'hidromel amb els Vescomtes.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Gastronomia', 'Cultura'],
                'horaris' => [
                    ['2026-04-04 18:00:00', '2026-04-04 20:00:00'],
                ]
            ],
            [
                'nom' => "Concert de Folk-Rock Català",
                'organitzador' => "Troba d'Ors",
                'descripcio' => "Concert de música folk i rock.",
                'ubicacio' => "Pl. M. Teresa de Gelcen",
                'categories' => ['Musical'],
                'horaris' => [
                    ['2026-04-04 18:30:00', null],
                ]
            ],
            [
                'nom' => "Espectacular i visual espectacle de foc",
                'organitzador' => "Pyronix Production",
                'descripcio' => "Espectacle central amb pirotècnia.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Espectacle'],
                'horaris' => [
                    ['2026-04-04 21:00:00', null],
                ]
            ],
            [
                'nom' => "Demostració de cuina a l'estil medieval",
                'organitzador' => "Cuiners Medievals d'Hostalric",
                'descripcio' => "Cocció del porc, xai, vedella i brou.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Gastronomia'],
                'horaris' => [
                    ['2026-04-05 06:00:00', '2026-04-05 13:00:00'],
                ]
            ],
            [
                'nom' => "El perfumer i els bufons del castell",
                'organitzador' => "Toniton Circ",
                'descripcio' => "Animació itinerant.",
                'ubicacio' => "Zona mercat",
                'categories' => ['Animació'],
                'horaris' => [
                    ['2026-04-05 11:30:00', null],
                ]
            ],
            [
                'nom' => "Espectacle Musical (Cova Relliguer)",
                'organitzador' => "Graiatus",
                'descripcio' => "Concert acústic dins la Cova.",
                'ubicacio' => "Cova del Relliguer",
                'categories' => ['Musical'],
                'horaris' => [
                    ['2026-04-05 11:45:00', null],
                ]
            ],
            [
                'nom' => "Torneig de Cavalleria",
                'organitzador' => "Drakonia",
                'descripcio' => "Espectacle de justes a cavall.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Espectacle'],
                'aforament' => 1000,
                'horaris' => [
                    ['2026-04-05 12:00:00', null],
                    ['2026-04-05 17:30:00', null],
                ]
            ],
            [
                'nom' => "Degustació de cuina a l'estil medieval",
                'organitzador' => "Cuiners Medievals i Atlètic Club",
                'descripcio' => "Gran àpat medieval amb tiquets.",
                'ubicacio' => "Plaça de l'escola",
                'categories' => ['Gastronomia'],
                'aforament' => 500,
                'horaris' => [
                    ['2026-04-05 14:00:00', null],
                ]
            ],
            [
                'nom' => "Comiat als nobles",
                'organitzador' => "Infestum Espectacles",
                'descripcio' => "Cerimònia de clausura.",
                'ubicacio' => "Portal de Barcelona",
                'categories' => ['Espectacle', 'Institucional'],
                'horaris' => [
                    ['2026-04-05 19:30:00', null],
                ]
            ],
            [
                'nom' => "Taverna nocturna medieval amb Brian Mich DJ",
                'organitzador' => "Assoc. de Comerciants d'Hostalric",
                'descripcio' => "Festa final per tancar la Fira.",
                'ubicacio' => "Fossat del castell",
                'categories' => ['Musical', 'Gastronomia'],
                'horaris' => [
                    ['2026-04-05 23:00:00', null],
                ]
            ],
        ];

        // 3. Procés d'inserció 
        foreach ($activitats as $dades) {

            // Busca l'activitat pel nom; si hi és, l'actualitza, si no, la crea
            $act = Activitat::updateOrCreate(
                ['nom' => $dades['nom']],
                [
                    'organitzador' => $dades['organitzador'] ?? 'Organització Fira Medieval',
                    'descripcio' => $dades['descripcio'] ?? '',
                    'ubicacio' => $dades['ubicacio'] ?? "Vila d'Hostalric",
                    'aforament' => $dades['aforament'] ?? null,
                ]
            );

            // Vincula les categories
            $catsIds = [];
            foreach ($dades['categories'] as $catNom) {
                if (isset($categories[$catNom])) {
                    $catsIds[] = $categories[$catNom]->id;
                }
            }
            $act->categories()->sync($catsIds);

            // Neteja els horaris vells i crea els nous
            $act->horaris()->delete();

            foreach ($dades['horaris'] as $horari) {
                $act->horaris()->create([
                    'hora_inici' => $horari[0],
                    'hora_final' => $horari[1], // Ara respectem els null autèntics
                ]);
            }
        }
    }
}