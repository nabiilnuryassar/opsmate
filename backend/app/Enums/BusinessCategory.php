<?php

namespace App\Enums;

enum BusinessCategory: string
{
    case MakananMinuman = 'makanan_minuman';
    case Laundry = 'laundry';
    case JasaService = 'jasa_service';
    case TokoOnline = 'toko_online';
    case Fashion = 'fashion';
    case KesehatanKecantikan = 'kesehatan_kecantikan';
    case Edukasi = 'edukasi';
    case Otomotif = 'otomotif';
    case Lainnya = 'lainnya';

    public function label(): string
    {
        return match ($this) {
            self::MakananMinuman => 'Makanan & Minuman',
            self::Laundry => 'Laundry',
            self::JasaService => 'Jasa Service',
            self::TokoOnline => 'Toko Online',
            self::Fashion => 'Fashion',
            self::KesehatanKecantikan => 'Kesehatan & Kecantikan',
            self::Edukasi => 'Edukasi',
            self::Otomotif => 'Otomotif',
            self::Lainnya => 'Lainnya',
        };
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $c) => ['value' => $c->value, 'label' => $c->label()],
            self::cases(),
        );
    }
}
