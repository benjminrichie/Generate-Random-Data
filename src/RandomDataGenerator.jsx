import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function RandomDataGenerator() {
  const [count, setCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [data, setData] = useState([]);
  const [downloadFormat, setDownloadFormat] = useState('csv');
  
  // Customizable gender options
  const [genderOptions, setGenderOptions] = useState(['Male', 'Female']);
  const [newGenderOption, setNewGenderOption] = useState('');
  
  // Dynamic columns management
  const [columns, setColumns] = useState([
    { name: 'Surname', type: 'name', subtype: 'surname' },
    { name: 'Other_names', type: 'name', subtype: 'fullname' },
    { name: 'Gender', type: 'gender' }
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('name');
  const [newColumnSubtype, setNewColumnSubtype] = useState('fullname');
  const [newColumnOptions, setNewColumnOptions] = useState('');

  // Sample data for generation
  const dataBank = {
    surname: [
    // Original 100 names
    'Adebayo', 'Okonkwo', 'Okafor', 'Nwachukwu', 'Afolayan', 'Olawale', 'Adeyemi', 'Eze', 'Chukwu', 'Obasanjo',
    'Abiodun', 'Adeleke', 'Adesina', 'Agbaje', 'Akande', 'Akinlade', 'Akintola', 'Amusan', 'Ayodele', 'Babangida',
    'Balogun', 'Chibuike', 'Chidimma', 'Chinedu', 'Chisom', 'Danjuma', 'Eberechi', 'Egwu', 'Ekwueme', 'Emeka',
    'Ezekwesili', 'Falana', 'Fashola', 'Gowon', 'Ibrahim', 'Igwe', 'Iheanacho', 'Ikenna', 'Ike', 'Iwobi',
    'Kalu', 'Madu', 'Mohammed', 'Nduka', 'Nnamdi', 'Nwankwo', 'Obiora', 'Odegbami', 'Odili', 'Ogbonna',
    'Ogunlesi', 'Okadigbo', 'Okeke', 'Okereke', 'Okoro', 'Okoye', 'Olajuwon', 'Olaniyan', 'Olatunji', 'Olawale',
    'Olukoya', 'Omenka', 'Onabanjo', 'Oni', 'Onuoha', 'Osadebe', 'Oshinowo', 'Osinbajo', 'Oyinlola', 'Sanusi',
    'Saro-Wiwa', 'Shonekan', 'Soludo', 'Tinubu', 'Uche', 'Udoh', 'Ugwu', 'Umeh', 'Yakubu', 'Yesufu',
    'Adegoke', 'Adeniyi', 'Adesanya', 'Agada', 'Agbakoba', 'Ahmed', 'Ajayi', 'Akinola', 'Alabi', 'Aluko',
    'Amaechi', 'Anichebe', 'Ariyo', 'Asomugha', 'Atta', 'Awolowo', 'Azikiwe', 'Bakare', 'Bello', 'Chidiegwu',
    
    // Additional 1000 surnames
    'Abayomi', 'Abdullahi', 'Abiola', 'Aboderin', 'Abubakar', 'Achebe', 'Adamu', 'Addo', 'Adeniran', 'Aderemi',
    'Adetola', 'Adewumi', 'Adeyinka', 'Adeyokunnu', 'Adigun', 'Afenifere', 'Agbaje', 'Agbana', 'Agboola', 'Aguda',
    'Agunbiade', 'Ajakaiye', 'Ajala', 'Ajasin', 'Ajibade', 'Ajibola', 'Ajiboye', 'Ajimobi', 'Ajomale', 'Akanbi',
    'Akanni', 'Akerele', 'Akindele', 'Akinola', 'Akinpelu', 'Akinsanya', 'Akintayo', 'Akinyemi', 'Akpan', 'Alabi',
    'Alao', 'Alegbe', 'Alimi', 'Aloba', 'Alonge', 'Amadi', 'Amaefule', 'Amao', 'Aminu', 'Amos', 'Amosun',
    'Anagonye', 'Anenih', 'Anigbogu', 'Anikulapo', 'Anjorin', 'Ankrah', 'Anyanwu', 'Anyaoku', 'Apata', 'Aremu',
    'Ariyo', 'Asaolu', 'Ashiru', 'Asiwaju', 'Atanda', 'Atiku', 'Avoaja', 'Awodiya', 'Awolowo', 'Ayeni',
    'Ayinla', 'Ayoade', 'Ayodele', 'Ayoola', 'Azinge', 'Babalakin', 'Babatope', 'Badmus', 'Bago', 'Bala',
    'Bamgbose', 'Banire', 'Baruwa', 'Bello', 'Biobaku', 'Boladuro', 'Bolaji', 'Bolarinwa', 'Bolodeoku', 'Braithwaite',
    'Chiejina', 'Chikwendu', 'Chinaka', 'Chinonso', 'Chukwu', 'Chukwuma', 'Dada', 'Dairo', 'Danbaki', 'Daniel',
    'Davies', 'Dimka', 'Durosaro', 'Ebong', 'Edewor', 'Ekanem', 'Ekong', 'Elegbe', 'Emeka', 'Emezie',
    'Enwerem', 'Etete', 'Ezeife', 'Ezendu', 'Ezeugo', 'Ezeukwu', 'Fagbemi', 'Fagbohun', 'Fagbule', 'Fajana',
    'Fakeye', 'Falae', 'Falola', 'Familoni', 'Fasehun', 'Fawehinmi', 'Fayemi', 'Fayose', 'Gbadamosi', 'Gbenga',
    'George', 'Gowon', 'Haliru', 'Haruna', 'Hassan', 'Idowu', 'Igbinedion', 'Ighodalo', 'Ihenacho', 'Ikem',
    'Ikokwu', 'Ilori', 'Imam', 'Imoke', 'Inyang', 'Ismail', 'Iyabo', 'Jaiyeola', 'Jakande', 'Jemibewon',
    'Jide', 'Johnson', 'Joseph', 'Joshua', 'Kalu', 'Kamalu', 'Katsina', 'Kayode', 'Kazeem', 'Kehinde',
    'Keshi', 'Kuku', 'Kwankwaso', 'Ladoja', 'Lafiaji', 'Lalong', 'Lambo', 'Lawal', 'Lawson', 'Lemu',
    'Lukman', 'Mabadeje', 'Maduekwe', 'Malami', 'Mamora', 'Mba', 'Mbanefo', 'Mbeki', 'Mbu', 'Momoh',
    'Muazu', 'Mustapha', 'Muyiwa', 'Ndoma-Egba', 'Ngige', 'Nnaji', 'Nnanna', 'Nnamani', 'Nnewi', 'Nwosu',
    'Nzeribe', 'Nzimiro', 'Obafemi', 'Obaigbena', 'Obiano', 'Obiozor', 'Odua', 'Oduya', 'Ogbeifun', 'Ogbeh',
    'Ogbulafor', 'Ogundipe', 'Ogundimu', 'Ogunsola', 'Okadigbo', 'Okanlawon', 'Okecha', 'Okereke', 'Okoh',
    'Okonkwo', 'Okpara', 'Olarenwaju', 'Olasehinde', 'Olasupo', 'Olawunmi', 'Olayinka', 'Olayiwola', 'Oliseh',
    'Omehia', 'Omoruyi', 'Onabule', 'Onochie', 'Onyeama', 'Onyema', 'Opara', 'Orji', 'Osahon', 'Osho',
    'Otedola', 'Owolabi', 'Oyebanji', 'Oyediran', 'Oyegun', 'Oyekan', 'Oyeku', 'Oyeshola', 'Pate', 'Peterside',
    'Ribadu', 'Salako', 'Samuel', 'Saraki', 'Sekibo', 'Semenitari', 'Shagari', 'Shekarau', 'Shettima', 'Sodipo',
    'Solarin', 'Sunday', 'Sule', 'Suswam', 'Sylvester', 'Taiwo', 'Tanimu', 'Tarka', 'Tayo', 'Tella',
    'Temisan', 'Thompson', 'Tiamiyu', 'Timothy', 'Tofa', 'Tukur', 'Ubani', 'Ubosi', 'Udeze', 'Udom',
    'Ugochukwu', 'Ugwu', 'Ukiwo', 'Umar', 'Umaru', 'Unongo', 'Usoro', 'Uwazurike', 'Uzodimma', 'Wabara',
    'Wali', 'Williams', 'Yakasai', 'YarAdua', 'Yusuf', 'Zaccheus', 'Zakariya', 'Zanna', 'Zik', 'Zubair',
    'Adaora', 'Adebisi', 'Adebola', 'Adegboyega', 'Adelabu', 'Ademuyiwa', 'Adeniji', 'Adenuga', 'Aderemi', 'Adesola',
    'Adeyeye', 'Adigwe', 'Afegbua', 'Afenifere', 'Agagu', 'Agbakoba', 'Agbenu', 'Agbodemu', 'Agboola', 'Agbor',
    'Aguiyi-Ironsi', 'Agunloye', 'Ahmadu', 'Aig-Imoukhuede', 'Aimiuwu', 'Ajaero', 'Ajala', 'Ajanaku', 'Ajao',
    'Ajasin', 'Ajekigbe', 'Ajibade', 'Ajiboye', 'Ajumobi', 'Akande', 'Akanni', 'Akanmu', 'Akapo', 'Akeredolu',
    'Akigbe', 'Akinlade', 'Akinleye', 'Akinola', 'Akinrinade', 'Akinsete', 'Akinwale', 'Akinwunmi', 'Akinyele',
    'Akinyemi', 'Akinyode', 'Akpabio', 'Alapinni', 'Alao-Akala', 'Alao', 'Alege', 'Alhassan', 'Alibaba',
    'Aliko', 'Alimodu', 'Alimi', 'Alimosho', 'Alkali', 'Aluko', 'Aluko-Daniels', 'Amachree', 'Amadi',
    'Amaeshi', 'Amakiri', 'Amanze', 'Amao', 'Amaraegbu', 'Amarere', 'Amassoma', 'Amawu', 'Ameh', 'Ameobi',
    'Aminu', 'Amos', 'Amosun', 'Anaekwe', 'Anagonye', 'Anambra', 'Ananaba', 'Anasoh', 'Andah', 'Anenih',
    'Aneto', 'Angahar', 'Aniekwe', 'Anigbogu', 'Anike', 'Anikulapo-Kuti', 'Animashaun', 'Anise', 'Aniyeloye',
    'Ankeli', 'Annas', 'Anyanwu', 'Anyaoha', 'Anyaoku', 'Apata', 'Apena', 'Araba', 'Aremu', 'Aribisala',
    'Ariyo', 'Arkilla', 'Aromire', 'Aroyewun', 'Asaolu', 'Asante', 'Asari-Dokubo', 'Asemota', 'Ashafa',
    'Ashiru', 'Asimolowo', 'Asiwaju', 'Asuzu', 'Atabo', 'Atanda', 'Atere', 'Atiku', 'Atta', 'Attah',
    'Augustine', 'Auwal', 'Awani', 'Awokoya', 'Awolola', 'Awoniyi', 'Awosika', 'Awoyemi', 'Ayade', 'Ayandele',
    'Ayangburen', 'Ayeni', 'Ayida', 'Ayinla', 'Ayinmo', 'Ayoade', 'Ayokanmi', 'Ayoola', 'Ayuba', 'Azaiki',
    'Azinge', 'Babalakin', 'Babangida', 'Babatunde', 'Babtope', 'Badamasi', 'Badejo', 'Badmus', 'Bago',
    'Bagobiri', 'Baiyewu', 'Bajulaiye', 'Bakare', 'Bako', 'Bala', 'Balarabe', 'Balewa', 'Bamaiyi',
    'Bamgbose', 'Bamidele', 'Banji', 'Banire', 'Barde', 'Barewa', 'Barkin-Zuwo', 'Baruwa', 'Bashir',
    'Bassey', 'Bature', 'Bauchi', 'Bayelsa', 'Beere', 'Bello', 'Benue', 'Biobaku', 'Bisalla', 'Biyi',
    'Bode-George', 'Boladuro', 'Bolaji', 'Bolarinwa', 'Bolodeoku', 'Boroffice', 'Bornoma', 'Braithwaite',
    'Briggs', 'Broussa', 'Bugaje', 'Buni', 'Buratai', 'Buruji', 'Chafe', 'Chagok', 'Changkyes',
    'Chiejina', 'Chika', 'Chikwelu', 'Chime', 'Chinelo', 'Chinwoke', 'Chiroma', 'Chukwu', 'Chukwumerije',
    'Chukwuma', 'Ciroma', 'Clark', 'Cletus', 'Coker', 'Daba', 'Dada', 'Daggash', 'Dairo', 'Dakingari',
    'Dan-Ali', 'Danbaki', 'Danbatta', 'Dandume', 'Dangiwa', 'Daniel', 'Danmole', 'Dariye', 'Dasuki',
    'Davies', 'Dawodu', 'Dikko', 'Dimka', 'Durosaro', 'Ebong', 'Edewor', 'Edu', 'Edun', 'Egbe',
    'Egberongbe', 'Egwu', 'Ehanire', 'Ejide', 'Ekanem', 'Ekong', 'Ekpe', 'Ekwueme', 'Elegbe', 'Emeka',
    'Emezie', 'Emodi', 'Enang', 'Enwerem', 'Essien', 'Etete', 'Etiebet', 'Etim', 'Etti', 'Ewelukwa',
    'Ezeani', 'Ezechukwu', 'Ezeife', 'Ezendu', 'Ezeugo', 'Ezeukwu', 'Eziuche', 'Faboyede', 'Fagbemi',
    'Fagbohun', 'Fagbule', 'Fajana', 'Fakeye', 'Falae', 'Falola', 'Familoni', 'Farouk', 'Fasehun',
    'Fawehinmi', 'Fayemi', 'Fayode', 'Fayose', 'Festus', 'Folaranmi', 'Folorunsho', 'Foluke', 'Funsho',
    'Gabriel', 'Gaji', 'Garba', 'Gasali', 'Gbadamosi', 'Gbajabiamila', 'Gbenga', 'Gboyega', 'George',
    'Gidado', 'Gombe', 'Goodluck', 'Goson', 'Gowon', 'Gubio', 'Gumi', 'Gusau', 'Gwadabe', 'Habib',
    'Hadi', 'Haliru', 'Hameed', 'Hamisu', 'Hannatu', 'Haruna', 'Hassan', 'Hausawa', 'Hayatu', 'Henshaw',
    'Ibrahim', 'Idahosa', 'Idakwo', 'Ideriah', 'Idris', 'Idumah', 'Ifeanyi', 'Igali', 'Igbafe', 'Igbinedion',
    'Ighodalo', 'Ihenacho', 'Iheoma', 'Ikedi', 'Ikem', 'Ikokwu', 'Ikpeazu', 'Ilori', 'Imam', 'Imoke',
    'Inuwa', 'Inya', 'Inyang', 'Iredia', 'Isa', 'Isaac', 'Isekenegbe', 'Ismaila', 'Isong', 'Isyaku',
    'Iyabo', 'Iyalla', 'Izam', 'Jaafar', 'Jabi', 'Jacob', 'Jaiyeola', 'Jakande', 'James', 'Jang',
    'Jatau', 'Jega', 'Jemibewon', 'Jerry', 'Jide', 'Jigawa', 'Johnson', 'Jokolo', 'Jonah', 'Jonathan',
    'Joseph', 'Joshua', 'Jude', 'Jumbo', 'Junaid', 'Kabir', 'Kaduna', 'Kalu', 'Kamalu', 'Kano',
    'Kashim', 'Kassim', 'Katsina', 'Kayode', 'Kazeem', 'Kebbi', 'Kehinde', 'Keshi', 'Kila', 'Kogi',
    'Kuku', 'Kwankwaso', 'Kyari', 'Laah', 'Labaeka', 'Ladoja', 'Lafiaji', 'Lagos', 'Lalong', 'Lambo',
    'Lamido', 'Lanre', 'Lawal', 'Lawson', 'Lemu', 'Lukman', 'Mabadeje', 'Maina', 'Maduekwe', 'Magashi',
    'Malami', 'Mamman', 'Mamora', 'Manu', 'Marinho', 'Masari', 'Matawalle', 'Mba', 'Mbanefo', 'Mbeki',
    'Mbu', 'Mohammed', 'Momoh', 'Muazu', 'Mustapha', 'Muyiwa', 'Nabena', 'Nagari', 'Naidu', 'Nana',
    'Nasarawa', 'Nasir', 'Ndoma-Egba', 'Needam', 'Ngige', 'Nimasa', 'Nnaji', 'Nnanna', 'Nnamani',
    'Nnewi', 'Nwosu', 'Nzeribe', 'Nzimiro', 'Obafemi', 'Obaigbena', 'Obiano', 'Obiozor', 'Odua',
    'Oduya', 'Ogbeifun', 'Ogbeh', 'Ogbulafor', 'Ogundipe', 'Ogundimu', 'Ogunsola', 'Okadigbo', 'Okanlawon',
    'Okecha', 'Okereke', 'Okoh', 'Okonkwo', 'Okpara', 'Olarenwaju', 'Olasehinde', 'Olasupo', 'Olawunmi',
    'Olayinka', 'Olayiwola', 'Oliseh', 'Omehia', 'Omoruyi', 'Onabule', 'Onochie', 'Onyeama', 'Onyema',
    'Opara', 'Orji', 'Osahon', 'Osho', 'Otedola', 'Owolabi', 'Oyebanji', 'Oyediran', 'Oyegun', 'Oyekan',
    'Oyeku', 'Oyeshola', 'Pate', 'Peterside', 'Ribadu', 'Salako', 'Samuel', 'Saraki', 'Sekibo', 'Semenitari',
    'Shagari', 'Shekarau', 'Shettima', 'Sodipo', 'Solarin', 'Sunday', 'Suleiman', 'Suswam', 'Sylvester',
    'Taiwo', 'Tanimu', 'Tarka', 'Tayo', 'Tella', 'Temisan', 'Thompson', 'Tiamiyu', 'Timothy', 'Tofa',
    'Tukur', 'Ubani', 'Ubosi', 'Udeze', 'Udom', 'Ugochukwu', 'Ugwu', 'Ukiwo', 'Umar', 'Umaru',
    'Unongo', 'Usoro', 'Uwazurike', 'Uzodimma', 'Wabara', 'Wali', 'Williams', 'Yakasai', 'Yar\'Adua',
    'Yusuf', 'Zaccheus', 'Zakariya', 'Zanna', 'Zik', 'Zubair'
  ],
  
  firstname: [
    // Original 100 names
    'Adebola', 'Chioma', 'Oluwaseun', 'Ngozi', 'Emeka', 'Yetunde', 'Chinedu', 'Folake', 'Ikechukwu', 'Adaeze',
    'Oluwadamilola', 'Obinna', 'Aisha', 'Tunde', 'Amaka', 'Olumide', 'Nneka', 'Babatunde', 'Chika', 'Adewale',
    'Ifeoma', 'Olusegun', 'Chiamaka', 'Femi', 'Blessing', 'Rotimi', 'Uche', 'Segun', 'Uchenna', 'Kayode',
    'Kemi', 'Damilola', 'Chidinma', 'Wale', 'Bukola', 'Chukwuma', 'Yewande', 'Adekunle', 'Zainab', 'Bolaji',
    'Ebele', 'Kunle', 'Amarachi', 'Ademola', 'Chinwe', 'Gbenga', 'Chinyere', 'Tobi', 'Adanna', 'Olamide',
    'Funmilayo', 'Chigozie', 'Folashade', 'Oluchi', 'Kehinde', 'Chidimma', 'Ibrahim', 'Ogechi', 'Musa', 'Ijeoma',
    'Taiwo', 'Adaobi', 'Temitope', 'Chinelo', 'Hassan', 'Amara', 'Sadiq', 'Nkechi', 'Mohammed', 'Chinenye',
    'Rasheed', 'Adaora', 'Hakeem', 'Chizoba', 'Ahmed', 'Ifunanya', 'Idris', 'Olabisi', 'Kabiru', 'Precious',
    'Ayodele', 'Obiageli', 'Dolapo', 'Uzoma', 'Nnamdi', 'Ihuoma', 'Tolulope', 'Uzoma', 'Mojisola', 'Tochukwu',
    'Omolara', 'Obinna', 'Abiola', 'Chukwuemeka', 'Bisi', 'Kelechi', 'Abimbola', 'Chibuike', 'Fatima', 'Olajide',
    
    // Additional 1000 first names
    'Adaora', 'Adaugo', 'Adebayo', 'Adebisi', 'Adebola', 'Adegbola', 'Adegoke', 'Adeiza', 'Adelaja', 'Adeleke',
    'Ademide', 'Ademola', 'Adenike', 'Adeniyi', 'Adeola', 'Adeolu', 'Adeosun', 'Aderayo', 'Aderemi', 'Adesewa',
    'Adesina', 'Adesoji', 'Adetola', 'Adetomiwa', 'Adewale', 'Adewole', 'Adewunmi', 'Adeyemi', 'Adeyinka',
    'Adunni', 'Afoma', 'Afusat', 'Agatha', 'Agnes', 'Agozie', 'Aigboje', 'Aisha', 'Aiyetoro', 'Ajala',
    'Ajani', 'Akachi', 'Akanbi', 'Akande', 'Akeem', 'Akin', 'Akinde', 'Akinlabi', 'Akinola', 'Akinpelu',
    'Akinsola', 'Akintola', 'Akinwale', 'Akinwande', 'Akinwumi', 'Akinyele', 'Akinyemi', 'Akpan', 'Akwaugo',
    'Alaba', 'Alasan', 'Alayo', 'Alice', 'Alimi', 'Aloba', 'Aloma', 'Aloy', 'Amarachi', 'Amaraoge',
    'Amara', 'Amina', 'Aminat', 'Aminu', 'Amoke', 'Amusa', 'Anastasia', 'Andrew', 'Angela', 'Anietie',
    'Anjola', 'Anjorin', 'Anthony', 'Anyaele', 'Anyanwu', 'Anyichie', 'Araoluwa', 'Ariyo', 'Arthur', 'Asabe',
    'Asaolu', 'Asiru', 'Asiwaju', 'Atinuke', 'Augustine', 'Auwal', 'Awolola', 'Awoniyi', 'Ayaba', 'Ayanfe',
    'Ayantola', 'Ayegbayo', 'Ayinde', 'Ayinla', 'Ayobami', 'Ayodele', 'Ayodeji', 'Ayokunle', 'Ayomide',
    'Ayoola', 'Ayotunde', 'Azeemat', 'Babafemi', 'Babajide', 'Babalola', 'Babatola', 'Babatunde', 'Babs',
    'Badejo', 'Badmus', 'Banji', 'Bankole', 'Barakat', 'Bassey', 'Batulo', 'Beatrice', 'Bello', 'Benjamin',
    'Bidemi', 'Bimbola', 'Bisola', 'Blessing', 'Bolaji', 'Bolanle', 'Bolatito', 'Bolawale', 'Bose',
    'Bukky', 'Bunmi', 'Busayo', 'Caleb', 'Carolyn', 'Catherine', 'Cecilia', 'Celestine', 'Chiamaka',
    'Chibudom', 'Chibudo', 'Chibuike', 'Chibuzo', 'Chidi', 'Chidimma', 'Chiedu', 'Chigozie', 'Chika',
    'Chikwendu', 'Chimamanda', 'Chimezie', 'Chinaemere', 'Chinaza', 'Chinecherem', 'Chinedu', 'Chinelo',
    'Chinenye', 'Chinonso', 'Chinwe', 'Chinyere', 'Chioma', 'Chisom', 'Chituru', 'Chizoba', 'Chizoma',
    'Christiana', 'Christopher', 'Chuddy', 'Chuka', 'Chukwu', 'Chukwubuike', 'Chukwudum', 'Chukwuebuka',
    'Chukwuemeka', 'Chukwuma', 'Chukwunonso', 'Chukwunyere', 'Comfort', 'Cornelius', 'Dada', 'Daisy',
    'Daniel', 'David', 'Deborah', 'Demi', 'Dennis', 'Desmond', 'Diana', 'Dickson', 'Dolapo', 'Dominic',
    'Dorothy', 'Dumebi', 'Ebele', 'Ebere', 'Ebubechukwu', 'Echezona', 'Edith', 'Edna', 'Edward', 'Edwin',
    'Ejike', 'Ekene', 'Elizabeth', 'Emmanuel', 'Emeka', 'Endurance', 'Esosa', 'Esther', 'Eugene', 'Eunice',
    'Evelyn', 'Ezinne', 'Ezra', 'Faith', 'Fatai', 'Fatima', 'Fatimah', 'Favour', 'Fela', 'Felix',
    'Femi', 'Festus', 'Fidelis', 'Fiona', 'Florence', 'Folake', 'Folakemi', 'Folorunsho', 'Francis',
    'Frank', 'Frederick', 'Friday', 'Funke', 'Funmi', 'Funmilayo', 'Gabriel', 'Ganiyu', 'Gbenga',
    'George', 'Gift', 'Gina', 'Gladys', 'Glory', 'Godwin', 'Grace', 'Gregory', 'Habib', 'Hafsat',
    'Halima', 'Hannah', 'Haruna', 'Hassan', 'Helen', 'Henry', 'Hope', 'Ibrahim', 'Ifeoma', 'Ifunanya',
    'Ikechukwu', 'Ikenna', 'Ikechi', 'Ikenna', 'Innocent', 'Isaac', 'Isabella', 'Ishola', 'Israel',
    'Itunu', 'Iviagbegbenyekhai', 'Izuchukwu', 'Jafar', 'James', 'Janet', 'Jemima', 'Jennifer', 'Jerome',
    'Jessica', 'John', 'Jonathan', 'Joseph', 'Joshua', 'Joyce', 'Judith', 'Julia', 'Julius', 'Justina',
    'Kabir', 'Kamaldeen', 'Kamilu', 'Kanyinsola', 'Kemi', 'Kenneth', 'Khadijah', 'Kingsley', 'Kolawole',
    'Kunle', 'Labake', 'Lateef', 'Latifah', 'Lawal', 'Lawrence', 'Leah', 'Lilian', 'Linda', 'Louis',
    'Love', 'Loveth', 'Lukman', 'Lydia', 'Mabel', 'Magdalene', 'Mahmud', 'Maimuna', 'Makinde', 'Malik',
    'Mariam', 'Mary', 'Matthew', 'Maureen', 'Maxwell', 'Mayowa', 'Mercy', 'Michael', 'Michelle', 'Miracle',
    'Mohammed', 'Mojisola', 'Moses', 'Mubaraq', 'Mubarak', 'Muhibbah', 'Mukaila', 'Muktar', 'Mulikat',
    'Murtala', 'Musa', 'Mustapha', 'Nafisat', 'Nancy', 'Nasir', 'Nathaniel', 'Ndidi', 'Nebechi',
    'Nelson', 'Ngozi', 'Nicholas', 'Nkechi', 'Nkem', 'Nkiru', 'Nneka', 'Nnenna', 'Noah', 'Nonso',
    'Nora', 'Nnamdi', 'Oba', 'Obadiah', 'Obinna', 'Obioma', 'Ochuko', 'Odunayo', 'Ogbonna', 'Ogechi',
    'Oghenekaro', 'Oghenemine', 'Ogochukwu', 'Ogonna', 'Ogugua', 'Ogwu', 'Ohimai', 'Oiza', 'Oke',
    'Okechukwu', 'Okey', 'Okiemute', 'Okwudili', 'Oladele', 'Oladimeji', 'Oladipupo', 'Olajide', 'Olajumoke',
    'Olakemi', 'Olamide', 'Olanike', 'Olanrewaju', 'Olasunkanmi', 'Olatunde', 'Olatunji', 'Olatunbosun',
    'Olawale', 'Olayemi', 'Olayinka', 'Olayiwola', 'Olubukola', 'Oluchi', 'Olufemi', 'Olufunke', 'Olufunmilayo',
    'Olugbenga', 'Olukayode', 'Olumide', 'Olumuyiwa', 'Olurotimi', 'Olusegun', 'Oluseyi', 'Oluseun',
    'Olusola', 'Olusoji', 'Oluwadamilola', 'Oluwafemi', 'Oluwakemi', 'Oluwasegun', 'Oluwaseun', 'Oluwaseyi',
    'Oluwashina', 'Oluwatobi', 'Oluwatosin', 'Oluwatoyosi', 'Oluyemi', 'Omolara', 'Omowumi', 'Omotola',
    'Omotayo', 'Omotunde', 'Onome', 'Onyeka', 'Onyinye', 'Opeyemi', 'Osaze', 'Oscar', 'Osagie',
    'Osahon', 'Osaretin', 'Osato', 'Osazee', 'Ose', 'Oshodin', 'Osita', 'Otobong', 'Ovie', 'Owen',
    'Oyindamola', 'Oyintayo', 'Oyinkan', 'Oyinlola', 'Patrick', 'Patricia', 'Paul', 'Peace', 'Peter',
    'Philip', 'Precious', 'Prince', 'Princess', 'Prisca', 'Promise', 'Prosper', 'Queen', 'Racheal',
    'Rachel', 'Raheem', 'Rahmat', 'Ramatu', 'Rebecca', 'Richard', 'Rifkatu', 'Rita', 'Robert',
    'Roland', 'Rose', 'Rosemary', 'Ruth', 'Sabina', 'Sadiq', 'Safiya', 'Salami', 'Salisu', 'Samson',
    'Sandra', 'Sarah', 'Segun', 'Sekinat', 'Selim', 'Seun', 'Shakirat', 'Sharon', 'Shehu', 'Shola',
    'Sidi', 'Simon', 'Solomon', 'Stephen', 'Sulaimon', 'Sule', 'Sunday', 'Susan', 'Sylvester', 'Tajudeen',
    'Taiwo', 'Taiye', 'Temidayo', 'Temiloluwa', 'Temitayo', 'Temitope', 'Theresa', 'Thelma', 'Thomas',
    'Timothy', 'Titilayo', 'Titus', 'Tobi', 'Tobiloba', 'Tochukwu', 'Tolani', 'Tolulope', 'Tony',
    'Tracy', 'Trust', 'Tunde', 'Tunji', 'Uche', 'Uchechukwu', 'Uchenna', 'Udeme', 'Ugochukwu',
    'Ugonna', 'Umar', 'Umaru', 'Umeh', 'Uneanya', 'Uthman', 'Uzoma', 'Valentine', 'Vera', 'Victor',
    'Victoria', 'Vincent', 'Wale', 'Wasiu', 'Williams', 'Wilson', 'Wisdom', 'Yakubu', 'Yemi', 'Yetunde',
    'Yewande', 'Yinka', 'Yusuf', 'Zainab', 'Zakariya', 'Zara', 'Zaynab', 'Zeenat', 'Zikora', 'Zinobia'
  ],
  
  middlename: [
    // Original 50 names
    'Oluwaseyi', 'Chibuzo', 'Adebisi', 'Chukwuebuka', 'Ayomide', 'Oluwafemi', 'Chidubem', 'Folakemi', 'Ikenna', 'Onyinyechi',
    'Babajide', 'Chinaza', 'Tobiloba', 'Ugochi', 'Olamilekan', 'Onyekachi', 'Damilare', 'Chioma', 'Temitayo', 'Obiageli',
    'Chiziterem', 'Mobolaji', 'Nkiruka', 'Ayomikun', 'Chukwudi', 'Oluwadamisi', 'Ifeanyi', 'Abisola', 'Nnaemeka', 'Titilayo',
    'Kanyinsola', 'Tobechukwu', 'Temidayo', 'Chimamanda', 'Olugbenga', 'Uchechukwu', 'Adewunmi', 'Chinemerem', 'Mayowa', 'Obioma',
    'Opeyemi', 'Obiajulu', 'Oluwatobiloba', 'Ebubechukwu', 'Ayodeji', 'Chiemerie', 'Oluwakemi', 'Munachimso', 'Adeola', 'Chibuike',
    
    // Additional 1000 middle names (including empty strings for those without middle names)
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
    'Adaora', 'Adaugo', 'Adebayo', 'Adebisi', 'Adebola', 'Adegbola', 'Adegoke', 'Adelaja', 'Adeleke', 'Ademide',
    'Ademola', 'Adenike', 'Adeniyi', 'Adeola', 'Adeolu', 'Adeosun', 'Aderayo', 'Aderemi', 'Adesewa', 'Adesina',
    'Adesoji', 'Adetola', 'Adetomiwa', 'Adewale', 'Adewole', 'Adewunmi', 'Adeyemi', 'Adeyinka', 'Afoma', 'Afusat',
    'Agatha', 'Agnes', 'Agozie', 'Aigboje', 'Aisha', 'Aiyetoro', 'Ajala', 'Ajani', 'Akachi', 'Akanbi',
    'Akande', 'Akeem', 'Akin', 'Akinde', 'Akinlabi', 'Akinola', 'Akinpelu', 'Akinsola', 'Akintola', 'Akinwale',
    'Akinwande', 'Akinwumi', 'Akinyele', 'Akinyemi', 'Akpan', 'Akwaugo', 'Alaba', 'Alasan', 'Alayo', 'Alice',
    'Alimi', 'Aloba', 'Aloma', 'Aloy', 'Amarachi', 'Amaraoge', 'Amara', 'Amina', 'Aminat', 'Aminu',
    'Amoke', 'Amusa', 'Anastasia', 'Andrew', 'Angela', 'Anietie', 'Anjola', 'Anjorin', 'Anthony', 'Anyaele',
    'Anyanwu', 'Anyichie', 'Araoluwa', 'Ariyo', 'Arthur', 'Asabe', 'Asaolu', 'Asiru', 'Asiwaju', 'Atinuke',
    'Augustine', 'Auwal', 'Awolola', 'Awoniyi', 'Ayaba', 'Ayanfe', 'Ayantola', 'Ayegbayo', 'Ayinde', 'Ayinla',
    'Ayobami', 'Ayodele', 'Ayodeji', 'Ayokunle', 'Ayomide', 'Ayoola', 'Ayotunde', 'Azeemat', 'Babafemi', 'Babajide',
    'Babalola', 'Babatola', 'Babatunde', 'Babs', 'Badejo', 'Badmus', 'Banji', 'Bankole', 'Barakat', 'Bassey',
    'Batulo', 'Beatrice', 'Bello', 'Benjamin', 'Bidemi', 'Bimbola', 'Bisola', 'Blessing', 'Bolaji', 'Bolanle',
    'Bolatito', 'Bolawale', 'Bose', 'Bukky', 'Bunmi', 'Busayo', 'Caleb', 'Carolyn', 'Catherine', 'Cecilia',
    'Celestine', 'Chiamaka', 'Chibudom', 'Chibudo', 'Chibuike', 'Chibuzo', 'Chidi', 'Chidimma', 'Chiedu',
    'Chigozie', 'Chika', 'Chikwendu', 'Chimamanda', 'Chimezie', 'Chinaemere', 'Chinaza', 'Chinecherem',
    'Chinedu', 'Chinelo', 'Chinenye', 'Chinonso', 'Chinwe', 'Chinyere', 'Chioma', 'Chisom', 'Chituru',
    'Chizoba', 'Chizoma', 'Christiana', 'Christopher', 'Chuddy', 'Chuka', 'Chukwu', 'Chukwubuike', 'Chukwudum',
    'Chukwuebuka', 'Chukwuemeka', 'Chukwuma', 'Chukwunonso', 'Chukwunyere', 'Comfort', 'Cornelius', 'Dada',
    'Daisy', 'Daniel', 'David', 'Deborah', 'Demi', 'Dennis', 'Desmond', 'Diana', 'Dickson', 'Dolapo',
    'Dominic', 'Dorothy', 'Dumebi', 'Ebele', 'Ebere', 'Ebubechukwu', 'Echezona', 'Edith', 'Edna', 'Edward',
    'Edwin', 'Ejike', 'Ekene', 'Elizabeth', 'Emmanuel', 'Emeka', 'Endurance', 'Esosa', 'Esther', 'Eugene',
    'Eunice', 'Evelyn', 'Ezinne', 'Ezra', 'Faith', 'Fatai', 'Fatima', 'Fatimah', 'Favour', 'Fela',
    'Felix', 'Femi', 'Festus', 'Fidelis', 'Fiona', 'Florence', 'Folake', 'Folakemi', 'Folorunsho', 'Francis',
    'Frank', 'Frederick', 'Friday', 'Funke', 'Funmi', 'Funmilayo', 'Gabriel', 'Ganiyu', 'Gbenga', 'George',
    'Gift', 'Gina', 'Gladys', 'Glory', 'Godwin', 'Grace', 'Gregory', 'Habib', 'Hafsat', 'Halima',
    'Hannah', 'Haruna', 'Hassan', 'Helen', 'Henry', 'Hope', 'Ibrahim', 'Ifeoma', 'Ifunanya', 'Ikechukwu',
    'Ikenna', 'Ikechi', 'Innocent', 'Isaac', 'Isabella', 'Ishola', 'Israel', 'Itunu', 'Izuchukwu', 'Jafar',
    'James', 'Janet', 'Jemima', 'Jennifer', 'Jerome', 'Jessica', 'John', 'Jonathan', 'Joseph', 'Joshua',
    'Joyce', 'Judith', 'Julia', 'Julius', 'Justina', 'Kabir', 'Kamaldeen', 'Kamilu', 'Kanyinsola', 'Kemi',
    'Kenneth', 'Khadijah', 'Kingsley', 'Kolawole', 'Kunle', 'Labake', 'Lateef', 'Latifah', 'Lawal', 'Lawrence',
    'Leah', 'Lilian', 'Linda', 'Louis', 'Love', 'Loveth', 'Lukman', 'Lydia', 'Mabel', 'Magdalene',
    'Mahmud', 'Maimuna', 'Makinde', 'Malik', 'Mariam', 'Mary', 'Matthew', 'Maureen', 'Maxwell', 'Mayowa',
    'Mercy', 'Michael', 'Michelle', 'Miracle', 'Mohammed', 'Mojisola', 'Moses', 'Mubaraq', 'Mubarak', 'Muhibbah',
    'Mukaila', 'Muktar', 'Mulikat', 'Murtala', 'Musa', 'Mustapha', 'Nafisat', 'Nancy', 'Nasir', 'Nathaniel',
    'Ndidi', 'Nebechi', 'Nelson', 'Ngozi', 'Nicholas', 'Nkechi', 'Nkem', 'Nkiru', 'Nneka', 'Nnenna',
    'Noah', 'Nonso', 'Nora', 'Nnamdi', 'Oba', 'Obadiah', 'Obinna', 'Obioma', 'Ochuko', 'Odunayo',
    'Ogbonna', 'Ogechi', 'Oghenekaro', 'Oghenemine', 'Ogochukwu', 'Ogonna', 'Ogugua', 'Ogwu', 'Ohimai',
    'Oiza', 'Oke', 'Okechukwu', 'Okey', 'Okiemute', 'Okwudili', 'Oladele', 'Oladimeji', 'Oladipupo',
    'Olajide', 'Olajumoke', 'Olakemi', 'Olamide', 'Olanike', 'Olanrewaju', 'Olasunkanmi', 'Olatunde',
    'Olatunji', 'Olatunbosun', 'Olawale', 'Olayemi', 'Olayinka', 'Olayiwola', 'Olubukola', 'Oluchi',
    'Olufemi', 'Olufunke', 'Olufunmilayo', 'Olugbenga', 'Olukayode', 'Olumide', 'Olumuyiwa', 'Olurotimi',
    'Olusegun', 'Oluseyi', 'Oluseun', 'Olusola', 'Olusoji', 'Oluwadamilola', 'Oluwafemi', 'Oluwakemi',
    'Oluwasegun', 'Oluwaseun', 'Oluwaseyi', 'Oluwashina', 'Oluwatobi', 'Oluwatosin', 'Oluwatoyosi',
    'Oluyemi', 'Omolara', 'Omowumi', 'Omotola', 'Omotayo', 'Omotunde', 'Onome', 'Onyeka', 'Onyinye',
    'Opeyemi', 'Osaze', 'Oscar', 'Osagie', 'Osahon', 'Osaretin', 'Osato', 'Osazee', 'Ose', 'Oshodin',
    'Osita', 'Otobong', 'Ovie', 'Owen', 'Oyindamola', 'Oyintayo', 'Oyinkan', 'Oyinlola', 'Patrick',
    'Patricia', 'Paul', 'Peace', 'Peter', 'Philip', 'Precious', 'Prince', 'Princess', 'Prisca',
    'Promise', 'Prosper', 'Queen', 'Racheal', 'Rachel', 'Raheem', 'Rahmat', 'Ramatu', 'Rebecca',
    'Richard', 'Rifkatu', 'Rita', 'Robert', 'Roland', 'Rose', 'Rosemary', 'Ruth', 'Sabina',
    'Sadiq', 'Safiya', 'Salami', 'Salisu', 'Samson', 'Sandra', 'Sarah', 'Segun', 'Sekinat',
    'Selim', 'Seun', 'Shakirat', 'Sharon', 'Shehu', 'Shola', 'Sidi', 'Simon', 'Solomon',
    'Stephen', 'Sulaimon', 'Sule', 'Sunday', 'Susan', 'Sylvester', 'Tajudeen', 'Taiwo', 'Taiye',
    'Temidayo', 'Temiloluwa', 'Temitayo', 'Temitope', 'Theresa', 'Thelma', 'Thomas', 'Timothy',
    'Titilayo', 'Titus', 'Tobi', 'Tobiloba', 'Tochukwu', 'Tolani', 'Tolulope', 'Tony', 'Tracy',
    'Trust', 'Tunde', 'Tunji', 'Uche', 'Uchechukwu', 'Uchenna', 'Udeme', 'Ugochukwu', 'Ugonna',
    'Umar', 'Umaru', 'Umeh', 'Uneanya', 'Uthman', 'Uzoma', 'Valentine', 'Vera', 'Victor',
    'Victoria', 'Vincent', 'Wale', 'Wasiu', 'Williams', 'Wilson', 'Wisdom', 'Yakubu', 'Yemi',
    'Yetunde', 'Yewande', 'Yinka', 'Yusuf', 'Zainab', 'Zakariya', 'Zara', 'Zaynab', 'Zeenat',
    'Zikora', 'Zinobia', 'Abioye', 'Adunola', 'Ajoke', 'Akinboye', 'Akinlolu', 'Akintunde',
    'Alake', 'Ameerah', 'Anfani', 'Anwuli', 'Apejoye', 'Asake', 'Ayankunle', 'Ayobola',
    'Azubike', 'Bamidele', 'Banke', 'Bilkisu', 'Busola', 'Chidozie', 'Chinweizu', 'Damilare',
    'Ebunoluwa', 'Eyitayo', 'Faderera', 'Farida', 'Gbemisola', 'Hafsa', 'Iniobong', 'Isoke',
    'Jokotade', 'Kehindra', 'Lamidat', 'Maryam', 'Nafisat', 'Oluwabunmi', 'Pelumi', 'Ronke',
    'Sekinah', 'Tinuade', 'Ufuoma', 'Wuraola', 'Yejide', 'Zubair'
  ],
    state: [
      'Lagos', 'Abuja FCT', 'Rivers', 'Kano', 'Oyo', 'Kaduna', 'Anambra', 'Imo', 'Delta', 'Akwa Ibom',
      'Ogun', 'Enugu', 'Osun', 'Edo', 'Borno', 'Abia', 'Ondo', 'Kogi', 'Sokoto', 'Ekiti',
      'Kwara', 'Plateau', 'Bauchi', 'Cross River', 'Niger', 'Adamawa', 'Bayelsa', 'Ebonyi', 'Benue', 'Gombe',
      'Jigawa', 'Katsina', 'Kebbi', 'Nasarawa', 'Taraba', 'Yobe', 'Zamfara'
    ],
    city: [
      'Lagos', 'Abuja', 'Kano', 'Ibadan', 'Port Harcourt', 'Benin City', 'Kaduna', 'Enugu', 'Aba', 'Onitsha',
      'Warri', 'Maiduguri', 'Zaria', 'Calabar', 'Jos', 'Ilorin', 'Abeokuta', 'Uyo', 'Sokoto', 'Akure',
      'Bauchi', 'Asaba', 'Osogbo', 'Makurdi', 'Minna', 'Yola', 'Owerri', 'Gombe', 'Yenagoa', 'Lokoja',
      'Ado-Ekiti', 'Umuahia', 'Damaturu', 'Dutse', 'Birnin Kebbi', 'Lafia', 'Abakaliki', 'Jalingo', 'Gusau', 'Katsina',
      'Awka', 'Ikeja', 'Surulere', 'Lekki', 'Yaba', 'Ikorodu', 'Mushin', 'Ojo', 'Ogba', 'Festac',
      'Ajah', 'Egbeda', 'Ojodu', 'Apapa', 'Epe', 'Agege', 'Ijebu Ode', 'Ondo', 'Okene', 'Nsukka'
    ],
    email: [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'protonmail.com', 'mail.com', 'icloud.com',
      'zoho.com', 'ymail.com', 'rocketmail.com', 'live.com', 'fastmail.com', 'yahoo.co.uk', 'gmail.co.uk'
    ]
  };

  const addGenderOption = () => {
    if (!newGenderOption.trim()) {
      alert('Please enter a gender option');
      return;
    }
    
    if (genderOptions.includes(newGenderOption.trim())) {
      alert('This gender option already exists');
      return;
    }
    
    setGenderOptions([...genderOptions, newGenderOption.trim()]);
    setNewGenderOption('');
  };

  const removeGenderOption = (option) => {
    if (genderOptions.length <= 1) {
      alert('You must have at least one gender option');
      return;
    }
    setGenderOptions(genderOptions.filter(gender => gender !== option));
  };

  const addColumn = () => {
    if (!newColumnName.trim()) {
      alert('Please enter a column name');
      return;
    }
    
    const columnExists = columns.some(col => col.name === newColumnName);
    if (columnExists) {
      alert('Column name already exists');
      return;
    }

    const newColumn = {
      name: newColumnName,
      type: newColumnType
    };

    if (newColumnType === 'name' || newColumnType === 'location') {
      newColumn.subtype = newColumnSubtype;
    }

    if (newColumnType === 'category' && newColumnOptions.trim()) {
      newColumn.options = newColumnOptions.split(',').map(opt => opt.trim());
    }

    setColumns([...columns, newColumn]);
    setNewColumnName('');
    setNewColumnOptions('');
  };

  const removeColumn = (index) => {
    if (columns.length <= 1) {
      alert('You must have at least one column');
      return;
    }
    const newColumns = [...columns];
    newColumns.splice(index, 1);
    setColumns(newColumns);
  };

  const generateRandomValue = (column) => {
    switch (column.type) {
      case 'name':
        if (column.subtype === 'surname') {
          return dataBank.surname[Math.floor(Math.random() * dataBank.surname.length)];
        } else if (column.subtype === 'firstname') {
          return dataBank.firstname[Math.floor(Math.random() * dataBank.firstname.length)];
        } else if (column.subtype === 'fullname') {
          const firstName = dataBank.firstname[Math.floor(Math.random() * dataBank.firstname.length)];
          const hasMiddle = Math.random() > 0.5;
          const middleName = hasMiddle ? dataBank.middlename[Math.floor(Math.random() * dataBank.middlename.length)] : '';
          return middleName ? `${firstName} ${middleName}` : firstName;
        }
        return '';
      
      case 'location':
        if (column.subtype === 'country') {
          return dataBank.country[Math.floor(Math.random() * dataBank.country.length)];
        } else if (column.subtype === 'city') {
          return dataBank.city[Math.floor(Math.random() * dataBank.city.length)];
        }
        return '';
      
      case 'gender':
        return genderOptions[Math.floor(Math.random() * genderOptions.length)];
      
      case 'category':
        if (column.options && column.options.length > 0) {
          return column.options[Math.floor(Math.random() * column.options.length)];
        }
        return 'N/A';
      
      case 'number':
        const min = 1;
        const max = 1000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      
      case 'date':
        const start = new Date(2000, 0, 1);
        const end = new Date();
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
          .toISOString().split('T')[0];
      
      case 'email':
        const namePool = dataBank.firstname.concat(dataBank.surname);
        const name = namePool[Math.floor(Math.random() * namePool.length)].toLowerCase();
        const domain = dataBank.email[Math.floor(Math.random() * dataBank.email.length)];
        const randomNum = Math.floor(Math.random() * 10000);
        return `${name}${randomNum}@${domain}`;
      
      default:
        return 'N/A';
    }
  };

  const generateRandomData = () => {
    if (count > 10000) {
      alert('Maximum allowed count is 10,000');
      return;
    }
    
    if (count < 1) {
      alert('Minimum allowed count is 1');
      return;
    }

    if (columns.length === 0) {
      alert('Please add at least one column');
      return;
    }

    setIsGenerating(true);
    setGeneratedCount(0);
    const newData = [];
    
    // Generate data in chunks to prevent UI freezing
    const chunkSize = 500;
    const totalChunks = Math.ceil(count / chunkSize);
    
    const processChunk = (chunkIndex) => {
      if (chunkIndex >= totalChunks) {
        setData(newData);
        setIsGenerating(false);
        return;
      }
      
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, count);
      
      setTimeout(() => {
        for (let i = start; i < end; i++) {
          const record = {};
          
          columns.forEach(column => {
            record[column.name] = generateRandomValue(column);
          });
          
          newData.push(record);
        }
        
        setGeneratedCount(end);
        processChunk(chunkIndex + 1);
      }, 0);
    };
    
    processChunk(0);
  };

  const downloadData = () => {
    if (data.length === 0) {
      alert('Please generate data first');
      return;
    }

    setIsDownloading(true);
    
    try {
      switch (downloadFormat) {
        case 'csv':
          downloadCSV();
          break;
        case 'json':
          downloadJSON();
          break;
        case 'txt':
          downloadTXT();
          break;
        case 'html':
          downloadHTML();
          break;
        case 'xml':
          downloadXML();
          break;
        case 'excel':
          downloadExcel();
          break;
        default:
          downloadCSV();
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(`Error during download: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCSV = () => {
    // Create CSV content
    let csvContent = columns.map(col => col.name).join(',') + '\n';
    
    data.forEach(row => {
      const values = columns.map(col => {
        // Escape commas and quotes in the values
        const value = row[col.name] || '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvContent += values.join(',') + '\n';
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'random_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'random_data.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadTXT = () => {
    // Create text content
    let txtContent = columns.map(col => col.name).join('\t') + '\n';
    
    data.forEach(row => {
      const values = columns.map(col => row[col.name] || '');
      txtContent += values.join('\t') + '\n';
    });
    
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'random_data.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadHTML = () => {
    // Create HTML content
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Random Data</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        th { padding-top: 12px; padding-bottom: 12px; background-color: #4CAF50; color: white; }
      </style>
    </head>
    <body>
      <h2>Random Generated Data</h2>
      <table>
        <thead>
          <tr>
            ${columns.map(col => `<th>${col.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${columns.map(col => `<td>${row[col.name] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'random_data.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadXML = () => {
    // Create XML content
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n<records>\n`;
    
    data.forEach((row, index) => {
      xmlContent += `  <record id="${index + 1}">\n`;
      columns.forEach(col => {
        const value = row[col.name] || '';
        // Escape XML special characters
        const sanitizedValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
        
        xmlContent += `    <${col.name}>${sanitizedValue}</${col.name}>\n`;
      });
      xmlContent += `  </record>\n`;
    });
    
    xmlContent += `</records>`;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'random_data.xml');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


const downloadExcel = () => {
  try {
    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    
    // Generate the Excel file
    XLSX.writeFile(wb, 'random_data.xlsx');
  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert('Error generating Excel file');
  }
};

  // const downloadExcel = () => {
  //   // 1st create a CSV that Excel can parse
  //   let csvContent = columns.map(col => col.name).join(',') + '\n';
    
  //   data.forEach(row => {
  //     const values = columns.map(col => {
  //       // Escape commas and quotes in the values
  //       const value = row[col.name] || '';
  //       if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
  //         return `"${value.replace(/"/g, '""')}"`;
  //       }
  //       return value;
  //     });
  //     csvContent += values.join(',') + '\n';
  //   });
    
  //   // Create a blob and download with .xlsx extension
  //   // Note: This is still a CSV file but with an Excel extension
  //   // In a real implementation, we would use a library like xlsx or exceljs to create proper Excel files
  //   const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', 'random_data.xlsx');
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Random Data Generator
          </h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Records (1-10000)
        </label>
        <input
          type="number"
          min="1"
          max="10000"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value) || 0)}
          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Gender Options Configuration</h2>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {genderOptions.map((option, index) => (
              <div key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                <span className="mr-2">{option}</span>
                <button 
                  onClick={() => removeGenderOption(option)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={newGenderOption}
              onChange={(e) => setNewGenderOption(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add new gender option"
            />
            <button
              onClick={addGenderOption}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Column Configuration</h2>
        
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Column Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {columns.map((column, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{column.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{column.type}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {column.type === 'gender' && `Options: ${genderOptions.join(', ')}`}
                    {column.subtype && `Subtype: ${column.subtype}`}
                    {column.options && column.options.length > 0 && `Options: ${column.options.join(', ')}`}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <button 
                      onClick={() => removeColumn(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3">Add New Column</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Column Name
              </label>
              <input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Age, Country"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newColumnType}
                onChange={(e) => setNewColumnType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="gender">Gender</option>
                <option value="location">Location</option>
                <option value="category">Category</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
              </select>
            </div>
            
            {newColumnType === 'name' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name Type
                </label>
                <select
                  value={newColumnSubtype}
                  onChange={(e) => setNewColumnSubtype(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fullname">Full Name</option>
                  <option value="firstname">First Name</option>
                  <option value="surname">Surname</option>
                </select>
              </div>
            )}
            
            {newColumnType === 'location' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Type
                </label>
                <select
                  value={newColumnSubtype}
                  onChange={(e) => setNewColumnSubtype(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="country">Country</option>
                  <option value="city">City</option>
                </select>
              </div>
            )}
            
            {newColumnType === 'category' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma separated)
                </label>
                <input
                  type="text"
                  value={newColumnOptions}
                  onChange={(e) => setNewColumnOptions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Option1, Option2, Option3"
                />
              </div>
            )}
          </div>
          
          <button
            onClick={addColumn}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Column
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Data Generation & Export</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={generateRandomData}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Data'}
          </button>
          
          <div className="flex flex-1 sm:flex-none gap-2">
            <select
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isDownloading || data.length === 0}
            >
              <option value="csv">CSV (.csv)</option>
              <option value="excel">Excel (.xlsx)</option>
              <option value="json">JSON (.json)</option>
              <option value="txt">Text (.txt)</option>
              <option value="html">HTML (.html)</option>
              <option value="xml">XML (.xml)</option>
            </select>
            
            <button
              onClick={downloadData}
              disabled={isDownloading || data.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-green-300"
            >
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          </div>
        </div>
        
        {isGenerating && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(generatedCount / count) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Generated {generatedCount} of {count} records...
            </p>
          </div>
        )}
      </div>
      
      {data.length > 0 && !isGenerating && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Preview (first 10 records)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {row[column.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="mt-4 text-gray-600">
            {data.length} records generated. {data.length > 10 ? 'Use the download button to get the complete dataset.' : ''}
          </p>
        </div>
      )}
    </div>
  );
}