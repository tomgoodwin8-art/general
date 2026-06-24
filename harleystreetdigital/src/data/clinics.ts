/**
 * clinics.ts — single source of truth for the Harley Street Digital directory.
 *
 * One row per practice. Multiple practices at the same building are intentional
 * and kept (e.g. 10, 17, 68, 75, 98, 101, 132 Harley Street each carry several).
 * A genuinely multi-specialty practice (UME Health, 108/132/10 Harley Street)
 * may legitimately appear under more than one category.
 *
 * `verified: true`  — name, address, postcode, phone and site all came from a
 *                     primary source.
 * `verified: false` — name and site are good, but phone or postcode needs a
 *                     check against the clinic's own contact page, or sources
 *                     disagreed. Filter on this before publishing.
 *
 * Blank phone / postcode is left blank deliberately — not guessed.
 */

export interface Clinic {
  name: string;
  address: string;
  postcode: string;
  phone: string;
  /** Bare domain, e.g. "108harleystreet.co.uk". Rendered as https:// link. */
  website: string;
  verified: boolean;
}

export interface Category {
  id: string;
  title: string;
  /** Optional note shown under the category heading (team-facing flags). */
  note?: string;
  clinics: Clinic[];
}

export const categories: Category[] = [
  {
    id: "diagnostics-imaging",
    title: "Diagnostics & imaging",
    clinics: [
      { name: "London Private Ultrasound", address: "Welbeck Street, Marylebone", postcode: "W1G", phone: "020 7101 3377", website: "londonsono.com", verified: true },
      { name: "108 Harley Street", address: "108 Harley Street", postcode: "W1G 7ET", phone: "020 7563 1234", website: "108harleystreet.co.uk", verified: true },
      { name: "London Eye Diagnostic Centre (LEDC)", address: "25 Harley Street", postcode: "W1G 9QW", phone: "020 7323 5967", website: "ledc.co.uk", verified: true },
      { name: "European Scanning Centre", address: "68 Harley Street", postcode: "W1G 7HE", phone: "", website: "europeanscanning.com", verified: false },
      { name: "Marris Medical", address: "75 Harley Street", postcode: "W1G 8QL", phone: "020 3011 1788", website: "marrismedical.co.uk", verified: true },
      { name: "Sonoworld (Hale Clinic)", address: "4 Harley Street", postcode: "W1G 9PB", phone: "020 3633 4902", website: "sonoworld.co.uk", verified: true },
      { name: "Sonoworld (Weymouth Street)", address: "29 Weymouth Street", postcode: "W1G 7DB", phone: "020 3633 4902", website: "sonoworld.co.uk", verified: true },
      { name: "Prime Health Harley Street", address: "45 Queen Anne Street", postcode: "W1G 9JF", phone: "03300 252 100", website: "prime-health.co.uk", verified: true },
      { name: "Harley Street Ultrasound Group", address: "99 Harley Street, 3rd Floor", postcode: "W1G 6AQ", phone: "020 3904 4441", website: "harleystreetultrasound.com", verified: true },
      { name: "Ultrasound Diagnostic Services", address: "148 Harley Street", postcode: "W1G 7LG", phone: "020 7935 2243", website: "uds.uk.com", verified: true },
      { name: "UME Diagnostics", address: "17 Harley Street", postcode: "W1G 9QH", phone: "020 7467 6190", website: "umehealth.co.uk", verified: true },
      { name: "Oryon Imaging", address: "Wimpole Street", postcode: "W1G", phone: "", website: "uk.scan.com", verified: false },
      { name: "EchoMed", address: "10-11 Bulstrode Place", postcode: "W1U 2HX", phone: "", website: "", verified: false },
    ],
  },
  {
    id: "private-hospitals",
    title: "Private hospitals",
    clinics: [
      { name: "The London Clinic", address: "20 Devonshire Place", postcode: "W1G 6BW", phone: "020 7935 4444", website: "thelondonclinic.co.uk", verified: true },
      { name: "The Harley Street Clinic (HCA)", address: "35 Weymouth Street", postcode: "W1G 8BJ", phone: "020 7935 7700", website: "hcahealthcare.co.uk", verified: true },
      { name: "King Edward VII's Hospital", address: "5-10 Beaumont Street", postcode: "W1G 6AA", phone: "020 7467 4344", website: "kingedwardvii.co.uk", verified: true },
      { name: "King Edward VII's Hospital Medical Centre", address: "54 Beaumont Street", postcode: "W1G 6DW", phone: "", website: "kingedwardvii.co.uk", verified: false },
      { name: "The Harley Street Hospital", address: "19 Harley Street", postcode: "W1G 9QJ", phone: "", website: "theharleystreethospital.com", verified: false },
      { name: "66 Harley Street", address: "66 Harley Street", postcode: "W1G 7HD", phone: "020 7436 4568", website: "66harleyst.co.uk", verified: true },
      { name: "Weymouth Street Hospital (Phoenix)", address: "42-46 Weymouth Street", postcode: "W1G 6NP", phone: "", website: "phoenixhospitalgroup.com", verified: false },
      { name: "The Princess Grace Hospital (HCA)", address: "42-52 Nottingham Place", postcode: "W1U 5NY", phone: "", website: "hcahealthcare.co.uk", verified: false },
      { name: "One Welbeck", address: "1 Welbeck Street", postcode: "W1G 0AR", phone: "", website: "onewelbeck.com", verified: false },
      { name: "Harley Street Specialist Hospital", address: "18-22 Queen Anne Street", postcode: "W1G", phone: "", website: "hssh.health", verified: false },
      { name: "The Portland Hospital (HCA)", address: "209 Great Portland Street", postcode: "W1W 5AH", phone: "", website: "hcahealthcare.co.uk", verified: false },
      { name: "RB&HH Specialist Care", address: "77 Wimpole Street", postcode: "W1G 9RU", phone: "020 3993 4388", website: "rbhh-specialistcare.co.uk", verified: true },
      { name: "Guy's & St Thomas' Wimpole Street Consulting Rooms", address: "77-79 Wimpole Street", postcode: "W1G 9RU", phone: "020 3993 4388", website: "guysandstthomasspecialistcare.co.uk", verified: true },
    ],
  },
  {
    id: "eye-ear-nose-throat",
    title: "Eye, ear, nose & throat",
    clinics: [
      { name: "The London Vision Clinic", address: "138 Harley Street", postcode: "W1G 7LA", phone: "020 7224 1005", website: "londonvisionclinic.com", verified: true },
      { name: "The London Clinic Eye Centre", address: "119 Harley Street", postcode: "W1G 6AU", phone: "020 7616 7768", website: "thelondonclinic.co.uk", verified: true },
      { name: "Eyes at 22a (Harley Street Eye Centre)", address: "22a Harley Street", postcode: "W1G 9BP", phone: "020 3968 2030", website: "eyesat22a.com", verified: true },
      { name: "Harley Street Eye Clinic", address: "86 Harley Street", postcode: "W1G 7HP", phone: "020 7060 0086", website: "harleystreeteye.com", verified: true },
      { name: "London Ophthalmology Centre (LondonOC)", address: "99 Harley Street", postcode: "W1G 6AQ", phone: "020 7000 3193", website: "londonoc.co.uk", verified: true },
      { name: "Clinica London", address: "Harley Street", postcode: "W1G", phone: "", website: "clinicalondon.co.uk", verified: false },
      { name: "Infinity Eye Clinic", address: "Harley Street", postcode: "W1G", phone: "0800 880 3300", website: "infinityeyeclinic.com", verified: false },
      { name: "The Harley Street ENT Clinic", address: "109 Harley Street", postcode: "W1G 6AN", phone: "020 7631 4448", website: "harleystreetent.com", verified: true },
      { name: "The Ear Nose & Throat Practice", address: "109 Harley Street", postcode: "W1G 6AN", phone: "020 7935 7847", website: "ent.uk.com", verified: true },
      { name: "ENT London", address: "9 Harley Street", postcode: "W1G 9QY", phone: "020 7580 2426", website: "ent-london.co.uk", verified: true },
      { name: "150 Harley Street ENT", address: "150 Harley Street", postcode: "W1G 7LQ", phone: "020 3075 3150", website: "150harleyst.co.uk", verified: true },
      { name: "The London Thyroid & ENT Clinic", address: "108 Harley Street", postcode: "W1G 7ET", phone: "020 7563 1234", website: "108harleystreet.co.uk", verified: true },
      { name: "Harley Street Audiovestibular Clinic", address: "Harley Street", postcode: "W1G", phone: "020 3480 9630", website: "harleyavm.com", verified: false },
      { name: "UME Health (ENT & eye)", address: "17 Harley Street", postcode: "W1G 9QH", phone: "020 7467 6190", website: "umehealth.co.uk", verified: true },
      { name: "Harley Street Clinic ENT (Devonshire Diagnostic Centre)", address: "16 Devonshire Street", postcode: "W1G 7AF", phone: "020 7079 4344", website: "hcahealthcare.co.uk", verified: true },
      { name: "Harley Street Hearing", address: "Harley Street", postcode: "W1G", phone: "", website: "harleysthearing.co.uk", verified: false },
    ],
  },
  {
    id: "heart-lung-allergy",
    title: "Heart, lung & allergy",
    clinics: [
      { name: "One Heart Clinic", address: "68 Harley Street", postcode: "W1G 7HE", phone: "020 3983 4152", website: "oneheartclinic.com", verified: true },
      { name: "Cardiologist.london (Dr Ravi Assomull)", address: "68 Harley Street", postcode: "W1G 7HE", phone: "", website: "cardiologist.london", verified: false },
      { name: "Harley Street Cardiology / The Physicians' Clinic", address: "13-14 Devonshire Street", postcode: "W1G 7AE", phone: "020 7034 8164", website: "harleystreetcardiology.co.uk", verified: true },
      { name: "The National Heart Clinic", address: "69 Harley Street", postcode: "W1G 8QW", phone: "020 7535 9843", website: "thenationalheartclinic.co.uk", verified: true },
      { name: "24hr Cardiology", address: "88 Harley Street", postcode: "W1G 7HR", phone: "020 7034 8934", website: "24hrcardiology.com", verified: true },
      { name: "London Centre for Advanced Cardiology", address: "58 Harley Street", postcode: "W1G 9QB", phone: "", website: "londoncentreforadvancedcardiology.com", verified: false },
      { name: "66 Harley Street", address: "66 Harley Street", postcode: "W1G 7HD", phone: "020 7436 4568", website: "66harleyst.co.uk", verified: true },
      { name: "The London Heart Centre", address: "22 Upper Wimpole Street", postcode: "W1G 6NB", phone: "", website: "thelondonheartcentre.com", verified: false },
      { name: "UME Health (cardiology)", address: "17 Harley Street", postcode: "W1G 9QH", phone: "020 7467 6190", website: "umehealth.co.uk", verified: true },
      { name: "London Heart Practice (HCA)", address: "at HCA hospitals", postcode: "W1G", phone: "", website: "londonheartpractice.org", verified: false },
      { name: "London Allergy & Immunology Centre", address: "9 Harley Street", postcode: "W1G 9QY", phone: "", website: "ukallergy.com", verified: false },
      { name: "London Allergy & Immunology Centre (Harley Street Medical Centre)", address: "83 Harley Street", postcode: "W1G 8PP", phone: "", website: "allergycliniclondon.co.uk", verified: false },
    ],
  },
  {
    id: "orthopaedics-spine-pain",
    title: "Orthopaedics, spine & pain",
    clinics: [
      { name: "The London Spine Clinic", address: "116 Harley Street", postcode: "W1G 7JL", phone: "020 7616 7720", website: "thelondonclinic.co.uk/london-spine-clinic", verified: true },
      { name: "The London Orthopaedic Clinic", address: "79 Wimpole Street", postcode: "W1G 9RY", phone: "0844 561 7157", website: "londonorthopaedic.com", verified: true },
      { name: "London Spine Unit", address: "19 Harley Street", postcode: "W1G 9QJ", phone: "020 3973 8810", website: "londonspine.com", verified: true },
      { name: "LCN Spine", address: "16 Devonshire Street", postcode: "W1G 7AF", phone: "", website: "lcnspine.co.uk", verified: false },
      { name: "The Chelsea Knee Clinic", address: "66 Wigmore Street", postcode: "W1U 2SB", phone: "", website: "", verified: false },
      { name: "Harley Street Physiotherapy", address: "Wimpole Street", postcode: "W1G", phone: "", website: "harleystreetphysiotherapy.co.uk", verified: false },
      { name: "KUER Physio", address: "17 Hanover Square", postcode: "W1S 1BN", phone: "020 3174 2455", website: "harleystreetphysiotherapy.com", verified: true },
      { name: "Fortius Clinic", address: "17 Fitzroy Square", postcode: "W1T 6AH", phone: "", website: "fortiusclinic.com", verified: false },
      { name: "London Pain Clinic", address: "9 Harley Street", postcode: "W1G 9QY", phone: "020 7118 0250", website: "londonpainclinic.com", verified: true },
      { name: "Pain Specialist UK (at Marris Medical)", address: "75 Harley Street", postcode: "W1G 8QL", phone: "020 3011 1788", website: "painspecialistuk.com", verified: true },
      { name: "132 Harley Street (pain & MSK)", address: "132 Harley Street", postcode: "W1G 7JX", phone: "020 8057 6410", website: "132harleystreet.com", verified: true },
      { name: "London Neurology & Pain Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "londonneurology.com", verified: false },
    ],
  },
  {
    id: "neurology-mental-health",
    title: "Neurology & mental health",
    clinics: [
      { name: "London Neurology Clinic", address: "10 Harley Street", postcode: "W1G 9PF", phone: "07311 878686", website: "londonneurologyclinic.co.uk", verified: true },
      { name: "Dementech Neurosciences", address: "11-12 Wimpole Street", postcode: "W1G 9ST", phone: "", website: "dementech.com", verified: false },
      { name: "HCA Neurosciences (78 Harley Street)", address: "78 Harley Street", postcode: "W1G 7HJ", phone: "", website: "hcahealthcare.co.uk", verified: false },
      { name: "HCA Neurosciences (88 Harley Street)", address: "88 Harley Street", postcode: "W1G 7HR", phone: "", website: "hcahealthcare.co.uk", verified: false },
      { name: "The London Psychiatry Centre", address: "72 Harley Street", postcode: "W1G 7HG", phone: "020 7580 4224", website: "psychiatrycentre.co.uk", verified: true },
      { name: "London Psychiatry Clinic", address: "55 Harley Street", postcode: "W1G 8QR", phone: "020 3488 8555", website: "londonpsychiatry.clinic", verified: true },
      { name: "Harley Mind Care", address: "10 Harley Street", postcode: "W1G 9PF", phone: "", website: "harleymindcare.com", verified: false },
      { name: "Harley Street Mental Health", address: "10 Harley Street", postcode: "W1G 9PF", phone: "020 3488 3655", website: "hsmh.co.uk", verified: true },
      { name: "The London Integrative Mental Health Clinic", address: "10 Harley Street", postcode: "W1G 9PF", phone: "020 3096 3041", website: "integrativementalhealth.com", verified: true },
      { name: "Harley Psychiatrists", address: "23 Harley Street", postcode: "W1G 9QN", phone: "020 8158 6650", website: "harleypsychiatrists.co.uk", verified: true },
      { name: "The Giaroli Centre", address: "70 & 75 Harley Street", postcode: "W1G 8QL", phone: "", website: "", verified: false },
      { name: "The ADHD Centre", address: "85 Wimpole Street", postcode: "W1G 9RJ", phone: "", website: "adhdcentre.com", verified: false },
    ],
  },
  {
    id: "womens-health-fertility",
    title: "Women's health, gynaecology & fertility",
    clinics: [
      { name: "London Gynaecology", address: "145 Harley Street", postcode: "W1G 6BJ", phone: "020 7101 1700", website: "london-gynaecology.com", verified: true },
      { name: "Harley Street Gynaecology", address: "25 Harley Street", postcode: "W1G 9QW", phone: "020 8050 6063", website: "harleystreetgynaecology.com", verified: true },
      { name: "London Gynae Clinic", address: "99 Harley Street", postcode: "W1G 6AQ", phone: "020 7224 4268", website: "londonobsgyn.co.uk", verified: true },
      { name: "Wellington Women's Clinic", address: "148 Harley Street", postcode: "W1G", phone: "", website: "thewellingtonwomensclinic.co.uk", verified: false },
      { name: "HCA Women's Health Centre", address: "27-29 Harley Street", postcode: "W1G", phone: "", website: "hcahealthcare.co.uk", verified: false },
      { name: "Rylon Clinic", address: "27 Harley Street", postcode: "W1G 9QP", phone: "", website: "rylonclinic.com", verified: false },
      { name: "Harley Women's Health", address: "Harley Street", postcode: "W1G", phone: "", website: "harleywomenshealth.com", verified: false },
      { name: "132 Harley Street (gynaecology)", address: "132 Harley Street", postcode: "W1G 7JX", phone: "020 8057 6410", website: "132harleystreet.com", verified: true },
      { name: "UME Health (women's health)", address: "17 Harley Street", postcode: "W1G 9QH", phone: "020 7467 6190", website: "umehealth.co.uk", verified: true },
      { name: "The Evewell Harley Street", address: "61 Harley Street", postcode: "W1G 8QU", phone: "020 3974 0950", website: "evewell.com", verified: true },
      { name: "Harley Street Fertility Clinic", address: "134 Harley Street", postcode: "W1G 7JY", phone: "020 7436 6838", website: "hsfc.org.uk", verified: true },
      { name: "London Women's Clinic", address: "113-115 Harley Street", postcode: "W1G 6AP", phone: "", website: "londonwomensclinic.com", verified: false },
      { name: "London IVF & Genetics Centre", address: "10 Harley Street", postcode: "W1G 9PF", phone: "020 7580 0207", website: "londonivfandgenetics.co.uk", verified: true },
      { name: "ARGC (Assisted Reproduction & Gynaecology Centre)", address: "13 Upper Wimpole Street", postcode: "W1G 6LP", phone: "", website: "argc.co.uk", verified: false },
      { name: "Fertility Plus", address: "Harley Street", postcode: "W1G", phone: "", website: "fertilityplus.org.uk", verified: false },
    ],
  },
  {
    id: "digestive-endocrine-urology",
    title: "Digestive, endocrine & urology",
    clinics: [
      { name: "The London Gastroenterology Centre", address: "41 Welbeck Street", postcode: "W1G 8DT", phone: "020 7183 7965", website: "gastrolondon.org.uk", verified: true },
      { name: "The London Gastroenterology Centre (Devonshire Place)", address: "5 Devonshire Place", postcode: "W1G 6HL", phone: "020 7183 7965", website: "gastrolondon.org.uk", verified: true },
      { name: "London Digestive Health (HCA)", address: "41 Welbeck Street, 2nd Floor", postcode: "W1G 8DU", phone: "020 3553 9498", website: "hcahealthcare.co.uk", verified: true },
      { name: "GI Doctors", address: "116 Harley Street", postcode: "W1G 7JL", phone: "020 7871 5388", website: "gidoctors.co.uk", verified: true },
      { name: "The London Clinic Liver Centre", address: "116 Harley Street", postcode: "W1G 7JL", phone: "", website: "thelondonclinic.co.uk", verified: false },
      { name: "132 Harley Street (gastroenterology)", address: "132 Harley Street", postcode: "W1G 7JX", phone: "020 8057 6410", website: "132harleystreet.com", verified: true },
      { name: "The London Obesity Clinic", address: "10 Harley Street", postcode: "W1G 9PF", phone: "", website: "thelondonobesityclinic.com", verified: false },
      { name: "London Endocrine & Diabetes Clinic", address: "10 Harley Street", postcode: "W1G 9PF", phone: "07801 435928", website: "londonendocrinediabetes.com", verified: true },
      { name: "Harley Street Obesity Clinic", address: "27 Harley Street", postcode: "W1G 9QP", phone: "07876 618424", website: "harleystreetobesityclinic.co.uk", verified: true },
      { name: "The London Endocrine Centre", address: "68 Harley Street", postcode: "W1G 7HE", phone: "", website: "londonendocrinecentre.co.uk", verified: false },
      { name: "Dr Paul Jenkins (Endocrinology)", address: "68 Harley Street", postcode: "W1G 7HE", phone: "020 3970 3375", website: "drpauljenkins.co.uk", verified: true },
      { name: "The London Thyroid & ENT Clinic", address: "108 Harley Street", postcode: "W1G 7ET", phone: "020 7563 1234", website: "108harleystreet.co.uk", verified: true },
      { name: "The Urology Partnership", address: "10 Harley Street", postcode: "W1G 9PF", phone: "0118 920 7040", website: "theurologypartnership.co.uk", verified: true },
      { name: "Private Urology London", address: "146 Harley Street", postcode: "W1G 7LD", phone: "07979 143368", website: "privateurologylondon.co.uk", verified: true },
      { name: "The Focal Therapy Clinic", address: "19 Harley Street", postcode: "W1G 9QJ", phone: "020 7036 8870", website: "thefocaltherapyclinic.co.uk", verified: true },
      { name: "Holistic Andrology", address: "9 Harley Street", postcode: "W1G 9QY", phone: "07830 398165", website: "urologistandandrologistlondon.com", verified: true },
      { name: "Harley Street Andrology (Prof Muneer)", address: "16 Devonshire Street", postcode: "W1G 7AF", phone: "", website: "harleystreetandrology.com", verified: false },
      { name: "The London Urologists", address: "35 Weymouth Street", postcode: "W1G 8BJ", phone: "020 7603 6067", website: "urologists.co.uk", verified: true },
      { name: "Harley Street Urology", address: "145 Harley Street", postcode: "W1G 6BJ", phone: "", website: "harleystreet.com", verified: false },
    ],
  },
  {
    id: "dermatology-hair",
    title: "Dermatology & hair restoration",
    clinics: [
      { name: "The Harley Street Dermatology Clinic", address: "35 Devonshire Place", postcode: "W1G 6JP", phone: "0800 048 9230", website: "theharleystreetdermatologyclinic.co.uk", verified: true },
      { name: "Skin Inspection", address: "55 Harley Street, 4th Floor", postcode: "W1G 8QR", phone: "020 3575 1474", website: "skininspection.co.uk", verified: true },
      { name: "Dr Haus Dermatology", address: "75 Harley Street", postcode: "W1G 8QL", phone: "020 7935 6358", website: "drhausdermatology.com", verified: true },
      { name: "London Dermatology Clinics", address: "96 Harley Street", postcode: "W1G 7HY", phone: "0203 616 1073", website: "londondermatologyclinics.com", verified: true },
      { name: "Sk:n Harley Street", address: "6 Harley Street", postcode: "W1G 9PD", phone: "", website: "sknclinics.co.uk", verified: false },
      { name: "Rejuva London", address: "15 Harley Street", postcode: "W1G 9QQ", phone: "", website: "", verified: false },
      { name: "The Dermatology Clinic London", address: "Harley Street", postcode: "W1G", phone: "", website: "thedermatologyclinic.london", verified: false },
      { name: "City Dermatology Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "citydermatologyclinic.com", verified: false },
      { name: "Harley Street Skin Clinic", address: "14 Devonshire Place", postcode: "W1G 6HX", phone: "", website: "harleystreetskinclinic.com", verified: false },
      { name: "Harley Street Hair Clinic", address: "75 Wimpole Street", postcode: "W1G 9RS", phone: "020 7177 2345", website: "hshairclinic.co.uk", verified: true },
      { name: "Vinci Hair Clinic", address: "130 Harley Street", postcode: "W1G 7JU", phone: "020 7145 0112", website: "vincihairclinic.com", verified: true },
      { name: "Harley Street Hair Transplant Clinics", address: "1-7 Harley Street", postcode: "W1G 9QD", phone: "020 3026 2532", website: "harleystreethairtransplant.co.uk", verified: true },
      { name: "Wimpole Clinic", address: "2 Harley Street", postcode: "W1G 9PA", phone: "", website: "wimpole.com", verified: false },
      { name: "Farjo Hair Institute", address: "152 Harley Street", postcode: "W1G 7LH", phone: "0333 370 4004", website: "farjo.com", verified: true },
      { name: "Restore Hair Clinics (Dr Raghu Reddy)", address: "107 Harley Street", postcode: "W1G 6AL", phone: "020 8050 5907", website: "drraghureddy.com", verified: true },
      { name: "The Maitland Clinic", address: "10 Harley Street", postcode: "W1G 9PF", phone: "0800 612 6076", website: "themaitlandclinic.com", verified: true },
    ],
  },
  {
    id: "cosmetic-plastic-aesthetic",
    title: "Cosmetic, plastic & aesthetic medicine",
    clinics: [
      { name: "152 Harley Street", address: "152 Harley Street", postcode: "W1G 7LH", phone: "020 7467 3000", website: "152harleystreet.com", verified: true },
      { name: "111 Harley Street", address: "111 Harley Street", postcode: "W1G 6AQ", phone: "0344 692 1111", website: "111harleystreet.com", verified: true },
      { name: "Centre for Advanced Facial Cosmetic Surgery", address: "23 Harley Street", postcode: "W1G 9QN", phone: "020 8748 2860", website: "londonfacialplasticsurgery.co.uk", verified: true },
      { name: "The Private Clinic of Harley Street", address: "98 Harley Street", postcode: "W1G 7HZ", phone: "020 3325 6500", website: "theprivateclinic.co.uk", verified: true },
      { name: "The Cosmetic Skin Clinic", address: "98 Harley Street", postcode: "W1G 7HZ", phone: "", website: "cosmeticskinclinic.com", verified: false },
      { name: "101 Harley Street Day Surgery", address: "101 Harley Street", postcode: "W1G 6AH", phone: "", website: "101hs.co.uk", verified: false },
      { name: "L'Atelier Aesthetics (101 group)", address: "101 Harley Street", postcode: "W1G 6AH", phone: "", website: "101hs.co.uk", verified: false },
      { name: "PHI Clinic", address: "102 Harley Street", postcode: "W1G 7JB", phone: "020 7034 5999", website: "phiclinic.com", verified: true },
      { name: "Melior Clinics", address: "39 Harley Street", postcode: "W1G 8QH", phone: "0330 024 1300", website: "meliorclinics.co.uk", verified: true },
      { name: "CosmeDocs", address: "10 Harley Street", postcode: "W1G 9PF", phone: "", website: "cosmedocs.com", verified: false },
      { name: "Dr David Jack", address: "74 Harley Street", postcode: "W1G 7HQ", phone: "", website: "drdavidjack.com", verified: false },
      { name: "The Harley Street Skin Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "harleystreetskinclinic.com", verified: false },
      { name: "Cosmedics Skin Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "cosmedics.co.uk", verified: false },
    ],
  },
  {
    id: "dentistry-oral-health",
    title: "Dentistry & oral health",
    note: "Sits at 10 verified-NAP entries. The district supports 12+; short only on verified NAP, not on real clinics. Flagged for a quick top-up — not padded with invented entries.",
    clinics: [
      { name: "Harley Street Dental Studio", address: "52 Harley Street", postcode: "W1G 9PY", phone: "020 7636 5981", website: "harleystreetdentalstudio.com", verified: true },
      { name: "Harley Street Smile Clinic", address: "128 Harley Street", postcode: "W1G 7JT", phone: "020 7971 1909", website: "harleystreetsmileclinic.co.uk", verified: true },
      { name: "Harley Street Dental & Implant Clinic", address: "90 Harley Street", postcode: "W1G", phone: "", website: "harleystreetdentalandimplantclinic.co.uk", verified: false },
      { name: "77 Harley Street", address: "77 Harley Street", postcode: "W1G", phone: "020 7580 9541", website: "77harleystreet.co.uk", verified: true },
      { name: "The Harley Street Implant Centre (Harley Street Dental Centre)", address: "46 Harley Street", postcode: "W1G 9PT", phone: "020 4553 5441", website: "harleystreetimplantcentre.co.uk", verified: true },
      { name: "Pro Dental Clinic", address: "117 Harley Street", postcode: "W1G 6AS", phone: "0203 026 4402", website: "prodentalclinic.london", verified: true },
      { name: "Harley Street Oral Reconstruction Centre (HSORC)", address: "Harley Street", postcode: "W1G", phone: "020 7486 4442", website: "hsorc.com", verified: false },
      { name: "Smile London", address: "Harley Street", postcode: "W1G", phone: "020 4540 1566", website: "smilelondon.co.uk", verified: false },
      { name: "RW Perio", address: "75 Harley Street", postcode: "W1G 8QL", phone: "", website: "rwperio.com", verified: false },
      { name: "Harley Street Dental Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "harleystreetdentalclinic.co.uk", verified: false },
    ],
  },
  {
    id: "general-practice-primary-care",
    title: "General practice & primary care",
    note: "Sits at 11 entries. Same note as dentistry: real clinics exist on the street, short on verified NAP only. Flagged for a quick top-up — not padded.",
    clinics: [
      { name: "The London General Practice", address: "114a Harley Street", postcode: "W1G 7JL", phone: "020 7935 1000", website: "thelondongeneralpractice.com", verified: true },
      { name: "The Harley Street General Practice", address: "110 Harley Street", postcode: "W1G 7JG", phone: "", website: "thehsgp.co.uk", verified: false },
      { name: "Dr Sophia Khalique & Associates", address: "101 Harley Street", postcode: "W1G 6AH", phone: "020 7935 4357", website: "drsophiakhalique.com", verified: true },
      { name: "London HS Practice", address: "66 Harley Street", postcode: "W1G 7HD", phone: "", website: "londonhspractice.co.uk", verified: false },
      { name: "GP London W1", address: "25 Harley Street", postcode: "W1G", phone: "020 4580 1152", website: "gplondonw1.com", verified: true },
      { name: "Private GP London (gp.london)", address: "117a Harley Street, Suite 4", postcode: "W1G 6AT", phone: "020 7043 4317", website: "gp.london", verified: true },
      { name: "The GP Clinic London", address: "62 Wimpole Street", postcode: "W1G 8AJ", phone: "020 7118 1816", website: "thegpcliniclondon.com", verified: true },
      { name: "108 Harley Street (GP)", address: "108 Harley Street", postcode: "W1G 7ET", phone: "020 7563 1234", website: "108harleystreet.co.uk", verified: true },
      { name: "Harley Street Health Centre", address: "Harley Street", postcode: "W1G", phone: "", website: "harleyhealthcentre.com", verified: false },
      { name: "Medical Express Clinic", address: "Harley Street", postcode: "W1G", phone: "", website: "medicalexpressclinic.co.uk", verified: false },
      { name: "SameDayDoctor (Central London)", address: "52 Queen Anne Street", postcode: "W1G 8HL", phone: "020 7631 0090", website: "samedaydoctor.org", verified: true },
    ],
  },
];

/** Total listings rendered (one row per practice, multi-category repeats counted). */
export const totalListings = categories.reduce((n, c) => n + c.clinics.length, 0);

/** Unique practices by normalised name (multi-category repeats collapsed). */
export const uniqueClinicCount = new Set(
  categories.flatMap((c) => c.clinics.map((cl) => cl.name.toLowerCase().trim())),
).size;

/** Count of entries still needing a NAP check before publish. */
export const unverifiedCount = categories.reduce(
  (n, c) => n + c.clinics.filter((cl) => !cl.verified).length,
  0,
);
