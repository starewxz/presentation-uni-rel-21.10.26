import type { ImageConfig } from '../types/presentation'

/**
 * Усі зображення — файли Wikimedia Commons (вільні ліцензії / суспільне надбання).
 * Ширини обрано зі стандартного набору мініатюр Commons (960 / 1280 / 1920),
 * щоб запити не відхилялися сервером.
 */
const commons = (file: string, width: 960 | 1280 | 1920): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file.replace(/ /g, '_'))}?width=${width}`

const SOURCE = 'Wikimedia Commons'

const make = (
  file: string,
  width: 960 | 1280 | 1920,
  alt: string,
  extra: Partial<Pick<ImageConfig, 'caption' | 'position'>> = {},
): ImageConfig => ({
  src: commons(file, width),
  thumb: commons(file, 960),
  alt,
  file,
  source: SOURCE,
  ...extra,
})

export const images = {
  varanasiSunrise: make(
    'Boats at sunrise Ganges River Varanasi Uttar Pradesh Schwiki.jpg',
    1920,
    'Човни на Гангу на сході сонця у Варанасі',
    { caption: 'Ганг на світанку, Варанасі', position: '50% 55%' },
  ),
  rigveda: make(
    '1500-1200 BCE, Rigveda manuscript page sample iii, Sanskrit, Devanagari.jpg',
    1280,
    'Сторінка рукопису Рігведи санскритом, письмо деванагарі',
    { caption: 'Сторінка рукопису Рігведи (деванагарі)' },
  ),
  trimurti: make(
    'Brahma, Vishnu and Shiva seated on lotuses with their consorts, ca1770.jpg',
    1920,
    'Мініатюра близько 1770 року: Брахма, Вішну і Шива на лотосах разом із супругами',
    { caption: 'Брахма, Вішну і Шива з супругами, мініатюра бл. 1770 р.', position: '50% 50%' },
  ),
  ganesha: make(
    'Ganesha Basohli miniature circa 1730 Dubost p73.jpg',
    960,
    'Ганеша на мініатюрі школи Басохлі, близько 1730 року',
    { caption: 'Ганеша, мініатюра Басохлі', position: '50% 35%' },
  ),
  lakshmi: make(
    'Raja Ravi Varma, Goddess Lakshmi, 1896.jpg',
    960,
    'Богиня Лакшмі на картині Раджі Раві Вармі, 1896',
    { caption: 'Лакшмі, Раджа Раві Варма, 1896', position: '50% 25%' },
  ),
  durga: make(
    'Maker unknown, India - The Great Goddess Durga Slaying the Buffalo Demon (Mahishasuramardini) - Google Art Project.jpg',
    960,
    'Богиня Дурга перемагає демона-буйвола Махішасуру, індійська мініатюра',
    { caption: 'Дурга і Махішасура, індійська мініатюра', position: '50% 40%' },
  ),
  aarti: make(
    'Evening Ganga Aarti Assi Ghat, Varanasi 1.jpg',
    1920,
    'Вечірня церемонія Ганга-арті на гхаті Ассі у Варанасі',
    { caption: 'Вечірня Ганга-арті, гхат Ассі, Варанасі', position: '60% 50%' },
  ),
  ghats: make(
    'Ghat Varanasi.jpg',
    1920,
    'Кам’яні сходи гхатів над Гангом у Варанасі',
    { caption: 'Гхати Варанасі', position: '50% 50%' },
  ),
  rishikesh: make(
    'Rishikesh (Ganges View).jpg',
    1920,
    'Вид на Ганг у Рішікеші ввечері, зі статуєю Шиви на березі',
    { caption: 'Ганг у Рішікеші ввечері', position: '45% 50%' },
  ),
  cow: make(
    'Vechur Cow.jpg',
    1920,
    'Корова з телям в індійському селі',
    { caption: 'Корова з телям, Індія', position: '45% 55%' },
  ),
  kamadhenu: make(
    'Kamadhenu parijata.jpg',
    960,
    'Камадхену — корова достатку — поряд із мудрецем, індійська мініатюра',
    { caption: 'Камадхену, корова достатку', position: '50% 50%' },
  ),
  ambedkar: make(
    'Dr. Bhimrao Ambedkar.jpg',
    960,
    'Портрет Б. Р. Амбедкара',
    { caption: 'Б. Р. Амбедкар (1891–1956)', position: '50% 25%' },
  ),
  gita: make(
    'BhagavadGita-19th-century-Illustrated-Sanskrit-Chapter 1.20.21.jpg',
    1280,
    'Ілюстрований рукопис Бхагавадгіти XIX століття: Крішна й Арджуна на колісниці',
    { caption: 'Бхагавадгіта, ілюстрований рукопис XIX ст.', position: '50% 50%' },
  ),
  sunset: make(
    'Sunset on river Ganges 02.jpg',
    1920,
    'Захід сонця над Гангом: сонце над обрієм і відблиск на воді',
    { caption: 'Захід сонця над Гангом', position: '50% 60%' },
  ),
  temple: make(
    'Gopuram of the Meenakshi Temple at Madurai.jpg',
    1280,
    'Гопурам храму Міенакші в Мадурай',
    { caption: 'Гопурам храму Міенакші, Мадурай', position: '50% 30%' },
  ),
} as const satisfies Record<string, ImageConfig>
