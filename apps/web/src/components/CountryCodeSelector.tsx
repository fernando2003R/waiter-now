import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
}

export const countries: Country[] = [
  // Colombia como primera opción
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  
  // Resto de países en orden alfabético
  { code: 'AD', name: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', dialCode: '+971', flag: '🇦🇪' },
  { code: 'AF', name: 'Afganistán', dialCode: '+93', flag: '🇦🇫' },
  { code: 'AG', name: 'Antigua y Barbuda', dialCode: '+1268', flag: '🇦🇬' },
  { code: 'AI', name: 'Anguila', dialCode: '+1264', flag: '🇦🇮' },
  { code: 'AL', name: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'AM', name: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'AQ', name: 'Antártida', dialCode: '+672', flag: '🇦🇶' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'AS', name: 'Samoa Americana', dialCode: '+1684', flag: '🇦🇸' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AW', name: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
  { code: 'AX', name: 'Islas Åland', dialCode: '+358', flag: '🇦🇽' },
  { code: 'AZ', name: 'Azerbaiyán', dialCode: '+994', flag: '🇦🇿' },
  { code: 'BA', name: 'Bosnia y Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { code: 'BB', name: 'Barbados', dialCode: '+1246', flag: '🇧🇧' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'BE', name: 'Bélgica', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BG', name: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'BH', name: 'Baréin', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BI', name: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'BJ', name: 'Benín', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BL', name: 'San Bartolomé', dialCode: '+590', flag: '🇧🇱' },
  { code: 'BM', name: 'Bermudas', dialCode: '+1441', flag: '🇧🇲' },
  { code: 'BN', name: 'Brunéi', dialCode: '+673', flag: '🇧🇳' },
  { code: 'BO', name: 'Bolivia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'BQ', name: 'Bonaire', dialCode: '+599', flag: '🇧🇶' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1242', flag: '🇧🇸' },
  { code: 'BT', name: 'Bután', dialCode: '+975', flag: '🇧🇹' },
  { code: 'BV', name: 'Isla Bouvet', dialCode: '+47', flag: '🇧🇻' },
  { code: 'BW', name: 'Botsuana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BY', name: 'Bielorrusia', dialCode: '+375', flag: '🇧🇾' },
  { code: 'BZ', name: 'Belice', dialCode: '+501', flag: '🇧🇿' },
  { code: 'CA', name: 'Canadá', dialCode: '+1', flag: '🇨🇦' },
  { code: 'CC', name: 'Islas Cocos', dialCode: '+61', flag: '🇨🇨' },
  { code: 'CD', name: 'República Democrática del Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'CF', name: 'República Centroafricana', dialCode: '+236', flag: '🇨🇫' },
  { code: 'CG', name: 'República del Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CH', name: 'Suiza', dialCode: '+41', flag: '🇨🇭' },
  { code: 'CI', name: 'Costa de Marfil', dialCode: '+225', flag: '🇨🇮' },
  { code: 'CK', name: 'Islas Cook', dialCode: '+682', flag: '🇨🇰' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CM', name: 'Camerún', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'CW', name: 'Curazao', dialCode: '+599', flag: '🇨🇼' },
  { code: 'CX', name: 'Isla de Navidad', dialCode: '+61', flag: '🇨🇽' },
  { code: 'CY', name: 'Chipre', dialCode: '+357', flag: '🇨🇾' },
  { code: 'CZ', name: 'República Checa', dialCode: '+420', flag: '🇨🇿' },
  { code: 'DE', name: 'Alemania', dialCode: '+49', flag: '🇩🇪' },
  { code: 'DJ', name: 'Yibuti', dialCode: '+253', flag: '🇩🇯' },
  { code: 'DK', name: 'Dinamarca', dialCode: '+45', flag: '🇩🇰' },
  { code: 'DM', name: 'Dominica', dialCode: '+1767', flag: '🇩🇲' },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴' },
  { code: 'DZ', name: 'Argelia', dialCode: '+213', flag: '🇩🇿' },
  { code: 'EC', name: 'Ecuador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'EE', name: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'EG', name: 'Egipto', dialCode: '+20', flag: '🇪🇬' },
  { code: 'EH', name: 'Sahara Occidental', dialCode: '+212', flag: '🇪🇭' },
  { code: 'ER', name: 'Eritrea', dialCode: '+291', flag: '🇪🇷' },
  { code: 'ES', name: 'España', dialCode: '+34', flag: '🇪🇸' },
  { code: 'ET', name: 'Etiopía', dialCode: '+251', flag: '🇪🇹' },
  { code: 'FI', name: 'Finlandia', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FJ', name: 'Fiyi', dialCode: '+679', flag: '🇫🇯' },
  { code: 'FK', name: 'Islas Malvinas', dialCode: '+500', flag: '🇫🇰' },
  { code: 'FM', name: 'Micronesia', dialCode: '+691', flag: '🇫🇲' },
  { code: 'FO', name: 'Islas Feroe', dialCode: '+298', flag: '🇫🇴' },
  { code: 'FR', name: 'Francia', dialCode: '+33', flag: '🇫🇷' },
  { code: 'GA', name: 'Gabón', dialCode: '+241', flag: '🇬🇦' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'GD', name: 'Granada', dialCode: '+1473', flag: '🇬🇩' },
  { code: 'GE', name: 'Georgia', dialCode: '+995', flag: '🇬🇪' },
  { code: 'GF', name: 'Guayana Francesa', dialCode: '+594', flag: '🇬🇫' },
  { code: 'GG', name: 'Guernsey', dialCode: '+44', flag: '🇬🇬' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'GI', name: 'Gibraltar', dialCode: '+350', flag: '🇬🇮' },
  { code: 'GL', name: 'Groenlandia', dialCode: '+299', flag: '🇬🇱' },
  { code: 'GM', name: 'Gambia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GN', name: 'Guinea', dialCode: '+224', flag: '🇬🇳' },
  { code: 'GP', name: 'Guadalupe', dialCode: '+590', flag: '🇬🇵' },
  { code: 'GQ', name: 'Guinea Ecuatorial', dialCode: '+240', flag: '🇬🇶' },
  { code: 'GR', name: 'Grecia', dialCode: '+30', flag: '🇬🇷' },
  { code: 'GS', name: 'Islas Georgias del Sur y Sandwich del Sur', dialCode: '+500', flag: '🇬🇸' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'GU', name: 'Guam', dialCode: '+1671', flag: '🇬🇺' },
  { code: 'GW', name: 'Guinea-Bisáu', dialCode: '+245', flag: '🇬🇼' },
  { code: 'GY', name: 'Guyana', dialCode: '+592', flag: '🇬🇾' },
  { code: 'HK', name: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HM', name: 'Islas Heard y McDonald', dialCode: '+672', flag: '🇭🇲' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'HR', name: 'Croacia', dialCode: '+385', flag: '🇭🇷' },
  { code: 'HT', name: 'Haití', dialCode: '+509', flag: '🇭🇹' },
  { code: 'HU', name: 'Hungría', dialCode: '+36', flag: '🇭🇺' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IE', name: 'Irlanda', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'IM', name: 'Isla de Man', dialCode: '+44', flag: '🇮🇲' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'IO', name: 'Territorio Británico del Océano Índico', dialCode: '+246', flag: '🇮🇴' },
  { code: 'IQ', name: 'Irak', dialCode: '+964', flag: '🇮🇶' },
  { code: 'IR', name: 'Irán', dialCode: '+98', flag: '🇮🇷' },
  { code: 'IS', name: 'Islandia', dialCode: '+354', flag: '🇮🇸' },
  { code: 'IT', name: 'Italia', dialCode: '+39', flag: '🇮🇹' },
  { code: 'JE', name: 'Jersey', dialCode: '+44', flag: '🇯🇪' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1876', flag: '🇯🇲' },
  { code: 'JO', name: 'Jordania', dialCode: '+962', flag: '🇯🇴' },
  { code: 'JP', name: 'Japón', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KE', name: 'Kenia', dialCode: '+254', flag: '🇰🇪' },
  { code: 'KG', name: 'Kirguistán', dialCode: '+996', flag: '🇰🇬' },
  { code: 'KH', name: 'Camboya', dialCode: '+855', flag: '🇰🇭' },
  { code: 'KI', name: 'Kiribati', dialCode: '+686', flag: '🇰🇮' },
  { code: 'KM', name: 'Comoras', dialCode: '+269', flag: '🇰🇲' },
  { code: 'KN', name: 'San Cristóbal y Nieves', dialCode: '+1869', flag: '🇰🇳' },
  { code: 'KP', name: 'Corea del Norte', dialCode: '+850', flag: '🇰🇵' },
  { code: 'KR', name: 'Corea del Sur', dialCode: '+82', flag: '🇰🇷' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'KY', name: 'Islas Caimán', dialCode: '+1345', flag: '🇰🇾' },
  { code: 'KZ', name: 'Kazajistán', dialCode: '+7', flag: '🇰🇿' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { code: 'LB', name: 'Líbano', dialCode: '+961', flag: '🇱🇧' },
  { code: 'LC', name: 'Santa Lucía', dialCode: '+1758', flag: '🇱🇨' },
  { code: 'LI', name: 'Liechtenstein', dialCode: '+423', flag: '🇱🇮' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'LR', name: 'Liberia', dialCode: '+231', flag: '🇱🇷' },
  { code: 'LS', name: 'Lesoto', dialCode: '+266', flag: '🇱🇸' },
  { code: 'LT', name: 'Lituania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxemburgo', dialCode: '+352', flag: '🇱🇺' },
  { code: 'LV', name: 'Letonia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LY', name: 'Libia', dialCode: '+218', flag: '🇱🇾' },
  { code: 'MA', name: 'Marruecos', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MC', name: 'Mónaco', dialCode: '+377', flag: '🇲🇨' },
  { code: 'MD', name: 'Moldavia', dialCode: '+373', flag: '🇲🇩' },
  { code: 'ME', name: 'Montenegro', dialCode: '+382', flag: '🇲🇪' },
  { code: 'MF', name: 'San Martín', dialCode: '+590', flag: '🇲🇫' },
  { code: 'MG', name: 'Madagascar', dialCode: '+261', flag: '🇲🇬' },
  { code: 'MH', name: 'Islas Marshall', dialCode: '+692', flag: '🇲🇭' },
  { code: 'MK', name: 'Macedonia del Norte', dialCode: '+389', flag: '🇲🇰' },
  { code: 'ML', name: 'Malí', dialCode: '+223', flag: '🇲🇱' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'MN', name: 'Mongolia', dialCode: '+976', flag: '🇲🇳' },
  { code: 'MO', name: 'Macao', dialCode: '+853', flag: '🇲🇴' },
  { code: 'MP', name: 'Islas Marianas del Norte', dialCode: '+1670', flag: '🇲🇵' },
  { code: 'MQ', name: 'Martinica', dialCode: '+596', flag: '🇲🇶' },
  { code: 'MR', name: 'Mauritania', dialCode: '+222', flag: '🇲🇷' },
  { code: 'MS', name: 'Montserrat', dialCode: '+1664', flag: '🇲🇸' },
  { code: 'MT', name: 'Malta', dialCode: '+356', flag: '🇲🇹' },
  { code: 'MU', name: 'Mauricio', dialCode: '+230', flag: '🇲🇺' },
  { code: 'MV', name: 'Maldivas', dialCode: '+960', flag: '🇲🇻' },
  { code: 'MW', name: 'Malaui', dialCode: '+265', flag: '🇲🇼' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'MY', name: 'Malasia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MZ', name: 'Mozambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'NA', name: 'Namibia', dialCode: '+264', flag: '🇳🇦' },
  { code: 'NC', name: 'Nueva Caledonia', dialCode: '+687', flag: '🇳🇨' },
  { code: 'NE', name: 'Níger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'NF', name: 'Isla Norfolk', dialCode: '+672', flag: '🇳🇫' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'NI', name: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'NL', name: 'Países Bajos', dialCode: '+31', flag: '🇳🇱' },
  { code: 'NO', name: 'Noruega', dialCode: '+47', flag: '🇳🇴' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'NR', name: 'Nauru', dialCode: '+674', flag: '🇳🇷' },
  { code: 'NU', name: 'Niue', dialCode: '+683', flag: '🇳🇺' },
  { code: 'NZ', name: 'Nueva Zelanda', dialCode: '+64', flag: '🇳🇿' },
  { code: 'OM', name: 'Omán', dialCode: '+968', flag: '🇴🇲' },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦' },
  { code: 'PE', name: 'Perú', dialCode: '+51', flag: '🇵🇪' },
  { code: 'PF', name: 'Polinesia Francesa', dialCode: '+689', flag: '🇵🇫' },
  { code: 'PG', name: 'Papúa Nueva Guinea', dialCode: '+675', flag: '🇵🇬' },
  { code: 'PH', name: 'Filipinas', dialCode: '+63', flag: '🇵🇭' },
  { code: 'PK', name: 'Pakistán', dialCode: '+92', flag: '🇵🇰' },
  { code: 'PL', name: 'Polonia', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PM', name: 'San Pedro y Miquelón', dialCode: '+508', flag: '🇵🇲' },
  { code: 'PN', name: 'Islas Pitcairn', dialCode: '+64', flag: '🇵🇳' },
  { code: 'PR', name: 'Puerto Rico', dialCode: '+1787', flag: '🇵🇷' },
  { code: 'PS', name: 'Palestina', dialCode: '+970', flag: '🇵🇸' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'PW', name: 'Palaos', dialCode: '+680', flag: '🇵🇼' },
  { code: 'PY', name: 'Paraguay', dialCode: '+595', flag: '🇵🇾' },
  { code: 'QA', name: 'Catar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'RE', name: 'Reunión', dialCode: '+262', flag: '🇷🇪' },
  { code: 'RO', name: 'Rumania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'RS', name: 'Serbia', dialCode: '+381', flag: '🇷🇸' },
  { code: 'RU', name: 'Rusia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'RW', name: 'Ruanda', dialCode: '+250', flag: '🇷🇼' },
  { code: 'SA', name: 'Arabia Saudí', dialCode: '+966', flag: '🇸🇦' },
  { code: 'SB', name: 'Islas Salomón', dialCode: '+677', flag: '🇸🇧' },
  { code: 'SC', name: 'Seychelles', dialCode: '+248', flag: '🇸🇨' },
  { code: 'SD', name: 'Sudán', dialCode: '+249', flag: '🇸🇩' },
  { code: 'SE', name: 'Suecia', dialCode: '+46', flag: '🇸🇪' },
  { code: 'SG', name: 'Singapur', dialCode: '+65', flag: '🇸🇬' },
  { code: 'SH', name: 'Santa Elena', dialCode: '+290', flag: '🇸🇭' },
  { code: 'SI', name: 'Eslovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'SJ', name: 'Svalbard y Jan Mayen', dialCode: '+47', flag: '🇸🇯' },
  { code: 'SK', name: 'Eslovaquia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SL', name: 'Sierra Leona', dialCode: '+232', flag: '🇸🇱' },
  { code: 'SM', name: 'San Marino', dialCode: '+378', flag: '🇸🇲' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'SO', name: 'Somalia', dialCode: '+252', flag: '🇸🇴' },
  { code: 'SR', name: 'Surinam', dialCode: '+597', flag: '🇸🇷' },
  { code: 'SS', name: 'Sudán del Sur', dialCode: '+211', flag: '🇸🇸' },
  { code: 'ST', name: 'Santo Tomé y Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'SX', name: 'Sint Maarten', dialCode: '+1721', flag: '🇸🇽' },
  { code: 'SY', name: 'Siria', dialCode: '+963', flag: '🇸🇾' },
  { code: 'SZ', name: 'Esuatini', dialCode: '+268', flag: '🇸🇿' },
  { code: 'TC', name: 'Islas Turcas y Caicos', dialCode: '+1649', flag: '🇹🇨' },
  { code: 'TD', name: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'TF', name: 'Territorios Australes Franceses', dialCode: '+262', flag: '🇹🇫' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'TH', name: 'Tailandia', dialCode: '+66', flag: '🇹🇭' },
  { code: 'TJ', name: 'Tayikistán', dialCode: '+992', flag: '🇹🇯' },
  { code: 'TK', name: 'Tokelau', dialCode: '+690', flag: '🇹🇰' },
  { code: 'TL', name: 'Timor Oriental', dialCode: '+670', flag: '🇹🇱' },
  { code: 'TM', name: 'Turkmenistán', dialCode: '+993', flag: '🇹🇲' },
  { code: 'TN', name: 'Túnez', dialCode: '+216', flag: '🇹🇳' },
  { code: 'TO', name: 'Tonga', dialCode: '+676', flag: '🇹🇴' },
  { code: 'TR', name: 'Turquía', dialCode: '+90', flag: '🇹🇷' },
  { code: 'TT', name: 'Trinidad y Tobago', dialCode: '+1868', flag: '🇹🇹' },
  { code: 'TV', name: 'Tuvalu', dialCode: '+688', flag: '🇹🇻' },
  { code: 'TW', name: 'Taiwán', dialCode: '+886', flag: '🇹🇼' },
  { code: 'TZ', name: 'Tanzania', dialCode: '+255', flag: '🇹🇿' },
  { code: 'UA', name: 'Ucrania', dialCode: '+380', flag: '🇺🇦' },
  { code: 'UG', name: 'Uganda', dialCode: '+256', flag: '🇺🇬' },
  { code: 'UM', name: 'Islas Ultramarinas de Estados Unidos', dialCode: '+1', flag: '🇺🇲' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'UY', name: 'Uruguay', dialCode: '+598', flag: '🇺🇾' },
  { code: 'UZ', name: 'Uzbekistán', dialCode: '+998', flag: '🇺🇿' },
  { code: 'VA', name: 'Ciudad del Vaticano', dialCode: '+39', flag: '🇻🇦' },
  { code: 'VC', name: 'San Vicente y las Granadinas', dialCode: '+1784', flag: '🇻🇨' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'VG', name: 'Islas Vírgenes Británicas', dialCode: '+1284', flag: '🇻🇬' },
  { code: 'VI', name: 'Islas Vírgenes de los Estados Unidos', dialCode: '+1340', flag: '🇻🇮' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'VU', name: 'Vanuatu', dialCode: '+678', flag: '🇻🇺' },
  { code: 'WF', name: 'Wallis y Futuna', dialCode: '+681', flag: '🇼🇫' },
  { code: 'WS', name: 'Samoa', dialCode: '+685', flag: '🇼🇸' },
  { code: 'YE', name: 'Yemen', dialCode: '+967', flag: '🇾🇪' },
  { code: 'YT', name: 'Mayotte', dialCode: '+262', flag: '🇾🇹' },
  { code: 'ZA', name: 'Sudáfrica', dialCode: '+27', flag: '🇿🇦' },
  { code: 'ZM', name: 'Zambia', dialCode: '+260', flag: '🇿🇲' },
  { code: 'ZW', name: 'Zimbabue', dialCode: '+263', flag: '🇿🇼' },
]

interface CountryCodeSelectorProps {
  selectedCountry: Country
  onCountryChange: (country: Country) => void
  className?: string
}

export function CountryCodeSelector({ selectedCountry, onCountryChange, className = '' }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleCountrySelect = (country: Country) => {
    onCountryChange(country)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      >
        <span className="text-lg mr-2">{selectedCountry.flag}</span>
        <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
        <ChevronDown className={`ml-1 h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-80 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar país..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={`w-full flex items-center px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                  selectedCountry.code === country.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                }`}
              >
                <span className="text-lg mr-3">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{country.name}</div>
                  <div className="text-xs text-gray-500">{country.dialCode}</div>
                </div>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No se encontraron países
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}